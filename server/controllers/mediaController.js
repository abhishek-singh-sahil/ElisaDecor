import Media from '../models/Media.js';
import AuditLog from '../models/AuditLog.js';
import { uploadMedia, deleteMedia } from '../config/cloudinary.js';

// GET media items
export const getMedia = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '24');
    const search = req.query.search || '';
    const type = req.query.type || '';

    const query = {};

    if (search) {
      query.$or = [
        { filename: { $regex: search, $options: 'i' } },
        { originalFilename: { $regex: search, $options: 'i' } },
        { altText: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    if (type) {
      if (type === 'image') {
        query.mimeType = { $regex: '^image/' };
      } else if (type === 'document') {
        query.mimeType = { $not: { $regex: '^image/' } };
      }
    }

    const total = await Media.countDocuments(query);
    const mediaItems = await Media.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.json({
      media: mediaItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch media error:', error);
    return res.status(500).json({ error: 'Failed to fetch media assets' });
  }
};

// POST upload media
export const uploadMediaAsset = async (req, res) => {
  try {
    const file = req.file;
    const { altText = '', title = '', caption = '', folder = 'elisadecor' } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadResult = await uploadMedia(file.buffer, file.originalname, file.mimetype, folder);

    const media = await Media.create({
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      filename: file.originalname,
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      width: uploadResult.width,
      height: uploadResult.height,
      size: uploadResult.size,
      altText,
      title,
      caption,
      folder,
    });

    await AuditLog.create({
      adminId: req.user.id,
      adminName: req.user.name,
      adminEmail: req.user.email,
      action: 'MEDIA_UPLOADED',
      entityType: 'Media',
      entityId: media._id.toString(),
      details: `Uploaded file: ${file.originalname} (${(file.size / 1024).toFixed(1)} KB)`,
    });

    return res.json({ success: true, media });
  } catch (error) {
    console.error('Media upload error:', error);
    return res.status(500).json({ error: 'Failed to upload media asset' });
  }
};

// PATCH update media metadata
export const updateMediaMetadata = async (req, res) => {
  try {
    const { id } = req.params;
    const { altText, title, caption } = req.body;

    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ error: 'Media asset not found' });
    }

    if (altText !== undefined) media.altText = altText;
    if (title !== undefined) media.title = title;
    if (caption !== undefined) media.caption = caption;

    await media.save();

    await AuditLog.create({
      adminId: req.user.id,
      adminName: req.user.name,
      adminEmail: req.user.email,
      action: 'MEDIA_UPDATED',
      entityType: 'Media',
      entityId: id,
      details: `Updated metadata for media file: ${media.filename}`,
    });

    return res.json({ success: true, media });
  } catch (error) {
    console.error('Update media error:', error);
    return res.status(500).json({ error: 'Failed to update media metadata' });
  }
};

// DELETE media asset
export const deleteMediaAsset = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ error: 'Media asset not found' });
    }

    await deleteMedia(media.publicId);
    await Media.findByIdAndDelete(id);

    await AuditLog.create({
      adminId: req.user.id,
      adminName: req.user.name,
      adminEmail: req.user.email,
      action: 'MEDIA_DELETED',
      entityType: 'Media',
      entityId: id,
      details: `Deleted media file: ${media.filename}`,
    });

    return res.json({ success: true, message: 'Media asset deleted successfully' });
  } catch (error) {
    console.error('Delete media error:', error);
    return res.status(500).json({ error: 'Failed to delete media asset' });
  }
};
