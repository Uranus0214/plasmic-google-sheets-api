const { GoogleSpreadsheet } = require('google-spreadsheet');
    
         module.exports = async (req, res) => {
           // Allow requests from any origin for development purposes.
           // In a production environment, you should restrict Access-Control-Allow-Origin to your Plasmic app's domain.
           res.setHeader('Access-Control-Allow-Origin', '*');
           res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
           res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
          // Handle preflight requests (sent by browsers to check CORS settings)
          if (req.method === 'OPTIONS') {
            return res.status(204).end();
          }
   
          if (req.method !== 'POST') {
            res.setHeader('Allow', ['POST']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
          }
   
          const { username, password } = req.body;
   
          if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
          }
   
          console.log(`Login attempt received: user='${username}'`);
   
          try {
            // Initialize the Google Sheet
            const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
   
            // Authenticate with the service account
            await doc.useServiceAccountAuth({
              client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
              private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace \\n with actual newlines
            });
   
            await doc.loadInfo(); // Load the document properties and worksheets
            const sheet = doc.sheetsByIndex[0]; // Assuming your data is on the first sheet
   
            const rows = await sheet.getRows(); // Get all rows from the sheet
   
            // Find the user in the sheet
            const userFound = rows.find(row =>
              row.username === username && row.password === password // Assuming 'username' and 'password' columns
            );
   
            if (userFound) {
              return res.status(200).json({ success: true, message: 'Login successful' });
            } else {
              return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
   
          } catch (error) {
            console.error('Error accessing Google Sheet:', error);
            return res.status(500).json({ success: false, message: 'Server error during login' });
          }
        };
