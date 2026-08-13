import Product from '../models/Product.js';
import SiteSetting from '../models/SiteSetting.js';

// Dynamic sitemap.xml
export const getSitemap = async (req, res) => {
  try {
    const siteUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    const [products, settings] = await Promise.all([
      Product.find({ status: 'PUBLISHED' }).select('slug updatedAt').lean(),
      SiteSetting.findOne({}).lean(),
    ]);

    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/process', priority: '0.7', changefreq: 'monthly' },
      { url: '/projects', priority: '0.7', changefreq: 'weekly' },
      { url: '/contact', priority: '0.8', changefreq: 'monthly' },
      { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
      { url: '/terms', priority: '0.3', changefreq: 'yearly' },
      { url: '/cookie-policy', priority: '0.3', changefreq: 'yearly' },
    ];

    const productUrls = products.map((p) => ({
      url: `/products/${p.slug}`,
      priority: '0.9',
      changefreq: 'weekly',
      lastmod: p.updatedAt?.toISOString().split('T')[0],
    }));

    const allUrls = [...staticPages, ...productUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return res.status(500).send('Failed to generate sitemap');
  }
};

// robots.txt
export const getRobots = async (req, res) => {
  const siteUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const text = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  return res.send(text);
};
