module.exports = (req, res) => {
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

  // Vercel automatically parses the JSON body
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // --- This is where we will add the Google Sheets logic later ---
  console.log(`Login attempt received: user='${username}'`);

  // Mock validation for now.
  if (username === "admin" && password === "password") {
    return res.status(200).json({ success: true, message: 'Login successful (mock)' });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials (mock)' });
  }
};
