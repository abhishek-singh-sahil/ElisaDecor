import { Helmet } from 'react-helmet-async';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://elisadecor.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

export default function SEO({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  noIndex = false,
  schema,
  type = 'website',
}) {
  const fullTitle = title || 'Elisa Decor | Premium Plywood & Interior Surfaces';
  const metaDescription = description || 'Experience premium craftsmanship with Elisa Decor. BWP marine grade waterproof plywood, eco-friendly BWR sheets, and designer interior wood boards.';
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined;
  const resolvedOgImage = ogImage || DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || metaDescription} />
      <meta property="og:image" content={resolvedOgImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content="Elisa Decor" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || metaDescription} />
      <meta name="twitter:image" content={resolvedOgImage} />

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}

// Pre-built schemas for common use cases
export function getOrganizationSchema(settings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings?.brandName || 'Elisa Decor',
    url: SITE_URL,
    logo: settings?.logo?.url || DEFAULT_OG_IMAGE,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings?.phone,
      contactType: 'sales',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      streetAddress: settings?.address,
    },
    sameAs: Object.values(settings?.socialUrls || {}).filter(Boolean),
  };
}

export function getProductSchema(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.longDescription,
    image: product.heroImage?.url,
    sku: product.productCode,
    brand: {
      '@type': 'Brand',
      name: 'Elisa Decor',
    },
    url: `${SITE_URL}/products/${product.slug}`,
  };
}
