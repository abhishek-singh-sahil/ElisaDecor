import Project from '../models/Project.js';
import AuditLog from '../models/AuditLog.js';

// Public GET published projects
export const getPublicProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'PUBLISHED' })
      .sort({ sortOrder: 1, createdAt: -1 })
      .populate('coverImage')
      .populate('gallery')
      .populate('productsUsed')
      .lean();

    return res.json({ success: true, projects });
  } catch (error) {
    console.error('Fetch public projects error:', error);
    return res.status(500).json({ error: 'Failed to fetch projects list' });
  }
};

// Public GET project by slug
export const getPublicProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await Project.findOne({ slug: slug.toLowerCase(), status: 'PUBLISHED' })
      .populate('coverImage')
      .populate('gallery')
      .populate('productsUsed')
      .populate('seo.ogImage')
      .lean();

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.json({ success: true, project });
  } catch (error) {
    console.error('Fetch project detail error:', error);
    return res.status(500).json({ error: 'Failed to fetch project details' });
  }
};

// Admin GET all projects
export const getAdminProjects = async (req, res) => {
  try {
    const projects = await Project.find({})
      .sort({ sortOrder: 1, createdAt: -1 })
      .populate('coverImage')
      .lean();

    return res.json({ success: true, projects });
  } catch (error) {
    console.error('Fetch admin projects error:', error);
    return res.status(500).json({ error: 'Failed to fetch projects list' });
  }
};

// Admin GET project by ID
export const getAdminProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('coverImage')
      .populate('gallery')
      .populate('productsUsed')
      .populate('seo.ogImage')
      .lean();

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.json({ success: true, project });
  } catch (error) {
    console.error('Fetch admin project detail error:', error);
    return res.status(500).json({ error: 'Failed to fetch project details' });
  }
};

// Admin POST create project
export const createProject = async (req, res) => {
  try {
    const body = req.body;
    const { title } = body;

    if (!title) {
      return res.status(400).json({ error: 'Project title is required' });
    }

    // Auto generate slug if not provided
    let slug = body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    slug = slug.toLowerCase().trim();

    const existing = await Project.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: 'A project with this URL slug already exists' });
    }

    const project = await Project.create({
      ...body,
      slug,
    });

    await AuditLog.create({
      adminId: req.user.id,
      adminName: req.user.name,
      adminEmail: req.user.email,
      action: 'PROJECT_CREATED',
      entityType: 'Project',
      entityId: project._id.toString(),
      details: `Created project: ${project.title}`,
    });

    return res.json({ success: true, project });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ error: 'Failed to create project' });
  }
};

// Admin PUT/PATCH update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (body.title && !body.slug) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (body.slug) {
      const slug = body.slug.toLowerCase().trim();
      if (slug !== project.slug) {
        const existing = await Project.findOne({ slug });
        if (existing) {
          return res.status(400).json({ error: 'A project with this URL slug already exists' });
        }
        body.slug = slug;
      }
    }

    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined) {
        project[key] = body[key];
      }
    });

    await project.save();

    await AuditLog.create({
      adminId: req.user.id,
      adminName: req.user.name,
      adminEmail: req.user.email,
      action: 'PROJECT_UPDATED',
      entityType: 'Project',
      entityId: id,
      details: `Updated project: ${project.title}`,
    });

    return res.json({ success: true, project });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ error: 'Failed to update project' });
  }
};

// Admin DELETE project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Rather than hard delete, we can archive or hard delete depending on design.
    // Let's do hard delete since there is no soft delete flag in Schema,
    // or set status to 'ARCHIVED' if it exists.
    // Looking at Schema: status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] }
    // Let's set it to ARCHIVED to match Product behavior!
    project.status = 'ARCHIVED';
    await project.save();

    await AuditLog.create({
      adminId: req.user.id,
      adminName: req.user.name,
      adminEmail: req.user.email,
      action: 'PROJECT_ARCHIVED',
      entityType: 'Project',
      entityId: id,
      details: `Archived project: ${project.title}`,
    });

    return res.json({ success: true, message: 'Project archived successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ error: 'Failed to archive project' });
  }
};
