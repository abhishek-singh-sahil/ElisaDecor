import { Helmet } from 'react-helmet-async';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://elisadecor.in';
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
  schemas,
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
      {schemas && Array.isArray(schemas) && schemas.filter(Boolean).map((sch, idx) => (
        <script key={idx} type="application/ld+json">{JSON.stringify(sch)}</script>
      ))}
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

export function getBreadcrumbSchema(breadcrumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}`,
    })),
  };
}

export function getFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getLocalBusinessSchema(settings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings?.brandName || 'Elisa Decor',
    image: settings?.logo?.url || DEFAULT_OG_IMAGE,
    '@id': SITE_URL,
    url: SITE_URL,
    telephone: settings?.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.address,
      addressLocality: 'Jhumri Telaiya',
      addressRegion: 'JH',
      postalCode: '825409',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 24.4333,
      longitude: 85.5167,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:30',
      closes: '18:30',
    },
  };
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Elisa Decor',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
