import bcrypt from 'bcryptjs';
import AdminUser from '../models/AdminUser.js';
import OTPVerification from '../models/OTPVerification.js';
import { sendOTPEmail } from '../utils/email.js';
import { signToken } from '../middleware/auth.js';

// Helper to generate 6-digit numeric OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 1. Update Display Name (No OTP required)
export const updateProfileName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const admin = await AdminUser.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ error: 'User not found' });
    }

    admin.name = name.trim();
    await admin.save();

    return res.json({
      success: true,
      message: 'Name updated successfully',
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Update name error:', error);
    return res.status(500).json({ error: 'Failed to update name' });
  }
};

// 2. Request OTP for Password Change
export const requestPasswordChangeOTP = async (req, res) => {
  try {
    const email = req.user.email;
    const otp = generateOTP();

    // Remove any previous active password OTPs for this email
    await OTPVerification.deleteMany({ email, type: 'PASSWORD_CHANGE' });

    // Store in DB
    await OTPVerification.create({
      email,
      code: otp,
      type: 'PASSWORD_CHANGE',
    });

    // Send email
    await sendOTPEmail(email, otp, 'PASSWORD_CHANGE');

    return res.json({
      success: true,
      message: 'Verification code sent to your email address.',
    });
  } catch (error) {
    console.error('Request password OTP error:', error);
    return res.status(500).json({ error: 'Failed to send verification code' });
  }
};

// 3. Confirm Password Change
export const confirmPasswordChange = async (req, res) => {
  try {
    const { oldPassword, newPassword, otp } = req.body;

    if (!oldPassword || !newPassword || !otp) {
      return res.status(400).json({ error: 'Old password, new password, and verification code are required' });
    }

    const email = req.user.email;

    // Find and verify OTP
    const verification = await OTPVerification.findOne({
      email,
      code: otp.trim(),
      type: 'PASSWORD_CHANGE',
    });

    if (!verification) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    const admin = await AdminUser.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(oldPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    // Set new password
    admin.passwordHash = bcrypt.hashSync(newPassword, 10);
    await admin.save();

    // Clean up OTP
    await OTPVerification.deleteOne({ _id: verification._id });

    return res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Confirm password change error:', error);
    return res.status(500).json({ error: 'Failed to change password' });
  }
};

// 4. Request OTPs for Email Change
export const requestEmailChangeOTPs = async (req, res) => {
  try {
    const { newEmail } = req.body;

    if (!newEmail || !newEmail.trim()) {
      return res.status(400).json({ error: 'New email address is required' });
    }

    const targetEmail = newEmail.trim().toLowerCase();

    // Check if new email is already in use
    const exists = await AdminUser.findOne({ email: targetEmail });
    if (exists) {
      return res.status(400).json({ error: 'This email address is already in use' });
    }

    const currentEmail = req.user.email;
    if (currentEmail === targetEmail) {
      return res.status(400).json({ error: 'New email cannot be the same as your current email' });
    }

    const otpOld = generateOTP();
    const otpNew = generateOTP();

    // Clear old verification items
    await OTPVerification.deleteMany({ email: currentEmail, type: 'EMAIL_CHANGE_OLD' });
    await OTPVerification.deleteMany({ email: targetEmail, type: 'EMAIL_CHANGE_NEW' });

    // Save both verification items
    await OTPVerification.create({
      email: currentEmail,
      code: otpOld,
      type: 'EMAIL_CHANGE_OLD',
    });

    await OTPVerification.create({
      email: targetEmail,
      code: otpNew,
      type: 'EMAIL_CHANGE_NEW',
    });

    // Send emails to both
    await sendOTPEmail(currentEmail, otpOld, 'EMAIL_CHANGE_OLD');
    await sendOTPEmail(targetEmail, otpNew, 'EMAIL_CHANGE_NEW');

    return res.json({
      success: true,
      message: 'Verification codes dispatched. Check both your current and new email accounts.',
    });
  } catch (error) {
    console.error('Request email OTPs error:', error);
    return res.status(500).json({ error: 'Failed to dispatch verification codes' });
  }
};

// 5. Confirm Email Change (Requires both verification codes)
export const confirmEmailChange = async (req, res) => {
  try {
    const { newEmail, oldEmailOtp, newEmailOtp } = req.body;

    if (!newEmail || !oldEmailOtp || !newEmailOtp) {
      return res.status(400).json({ error: 'New email and both verification codes are required' });
    }

    const currentEmail = req.user.email;
    const targetEmail = newEmail.trim().toLowerCase();

    // Check target email availability again
    const exists = await AdminUser.findOne({ email: targetEmail });
    if (exists) {
      return res.status(400).json({ error: 'The email address is already in use' });
    }

    // Verify current (old) email OTP
    const oldVerification = await OTPVerification.findOne({
      email: currentEmail,
      code: oldEmailOtp.trim(),
      type: 'EMAIL_CHANGE_OLD',
    });

    if (!oldVerification) {
      return res.status(400).json({ error: 'Invalid or expired code for your current email' });
    }

    // Verify new email OTP
    const newVerification = await OTPVerification.findOne({
      email: targetEmail,
      code: newEmailOtp.trim(),
      type: 'EMAIL_CHANGE_NEW',
    });

    if (!newVerification) {
      return res.status(400).json({ error: 'Invalid or expired code for the new email address' });
    }

    const admin = await AdminUser.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Perform update
    admin.email = targetEmail;
    await admin.save();

    // Clear verification codes
    await OTPVerification.deleteOne({ _id: oldVerification._id });
    await OTPVerification.deleteOne({ _id: newVerification._id });

    // Refresh JWT session cookie
    const tokenPayload = {
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };
    const token = signToken(tokenPayload);

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Email address updated successfully',
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    console.error('Confirm email change error:', error);
    return res.status(500).json({ error: 'Failed to update email address' });
  }
};
