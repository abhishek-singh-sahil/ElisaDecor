import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import AdminUser from '../models/AdminUser.js';
import SiteSetting from '../models/SiteSetting.js';
import Homepage from '../models/Homepage.js';
import Product from '../models/Product.js';
import FAQ from '../models/FAQ.js';
import Testimonial from '../models/Testimonial.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elisadecor';

async function seed() {
  console.log('Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');

  console.log('Cleaning existing database records...');
  await AdminUser.deleteMany({});
  await SiteSetting.deleteMany({});
  await Homepage.deleteMany({});
  await Product.deleteMany({});
  await FAQ.deleteMany({});
  await Testimonial.deleteMany({});
  console.log('Database cleaned.');

  // 1. Create Default Admin User
  const passwordHash = bcrypt.hashSync('admin123', 10);
  const admin = await AdminUser.create({
    name: 'Super Admin',
    email: 'admin@elisadecor.com',
    passwordHash: passwordHash,
    role: 'SUPER_ADMIN',
  });
  console.log(`Default Super Admin created: ${admin.email} (password: admin123)`);

  // 2. Create Site Settings
  await SiteSetting.create({
    brandName: 'Elisa Decor',
    tagline: 'Crafting Premium Spaces with Sophisticated Materials',
    phone: '+91 98765 43210',
    email: 'contact@elisadecor.com',
    address: 'Elisa Decor Corporate Office, Plot 45, Industrial Area, Sector 5, Gandhinagar, Gujarat, India',
    whatsApp: '+91 98765 43210',
    socialUrls: {
      facebook: 'https://facebook.com/elisadecor',
      instagram: 'https://instagram.com/elisadecor',
      linkedin: 'https://linkedin.com/company/elisadecor',
      twitter: 'https://twitter.com/elisadecor',
      youtube: 'https://youtube.com/elisadecor',
    },
    businessHours: 'Monday - Saturday: 9:30 AM - 6:30 PM (Sunday Closed)',
    googleMapsUrl: 'https://maps.google.com',
    defaultSeo: {
      title: 'Elisa Decor | Premium Plywood, Boards & Custom Decor Panels',
      description: 'Experience the ultimate in architectural craftsmanship with Elisa Decor. Premium eco-friendly plywood, Club 710 marine grade wood, and designer panels for premium residential and commercial interiors.',
      ogTitle: 'Elisa Decor | Premium Interior Wood Solutions',
      ogDescription: 'Experience the ultimate in architectural craftsmanship with Elisa Decor. Premium eco-friendly plywood, Club 710 marine grade wood, and designer panels.',
    },
    emailSettings: {
      businessEnquiryEmail: 'enquiry@elisadecor.com',
      customerConfirmationOn: true,
      emailSubject: 'New Corporate Website Enquiry - Elisa Decor',
      senderName: 'Elisa Decor CRM',
      replyTo: 'contact@elisadecor.com',
    },
    navigation: [
      { label: 'Home', url: '/', order: 1, visible: true },
      { label: 'About', url: '/about', order: 2, visible: true },
      { label: 'Elisa Green', url: '/products/elisa-green', order: 3, visible: true },
      { label: 'Elisa Club 710', url: '/products/elisa-club-710', order: 4, visible: true },
      { label: 'Elisa Premium', url: '/products/elisa-premium', order: 5, visible: true },
      { label: 'Process', url: '/process', order: 6, visible: true },
      { label: 'Projects', url: '/projects', order: 7, visible: true },
      { label: 'Contact', url: '/contact', order: 9, visible: true },
    ],
    footer: {
      description: 'Elisa Decor represents the height of architectural materials. We craft premium grade plywood and decor panels engineered for luxury spaces, architects, and high-end residential interiors.',
      copyrightText: `© ${new Date().getFullYear()} Elisa Decor. All Rights Reserved.`,
      links: [
        { label: 'Privacy Policy', url: '/privacy-policy' },
        { label: 'Terms of Service', url: '/terms' },
        { label: 'Cookie Policy', url: '/cookie-policy' },
      ],
    },
  });
  console.log('Site settings seeded.');

  // 3. Create 3 Products (same data as original seed)
  const p1 = await Product.create({
    name: 'Elisa Green',
    slug: 'elisa-green',
    productCode: 'ELG-MR-01',
    shortDescription: 'High-density, premium moisture-resistant plywood engineered for long-lasting interiors.',
    longDescription: 'Elisa Green is our premium eco-friendly Commercial MR (Moisture Resistant) and BWR (Boiling Water Resistant) grade plywood. Manufactured using high-quality hardwood timber and bonded with synthetic MUF resin, it provides exceptional stability, resistance to termites, and zero core gap.',
    features: [
      { title: 'Eco-Friendly / Low Emission', description: 'Certified E1 emission standard ensuring healthy indoor air quality.', icon: 'Leaf' },
      { title: 'Termite & Borer Resistant', description: 'Treated with advanced chemical preservatives to prevent insect damage.', icon: 'ShieldAlert' },
      { title: 'Zero Core Gaps', description: 'Manufactured with seamless core layers to prevent warping and internal voids.', icon: 'Grid' },
    ],
    specifications: [
      { key: 'Grade', value: 'BWR Grade (IS:303)' },
      { key: 'Timber Source', value: 'Selected Hardwood' },
      { key: 'Density', value: '720 kg/m³' },
      { key: 'Moisture Content', value: '8 - 12%' },
      { key: 'Adhesive Used', value: 'Melamine Urea Formaldehyde (MUF) Resin' },
      { key: 'Thickness Options', value: '6mm, 9mm, 12mm, 16mm, 19mm' },
    ],
    applications: [
      { title: 'Residential Wardrobes', description: 'Perfect structural strength for durable closets and custom cabinetry.' },
      { title: 'Wall Paneling & Partitions', description: 'High stability reduces warp in large vertical installations.' },
      { title: 'Living Room Furniture', description: 'Seamless screw holding capacity for modern sofas, beds, and tables.' },
    ],
    benefits: [
      'High resistance to changing weather and humidity conditions',
      'Advanced vacuum-pressure chemical treatment protects against borers and termites',
      'High screw-holding capacity ensures structural durability over decades',
    ],
    faqs: [
      { question: 'Is Elisa Green plywood water-resistant?', answer: 'Yes, Elisa Green is a BWR (Boiling Water Resistant) grade plywood.' },
      { question: 'What is the emission rating of Elisa Green?', answer: 'Elisa Green conforms to E1 emission standards.' },
    ],
    status: 'PUBLISHED',
    sortOrder: 1,
    seo: {
      title: 'Elisa Green Plywood | BWR Grade Premium Hardwood Board',
      description: 'Elisa Green is a premium BWR grade hardwood plywood with zero core gaps, termite resistance, and low formaldehyde emissions.',
    },
  });

  const p2 = await Product.create({
    name: 'Elisa Club 710',
    slug: 'elisa-club-710',
    productCode: 'ELC-BWP-710',
    shortDescription: 'Super premium, 100% waterproof Marine-Grade plywood designed for extreme environments.',
    longDescription: 'Elisa Club 710 is our flagship architectural-grade BWP (Boiling Water Proof) Marine Plywood. Built with carefully selected premium tropical hardwood and bonded with un-extended Phenol Formaldehyde resin at high pressure.',
    features: [
      { title: '100% Waterproof (BWP)', description: 'Can withstand continuous exposure to boiling water without layer separation.', icon: 'Droplets' },
      { title: 'Glueshield Technology', description: 'Bonded with high-quality Phenol Formaldehyde resin for permanent adhesion.', icon: 'Wrench' },
      { title: 'Termite and Marine Borer Proof', description: 'Infused with advanced organic chemicals for lifetimes of pest protection.', icon: 'Shield' },
    ],
    specifications: [
      { key: 'Grade', value: 'BWP Marine Grade (IS:710)' },
      { key: 'Timber Source', value: 'Premium Tropical Hardwood' },
      { key: 'Density', value: '800 kg/m³' },
      { key: 'Adhesive Used', value: 'Phenol Formaldehyde (PF) Resin' },
      { key: 'Boiling Water Resistance', value: 'Passes 72 hours boiling test' },
      { key: 'Thickness Options', value: '6mm, 9mm, 12mm, 16mm, 19mm, 25mm' },
    ],
    applications: [
      { title: 'Modular Kitchen Cabinets', description: 'Excellent resistance to moisture, steam, and heavy storage loads.' },
      { title: 'Bathroom Vanity Structures', description: 'Unaffected by direct contact with water, splash, and high humidity.' },
      { title: 'Yachts & Marine Interior', description: 'Meets rigorous standards for marine crafts and seaside villas.' },
    ],
    benefits: [
      'Engineered using premium tropical hardwood for superior density and weight',
      'Treated with specific toxic chemical combinations to repel marine organisms',
      'Warp-free construction under high temperature and high moisture zones',
    ],
    faqs: [
      { question: 'What does IS:710 grade mean?', answer: 'IS:710 is the Bureau of Indian Standards code for Marine Plywood.' },
      { question: 'How long can Elisa Club 710 last in water?', answer: 'Elisa Club 710 uses 100% Phenolic resin bonding that is permanently waterproof.' },
    ],
    status: 'PUBLISHED',
    sortOrder: 2,
    seo: {
      title: 'Elisa Club 710 | Premium IS:710 BWP Marine Plywood',
      description: 'Discover Elisa Club 710 Marine Grade BWP Plywood. 100% waterproof, termite proof, tropical hardwood, designed for modular kitchens and luxury bathrooms.',
    },
  });

  const p3 = await Product.create({
    name: 'Elisa Premium',
    slug: 'elisa-premium',
    productCode: 'ELP-DECOR-03',
    shortDescription: 'Premium decorative panels and custom plywood sheets for high-end interiors.',
    longDescription: 'This is a premium product slot for Elisa Decor\'s upcoming plywood or decorative wood range. The specifications, detailed descriptions, gallery, and FAQs can be customized via the Admin CMS panel.',
    features: [
      { title: 'Dynamic Customization', description: 'Fully configurable features, tags, and descriptive copy via CMS.', icon: 'Settings' },
      { title: 'Premium Aesthetics', description: 'Engineered for high-end designer finishes and surface styling.', icon: 'Sparkles' },
      { title: 'Structural Versatility', description: 'Suited for both structural furniture backings and designer visible panels.', icon: 'Layout' },
    ],
    specifications: [
      { key: 'Grade', value: 'Premium Grade' },
      { key: 'Standard Sizes', value: '8ft x 4ft sheets' },
    ],
    applications: [
      { title: 'Designer Interiors', description: 'Premium visual paneling for custom lounges, offices, and entrance lobbies.' },
      { title: 'Luxury Furniture', description: 'Perfect backing material for high-end veneer and laminate work.' },
    ],
    benefits: ['Customizable product parameters', 'Designed to accommodate exotic veneers', 'Perfect structural support for premium joinery'],
    faqs: [
      { question: 'What is Elisa Premium?', answer: 'Elisa Premium is the third product range from Elisa Decor, fully manageable from the CMS.' },
    ],
    status: 'PUBLISHED',
    sortOrder: 3,
    seo: {
      title: 'Elisa Premium Plywood | Custom Interior Materials',
      description: 'Elisa Premium is the upcoming product category from Elisa Decor. Fully customizable via our administrative panel.',
    },
  });
  console.log(`Seeded 3 products: ${p1.name}, ${p2.name}, ${p3.name}`);

  // 4. Homepage CMS sections
  await Homepage.create({
    sections: [
      {
        type: 'Hero',
        enabled: true,
        order: 1,
        content: {
          slides: [
            {
              title: 'Architectural Wood Solutions',
              subtitle: 'Precision Engineered. Beautifully Crafted.',
              eyebrow: 'ELISA DECOR',
              description: 'We manufacture premium plywood engineered for modular kitchens, luxury wardrobes, and high-performance commercial interiors.',
              ctaText1: 'Explore Range',
              ctaUrl1: '/products/elisa-club-710',
              ctaText2: 'Request Quote',
              ctaUrl2: '/contact',
              desktopImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
              mobileImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
            },
          ],
        },
        settings: { autoplay: true, transitionSpeed: 5000, overlayOpacity: 0.5 },
      },
      {
        type: 'About',
        enabled: true,
        order: 2,
        content: {
          eyebrow: 'ABOUT ELISA DECOR',
          heading: 'Materials that become part of the spaces you imagine.',
          description1: 'Founded on the principles of extreme durability, precision manufacturing, and ecological responsibility.',
          ctaText: 'Discover Elisa Decor',
          ctaUrl: '/about',
          imageLeft: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80',
          imageRight: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80',
        },
        settings: { layout: 'editorial-asymmetric' },
      },
      { type: 'Products', enabled: true, order: 3, content: { eyebrow: 'OUR ARCHITECTURAL PORTFOLIO', heading: 'Engineered for absolute strength and luxury interiors.' }, settings: {} },
      {
        type: 'WhyChooseUs',
        enabled: true,
        order: 4,
        content: {
          eyebrow: 'THE ELISA DECOR STANDARD',
          heading: 'Why Architects & Designers Choose Elisa',
          items: [
            { title: 'Selected Hardwood Core', description: 'Premium density plantation timber cores for high strength.', icon: 'Trees' },
            { title: 'Advanced Chemical Infusion', description: 'Vacuum-pressure treated against termites, borers, and decay.', icon: 'FlaskConical' },
            { title: 'Glue Line Protection', description: 'Superior resin formulations preventing layer separation.', icon: 'Layers' },
            { title: 'Eco-Standard Emission', description: 'E1 low emissions for absolute indoor safety.', icon: 'Leaf' },
          ],
        },
        settings: { columns: 4 },
      },
      {
        type: 'CTA',
        enabled: true,
        order: 5,
        content: {
          heading: 'Ready to build spaces that endure?',
          subtitle: 'Enquire today to receive tailored product consultations and custom quotes.',
          primaryCtaText: 'Enquire Now',
          primaryCtaUrl: '/contact',
          secondaryCtaText: 'Download Brochures',
          secondaryCtaUrl: '/contact',
        },
        settings: { align: 'center' },
      },
    ],
    seo: {
      title: 'Elisa Decor | Premium Plywood, Marine Grade Boards & Custom Materials',
      description: 'Welcome to Elisa Decor. We engineer premium, warp-free, and termite-resistant BWP marine-grade plywood and commercial BWR sheets for architects and luxury interiors.',
    },
  });
  console.log('Homepage CMS sections configured.');

  await FAQ.create({ question: 'What is the difference between BWR and BWP grade plywood?', answer: 'BWR = Boiling Water Resistant (wardrobes, furniture). BWP = Boiling Water Proof (kitchens, bathrooms).', published: true, sortOrder: 1 });
  await FAQ.create({ question: 'How can I verify if Elisa plywood is genuine?', answer: 'All Elisa Decor products come with a unique branding stamp and QR codes on the board face.', published: true, sortOrder: 2 });

  await Testimonial.create({ name: 'Anjali Sharma', designation: 'Principal Architect', company: 'Studio Line Design', testimonial: 'Elisa Club 710 has become our default specification. The calibration is perfect, and we have had zero warping complaints across multiple modular kitchen projects.', status: 'PUBLISHED', sortOrder: 1 });
  await Testimonial.create({ name: 'Rajesh Patel', designation: 'Interior Contractor', company: 'Patel Joinery Works', testimonial: 'Elisa Green BWR plywood has excellent screw-holding capacity. The density is uniform with zero gaps inside.', status: 'PUBLISHED', sortOrder: 2 });
  console.log('Testimonials & FAQs seeded.');

  await mongoose.disconnect();
  console.log('\n✅ Database seeding complete. Connection closed safely.\n');
  console.log(`   Admin Login: admin@elisadecor.com`);
  console.log(`   Password:    admin123\n`);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
