import crypto from 'crypto';
import Enquiry from '../models/Enquiry.js';
import SiteSetting from '../models/SiteSetting.js';
import Product from '../models/Product.js';
import AuditLog from '../models/AuditLog.js';
import { sendEnquiryEmail, sendCustomerConfirmation } from '../utils/email.js';

// Public Submit Enquiry
export const createEnquiry = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      city,
      state,
      company,
      productId,
      requirement,
      message,
      sourcePage,
      consent,
      website, // Honeypot field
    } = req.body;

    // 1. Honeypot check
    if (website && website.trim() !== '') {
      console.warn('Honeypot field triggered. Silently ignoring submission.');
      return res.json({
        success: true,
        message: 'Thank you. Your enquiry has been received. Our team will get back to you shortly.',
      });
    }

    // 2. Input validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toLowerCase().trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // 3. IP Rate limiting
    const ip = req.headers['x-forwarded-for'] || req.ip || '127.0.0.1';
    const ipHash = crypto.createHash('sha256').update(String(ip)).digest('hex');

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await Enquiry.countDocuments({
      ipHash,
      createdAt: { $gte: oneHourAgo },
    });

    if (recentCount >= 5) {
      return res.status(429).json({
        error: 'Too many submissions. Please wait an hour before submitting another enquiry.',
      });
    }

    // 4. Product Snapshot
    let productNameSnapshot = '';
    let productSlug = '';
    if (productId) {
      const product = await Product.findById(productId);
      if (product) {
        productNameSnapshot = product.name;
        productSlug = product.slug;
      }
    }

    const settings = await SiteSetting.findOne({});
    const userAgent = req.headers['user-agent'] || '';

    const enquiry = await Enquiry.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      city: (city || '').trim(),
      state: (state || '').trim(),
      company: (company || '').trim(),
      productId: productId || null,
      productNameSnapshot: productNameSnapshot || 'General Enquiry',
      productSlug: productSlug || '',
      requirement: (requirement || message || '').trim(),
      message: (message || requirement || '').trim(),
      sourcePage: (sourcePage || '').trim(),
      consent: !!consent,
      ipHash,
      userAgent,
      status: 'NEW',
    });

    // 5. Emails
    try {
      await sendEnquiryEmail(enquiry, settings);
      await sendCustomerConfirmation(enquiry, settings);
    } catch (emailErr) {
      console.error('Email notification error:', emailErr);
    }

    return res.json({
      success: true,
      message: 'Thank you. Your enquiry has been received. Our team will get back to you shortly.',
    });
  } catch (error) {
    console.error('Submit enquiry error:', error);
    return res.status(500).json({ error: 'Failed to process your enquiry. Please try again later.' });
  }
};

// Admin Fetch List
export const getEnquiries = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '20');
    const status = req.query.status || '';
    const search = req.query.search || '';

    const query = {};
    if (status) {
      query.status = status;
    } else {
      query.status = { $ne: 'SPAM' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Enquiry.countDocuments(query);
    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('productId')
      .lean();

    return res.json({
      success: true,
      enquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch enquiries error:', error);
    return res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
};

// Admin Fetch One
export const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).populate('productId');
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    return res.json({ success: true, enquiry });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch enquiry details' });
  }
};

// Admin Update
export const updateEnquiry = async (req, res) => {
  try {
    const { status, noteText } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    let changeDetails = '';

    if (status) {
      const oldStatus = enquiry.status;
      enquiry.status = status;
      changeDetails += `Status changed from ${oldStatus} to ${status}. `;
    }

    if (noteText && noteText.trim() !== '') {
      enquiry.notes.push({
        note: noteText.trim(),
        author: req.user.name || 'Admin',
        createdAt: new Date(),
      });
      changeDetails += 'Added internal log note.';
    }

    await enquiry.save();

    await AuditLog.create({
      adminId: req.user.id,
      adminName: req.user.name,
      adminEmail: req.user.email,
      action: 'ENQUIRY_UPDATED',
      entityType: 'Enquiry',
      entityId: req.params.id,
      details: `Updated enquiry for ${enquiry.name}. ${changeDetails}`,
    });

    return res.json({ success: true, enquiry });
  } catch (error) {
    console.error('Update enquiry error:', error);
    return res.status(500).json({ error: 'Failed to update enquiry' });
  }
};

// Admin Delete
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    await Enquiry.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      adminId: req.user.id,
      adminName: req.user.name,
      adminEmail: req.user.email,
      action: 'ENQUIRY_DELETED',
      entityType: 'Enquiry',
      entityId: req.params.id,
      details: `Deleted enquiry record for ${enquiry.name} (${enquiry.email})`,
    });

    return res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Delete enquiry error:', error);
    return res.status(500).json({ error: 'Failed to delete enquiry record' });
  }
};
