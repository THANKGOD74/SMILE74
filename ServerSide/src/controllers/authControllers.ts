import { Request, Response } from 'express';
import User from '../model/User';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleWare/auth';
import crypto from 'crypto';
import { sendEmail } from '../services/emailService';
import { passwordResetEmailTemplate, verificationEmailTemplate } from '../utils/emailTemplates';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const user = new User({ name, email, password });
    await user.save();

    // Generate verification token (kept for when email is re-enabled)
    const verifyToken = user.generateVerificationToken();
    await user.save();

    //  TEMPORARILY: Auto-verify the user (email sending bypassed)
    user.isVerified = true;
    await user.save();

    //  Email sending (keep as-is for later)
    // const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verifyToken}`;
    // const emailContent = verificationEmailTemplate(user.name, verifyUrl);
    // await sendEmail(user.email, emailContent.subject, emailContent.html);


    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: 'Registration successful. You can now log in.',
      token, 
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    //  Email verification check (keep as-is for later)
    // if (!user.isVerified) {
    //   return res.status(401).json({ error: 'Please verify your email before logging in.' });
    // }

    const token = generateToken(user._id.toString());
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const tokenString = Array.isArray(token) ? token[0] : token;
    if (!tokenString) {
      res.status(400).json({ error: 'Invalid token' });
      return;
    }
    const hashedToken = crypto.createHash('sha256').update(tokenString).digest('hex');
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationExpires: { $gt: new Date() },
    });
    if (!user) {
      res.status(400).json({ error: 'Invalid or expired verification token' });
      return;
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();
    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { name, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (name) {
      user.name = name;
    }

    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ error: 'Current password is required to change password' });
        return;
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        res.status(401).json({ error: 'Current password is incorrect' });
        return;
      }
      user.password = newPassword;
    }

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: 'No user found with this email' });
      return;
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    // Send the email
    const emailContent = passwordResetEmailTemplate(user.name, resetUrl);
    await sendEmail(user.email, emailContent.subject, emailContent.html);

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    
    const tokenString = Array.isArray(token) ? token[0] : token;
    if (!tokenString) {
      res.status(400).json({ error: 'Invalid reset token' });
      return;
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(tokenString).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ error: 'Invalid or expired reset token' });
      return;
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};







// import { Request, Response } from 'express';
// import User from '../model/User';
// import { generateToken } from '../utils/jwt';
// import { AuthRequest } from '../middleWare/auth';
// import crypto from 'crypto';
// import { sendEmail } from '../services/emailService';
// import { passwordResetEmailTemplate, verificationEmailTemplate } from '../utils/emailTemplates';

// export const register = async (req: Request, res: Response) => {
//   try {
//     const { name, email, password } = req.body;
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ error: 'Email already in use' });

//     const user = new User({ name, email, password });
//     await user.save();

//     // Generate verification token
//     const verifyToken = user.generateVerificationToken();
//     await user.save();

//     // Send verification email
//     const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verifyToken}`;
//     // const emailContent = verificationEmailTemplate(user.name, verifyUrl);
//     // await sendEmail(user.email, emailContent.subject, emailContent.html);
//     res.status(201).json({
//     message: 'Registration successful. Please check your email to verify your account.',
//     });
  
//     res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
//   } catch (err) {
//     res.status(500).json({ error: (err as Error).message });
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ error: 'Invalid credentials' });

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

//     // if (!user.isVerified) {
//     //   return res.status(401).json({ error: 'Please verify your email before logging in.' });
//     // }

//     const token = generateToken(user._id.toString());
//     res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
//   } catch (err) {
//     res.status(500).json({ error: (err as Error).message });
//   }
// };

// export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { token } = req.params;
//     const tokenString = Array.isArray(token) ? token[0] : token;
//     if (!tokenString) {
//       res.status(400).json({ error: 'Invalid token' });
//       return;
//     }
//     const hashedToken = crypto.createHash('sha256').update(tokenString).digest('hex');
//     const user = await User.findOne({
//       verificationToken: hashedToken,
//       verificationExpires: { $gt: new Date() },
//     });
//     if (!user) {
//       res.status(400).json({ error: 'Invalid or expired verification token' });
//       return;
//     }
//     user.isVerified = true;
//     user.verificationToken = undefined;
//     user.verificationExpires = undefined;
//     await user.save();
//     res.json({ message: 'Email verified successfully. You can now log in.' });
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };

// export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const userId = req.user._id;
//     const { name, currentPassword, newPassword } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       res.status(404).json({ error: 'User not found' });
//       return;
//     }

//     if (name) {
//       user.name = name;
//     }

//     if (newPassword) {
//       if (!currentPassword) {
//         res.status(400).json({ error: 'Current password is required to change password' });
//         return;
//       }
//       const isMatch = await user.comparePassword(currentPassword);
//       if (!isMatch) {
//         res.status(401).json({ error: 'Current password is incorrect' });
//         return;
//       }
//       user.password = newPassword;
//     }

//     await user.save();

//     res.json({
//       id: user._id,
//       name: user.name,
//       email: user.email,
//     });
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };


// export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       res.status(404).json({ error: 'No user found with this email' });
//       return;
//     }

//     // Generate reset token
//     const resetToken = user.generatePasswordResetToken();
//     await user.save();

//     // Create reset URL
//     const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    
//   // Send the email
// const emailContent = passwordResetEmailTemplate(user.name, resetUrl);
// await sendEmail(user.email, emailContent.subject, emailContent.html);

// res.json({ message: 'Password reset link sent to your email' });
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };



// //  NEW: Reset Password
// export const resetPassword = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { token } = req.params;
//     const { password } = req.body;

//     //  Ensure token is a string (Express can return string | string[])
//     const tokenString = Array.isArray(token) ? token[0] : token;
//     if (!tokenString) {
//       res.status(400).json({ error: 'Invalid reset token' });
//       return;
//     }

//     // Hash the token to compare with stored hash
//     const hashedToken = crypto.createHash('sha256').update(tokenString).digest('hex');

//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpires: { $gt: new Date() },
//     });

//     if (!user) {
//       res.status(400).json({ error: 'Invalid or expired reset token' });
//       return;
//     }

//     // Set new password
//     user.password = password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     res.json({ message: 'Password reset successfully' });
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };
// // ... rest of your existing controllers (updateProfile, forgotPassword, resetPassword) remain unchanged
// // I'm not repeating them here to save space – keep them exactly as they are.

