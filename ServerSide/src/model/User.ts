import { Schema, Document } from "mongoose";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    verificationToken?: string;
    verificationExpires?: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generatePasswordResetToken(): string;
    generateVerificationToken(): string;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
UserSchema.methods.generatePasswordResetToken = function (): string {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    return resetToken;
};

// Generate email verification token
UserSchema.methods.generateVerificationToken = function (): string {
    const token = crypto.randomBytes(32).toString('hex');
    this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');
    this.verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    return token;
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;




// import { Schema, Document } from "mongoose";
// import mongoose from "mongoose";
// import bcrypt from 'bcryptjs';
// import crypto from 'crypto';

// export interface IUser extends Document {
//     name: string;
//     email: string;
//     password: string;
//     resetPasswordToken?: string;
//     resetPasswordExpires?: Date;
//     comparePassword(candidatePassword: string): Promise<boolean>;
//     generatePasswordResetToken(): string;
// }

// const UserSchema = new Schema<IUser>({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     resetPasswordToken: {
//         type: String,
//     },
//     resetPasswordExpires: {
//         type: Date,
//     }
// }, { timestamps: true });

// // Hash password before saving
// UserSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         return;
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });

// // Compare password – used during login
// UserSchema.methods.comparePassword = async function (
//     enteredPassword: string
// ): Promise<boolean> {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// // Generate password reset token
// UserSchema.methods.generatePasswordResetToken = function (): string {
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     this.resetPasswordToken = crypto
//         .createHash('sha256')
//         .update(resetToken)
//         .digest('hex');
//     this.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
//     return resetToken;
// };

// const User = mongoose.model<IUser>("User", UserSchema);
// export default User;




// import { Schema, Document } from "mongoose";
// import mongoose  from "mongoose";
// import bcrypt from 'bcryptjs';


// export interface IUser extends Document {
//     name: string;
//     email: string; 
//     password: string;
//     comparePassword(candidatePassword: string): Promise<boolean>;
// }

// const UserSchema = new Schema<IUser>({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     }
// }, {timestamps: true});

// // Hash password before saving
// UserSchema.pre( 'save', async function (next) {
//     if (!this.isModified ('password')) {
//         return;
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash (this.password, salt);
// });

// // COMPARE PASSWORD — used during login

// UserSchema.methods.comparePassword = async function (
//   enteredPassword: string
// ): Promise<boolean> {
//   return await bcrypt.compare(enteredPassword, this.password);
// };




// const User = mongoose.model<IUser>("User", UserSchema);
// export default User;