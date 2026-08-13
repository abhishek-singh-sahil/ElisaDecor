import bcrypt from 'bcryptjs';
import AdminUser from '../models/AdminUser.js';
import { signToken, verifyToken } from '../middleware/auth.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

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
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.json({
      success: true,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred during login' });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('admin_token', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req, res) => {
  try {
    let token = req.cookies?.admin_token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ user: null });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ user: null });
    }

    return res.json({ success: true, user: decoded });
  } catch (error) {
    return res.status(500).json({ user: null });
  }
};

// Admin Dashboard stats controller
import Enquiry from '../models/Enquiry.js';
import Product from '../models/Product.js';
import Media from '../models/Media.js';

export const getDashboardMetrics = async (req, res) => {
  try {
    const [
      totalEnquiries,
      newEnquiries,
      inProgressEnquiries,
      totalProducts,
      totalMedia,
      recentEnquiries,
    ] = await Promise.all([
      Enquiry.countDocuments({ status: { $ne: 'SPAM' } }),
      Enquiry.countDocuments({ status: 'NEW' }),
      Enquiry.countDocuments({ status: { $in: ['CONTACTED', 'IN_PROGRESS', 'QUALIFIED'] } }),
      Product.countDocuments({}),
      Media.countDocuments({}),
      Enquiry.find({ status: { $ne: 'SPAM' } })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('productId')
        .lean(),
    ]);

    return res.json({
      success: true,
      metrics: {
        totalEnquiries,
        newEnquiries,
        inProgressEnquiries,
        totalProducts,
        totalMedia,
      },
      recentEnquiries,
    });
  } catch (error) {
    console.error('Fetch dashboard metrics error:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
};

