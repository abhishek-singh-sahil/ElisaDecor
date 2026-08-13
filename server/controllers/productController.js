import Product from '../models/Product.js';
import AuditLog from '../models/AuditLog.js';

// Public GET published products
export const getPublicProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'PUBLISHED' })
      .sort({ sortOrder: 1, createdAt: -1 })
      .populate('heroImage')
      .populate('mobileHeroImage')
      .populate('gallery')
      .lean();

    return res.json({ success: true, products });
  } catch (error) {
    console.error('Fetch public products error:', error);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Public GET product by slug
export const getPublicProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug: slug.toLowerCase(), status: 'PUBLISHED' })
      .populate('heroImage')
      .populate('mobileHeroImage')
      .populate('gallery')
      .populate('applications.image')
      .populate('seo.ogImage')
      .lean();

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({ success: true, product });
  } catch (error) {
    console.error('Fetch product detail error:', error);
    return res.status(500).json({ error: 'Failed to fetch product details' });
  }
};

// Admin GET all products (including DRAFT & ARCHIVED)
export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ sortOrder: 1, createdAt: -1 })
      .populate('heroImage')
      .lean();

    return res.json({ success: true, products });
  } catch (error) {
    console.error('Fetch admin products error:', error);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Admin GET product by ID
export const getAdminProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('heroImage')
      .populate('mobileHeroImage')
      .populate('gallery')
      .populate('seo.ogImage')
      .lean();

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({ success: true, product });
  } catch (error) {
    console.error('Fetch product detail error:', error);
    return res.status(500).json({ error: 'Failed to fetch product details' });
  }
};

// Admin POST create product
export const createProduct = async (req, res) => {
  try {
    const body = req.body;
    const { name, slug } = body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const existing = await Product.findOne({ slug: slug.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ error: 'A product with this slug already exists' });
    }

    const product = await Product.create({
      ...body,
      slug: slug.toLowerCase().trim(),
    });

    await AuditLog.create({
      adminId: req.user.id,
      adminName: req.user.name,
      adminEmail: req.user.email,
      action: 'PRODUCT_CREATED',
      entityType: 'Product',
      entityId: product._id.toString(),
      details: `Created product: ${product.name}`,
    });

    return res.json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ error: 'Failed to create product' });
  }
};

// Admin PUT/PATCH update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (body.slug && body.slug.toLowerCase().trim() !== product.slug) {
      const existing = await Product.findOne({ slug: body.slug.toLowerCase().trim() });
      if (existing) {
        return res.status(400).json({ error: 'A product with this slug already exists' });
      }
    }

    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined) {
        product[key] = body[key];
      }
    });

    await product.save();

    await AuditLog.create({
      adminId: req.user.id,
      adminName: req.user.name,
      adminEmail: req.user.email,
      action: 'PRODUCT_UPDATED',
      entityType: 'Product',
      entityId: id,
      details: `Updated product: ${product.name}`,
    });

    return res.json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ error: 'Failed to update product' });
  }
};

// Admin DELETE (Archive) product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.status = 'ARCHIVED';
    await product.save();

    await AuditLog.create({
      adminId: req.user.id,
      adminName: req.user.name,
      adminEmail: req.user.email,
      action: 'PRODUCT_ARCHIVED',
      entityType: 'Product',
      entityId: id,
      details: `Archived product: ${product.name}`,
    });

    return res.json({ success: true, message: 'Product archived successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ error: 'Failed to archive product' });
  }
};
