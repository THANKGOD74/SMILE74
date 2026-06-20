
import jwt from 'jsonwebtoken';
import crypto from 'crypto'

// Load and validate the secret once at module startup
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// GENERATE JWT — used after login
// Sent back to frontend and stored in localStorage
export const generateToken = (userId: string): string => {
  return (jwt.sign as any)(
    { userId },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export const verifyToken = (token: string): { userId: string } => {
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  return decoded;
};


// GENERATE RANDOM TOKEN — used for email verify & password reset
// Raw token goes in the email link
// Hashed token gets stored in the database
export const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};



// HASH TOKEN — before storing in database
export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};