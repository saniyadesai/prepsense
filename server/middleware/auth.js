import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  // Get the token from the Authorization header
  // Headers look like: "Authorization: Bearer eyJhbGci..."
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user ID to the request so routes can use it
    req.user = decoded;
    next(); // continue to the actual route handler
  } catch (err) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};