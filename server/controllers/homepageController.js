import Homepage from '../models/Homepage.js';
import AuditLog from '../models/AuditLog.js';

// Public GET homepage
export const getPublicHomepage = async (req, res) => {
  try {
    let homepage = await Homepage.findOne({}).populate('seo.ogImage').lean();
    if (!homepage) {
      homepage = await Homepage.create({ sections: [], seo: {} });
    }
    return res.json({ success: true, homepage });
  } catch (error) {
    console.error('Fetch homepage error:', error);
    return res.status(500).json({ error: 'Failed to fetch homepage configuration' });
  }
};

// Admin GET homepage
export const getAdminHomepage = async (req, res) => {
  try {
    let homepage = await Homepage.findOne({}).populate('seo.ogImage');
    if (!homepage) {
      homepage = await Homepage.create({ sections: [], seo: {} });
    }
    return res.json({ success: true, homepage });
  } catch (error) {
    console.error('Fetch admin homepage error:', error);
    return res.status(500).json({ error: 'Failed to fetch homepage configuration' });
  }
};

// Admin PUT/PATCH update homepage
export const updateHomepage = async (req, res) => {
  try {
    const { sections, seo } = req.body;

    let homepage = await Homepage.findOne({});
    if (!homepage) {
      homepage = new Homepage({ sections: [], seo: {} });
    }

    if (sections !== undefined) homepage.sections = sections;
    if (seo !== undefined) homepage.seo = seo;

    await homepage.save();

    await AuditLog.create({
      adminId: req.user.id,
      adminName: req.user.name,
      adminEmail: req.user.email,
      action: 'HOMEPAGE_UPDATED',
      entityType: 'Homepage',
      entityId: homepage._id.toString(),
      details: 'Updated homepage sections, layouts, and page SEO configs.',
    });

    return res.json({ success: true, homepage });
  } catch (error) {
    console.error('Update homepage error:', error);
    return res.status(500).json({ error: 'Failed to update homepage configuration' });
  }
};
