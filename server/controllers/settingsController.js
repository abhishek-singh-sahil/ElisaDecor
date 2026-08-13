import SiteSetting from '../models/SiteSetting.js';
import AuditLog from '../models/AuditLog.js';

// Public GET settings
export const getPublicSettings = async (req, res) => {
  try {
    let settings = await SiteSetting.findOne({})
      .populate('logo')
      .populate('favicon')
      .populate('defaultSeo.ogImage')
      .lean();
    if (!settings) {
      settings = await SiteSetting.create({ brandName: 'Elisa Decor' });
    }
    return res.json({ success: true, settings });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return res.status(500).json({ error: 'Failed to fetch global configurations' });
  }
};

// Admin GET settings
export const getAdminSettings = async (req, res) => {
  try {
    let settings = await SiteSetting.findOne({})
      .populate('logo')
      .populate('favicon')
      .populate('defaultSeo.ogImage');
    if (!settings) {
      settings = await SiteSetting.create({ brandName: 'Elisa Decor' });
    }
    return res.json({ success: true, settings });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return res.status(500).json({ error: 'Failed to fetch global configurations' });
  }
};

// Admin PUT/PATCH update settings
export const updateSettings = async (req, res) => {
  try {
    const body = req.body;
    let settings = await SiteSetting.findOne({});
    if (!settings) {
      settings = new SiteSetting({});
    }

    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined) {
        settings[key] = body[key];
      }
    });

    await settings.save();

    await AuditLog.create({
      adminId: req.user.id,
      adminName: req.user.name,
      adminEmail: req.user.email,
      action: 'SETTINGS_UPDATED',
      entityType: 'SiteSetting',
      entityId: settings._id.toString(),
      details: 'Updated global site settings (branding, contact details, or SMTP configs).',
    });

    return res.json({ success: true, settings });
  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({ error: 'Failed to update global configurations' });
  }
};
