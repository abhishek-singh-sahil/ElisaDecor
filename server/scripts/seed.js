import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import AdminUser from '../models/AdminUser.js';
import SiteSetting from '../models/SiteSetting.js';
import Homepage from '../models/Homepage.js';
import Product from '../models/Product.js';
import FAQ from '../models/FAQ.js';
import Testimonial from '../models/Testimonial.js';
import Media from '../models/Media.js';
import Project from '../models/Project.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elisadecor';

async function createMediaRecord(url, filename, title = '', altText = '') {
  return await Media.create({
    url,
    publicId: `seeded-${filename.split('.')[0]}-${Math.random().toString(36).substring(7)}`,
    filename,
    originalFilename: filename,
    mimeType: 'image/jpeg',
    width: 1200,
    height: 800,
    size: 250000,
    altText: altText || title,
    title: title,
    caption: title,
    folder: 'seeding',
  });
}

async function copyAndSeedUploadedCreative(srcPath, filename, title) {
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const destPath = path.join(uploadDir, filename);
  let localUrl = `/uploads/${filename}`;
  let size = 250000;

  if (fs.existsSync(srcPath)) {
    try {
      fs.copyFileSync(srcPath, destPath);
      const stats = fs.statSync(destPath);
      size = stats.size;
      console.log(`Successfully copied creative to uploads: ${filename}`);
    } catch (err) {
      console.error(`Failed to copy creative ${filename}:`, err.message);
    }
  } else {
    console.warn(`Local source path not found for creative ${filename}, using fallback URL.`);
    // Fallback to stock unsplash image if local creative file is missing
    if (filename.includes('green')) {
      localUrl = 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80';
    } else if (filename.includes('club-710')) {
      localUrl = 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80';
    } else {
      localUrl = 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80';
    }
  }

  return await Media.create({
    url: localUrl,
    publicId: `seeded-creative-${filename.split('.')[0]}`,
    filename: filename,
    originalFilename: filename,
    mimeType: 'image/jpeg',
    width: 1200,
    height: 800,
    size: size,
    altText: title,
    title: title,
    caption: title,
    folder: 'seeding',
  });
}

async function seed() {
  console.log('Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');

  // Fetch and preserve existing logo/favicon before cleaning to avoid overwriting manual uploads
  const existingSetting = await SiteSetting.findOne({}).lean();
  const preservedLogoId = existingSetting?.logo || null;
  const preservedFaviconId = existingSetting?.favicon || null;

  console.log('Cleaning existing database records...');
  await AdminUser.deleteMany({});
  await SiteSetting.deleteMany({});
  await Homepage.deleteMany({});
  await Project.deleteMany({});
  await Product.deleteMany({});
  await FAQ.deleteMany({});
  await Testimonial.deleteMany({});
  
  // Clean up all media except the manually uploaded site logo and favicon
  const preserveIds = [];
  if (preservedLogoId) preserveIds.push(preservedLogoId);
  if (preservedFaviconId) preserveIds.push(preservedFaviconId);
  
  await Media.deleteMany({ _id: { $nin: preserveIds } });
  console.log('Database cleaned. Preserved custom logo/favicon assets.');

  // 1. Create Default Admin User
  const passwordHash = bcrypt.hashSync('admin123', 10);
  const admin = await AdminUser.create({
    name: 'Super Admin',
    email: 'admin@elisadecor.com',
    passwordHash: passwordHash,
    role: 'SUPER_ADMIN',
  });
  console.log(`Default Super Admin created: ${admin.email} (password: admin123)`);

  // 2. Copy and Seed Product Creatives (Source of Truth)
  console.log('Seeding product branding creative assets...');
  
  const creativeGreen = await copyAndSeedUploadedCreative(
    'C:/Users/abhis/.gemini/antigravity/brain/fe54d09b-7ee4-49bc-90cd-2bf4fa60e040/.user_uploaded/media_1787679349081.jpg',
    'elisa-green-creative.jpg',
    'Elisa Green Plywood Creative Showcase'
  );
  
  const creativeClub710 = await copyAndSeedUploadedCreative(
    'C:/Users/abhis/.gemini/antigravity/brain/fe54d09b-7ee4-49bc-90cd-2bf4fa60e040/.user_uploaded/media_1787679355038.jpg',
    'elisa-club-710-creative.jpg',
    'Elisa Club 710 Plywood Creative Showcase'
  );
  
  const creativePrime = await copyAndSeedUploadedCreative(
    'C:/Users/abhis/.gemini/antigravity/brain/fe54d09b-7ee4-49bc-90cd-2bf4fa60e040/.user_uploaded/media_1787679361676.jpg',
    'decor-club-prime-creative.jpg',
    'Decor Club Prime Plywood Creative Showcase'
  );

  // Seed generic plywood/wood texture assets for galleries and listings
  const greenHero = await createMediaRecord(
    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80',
    'elisa-green-hero.jpg',
    'Elisa Green calibrated wood planks surface',
    'Calibrated wood grain sheets demonstrating smooth plywood surfaces.'
  );
  const greenMobileHero = await createMediaRecord(
    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
    'elisa-green-mobile-hero.jpg',
    'Elisa Green mobile calibrated wood surface'
  );
  const greenGal1 = await createMediaRecord(
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    'elisa-green-texture.jpg',
    'Finished wood grain texture',
    'Close-up of premium calibrated wood board face.'
  );
  const greenGal2 = await createMediaRecord(
    'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80',
    'elisa-green-logs.jpg',
    'Raw plantation timber wood logs stack',
    'Sustainable plantation wood logs stack ready for veneer peeling.'
  );
  const greenApp1 = await createMediaRecord(
    'https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=600&q=80',
    'elisa-green-wardrobes.jpg',
    'Premium modular wardrobe framing'
  );
  const greenApp2 = await createMediaRecord(
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
    'elisa-green-panels.jpg',
    'Warp-free wood panel partitions'
  );
  const greenApp3 = await createMediaRecord(
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
    'elisa-green-furniture.jpg',
    'Durable residential cabinet structures'
  );

  const clubHero = await createMediaRecord(
    'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80',
    'elisa-club-hero.jpg',
    'Elisa Club 710 vertical wood panel cladding',
    'Premium vertical wood veneer sheets bonded under high temperature BWP marine specifications.'
  );
  const clubMobileHero = await createMediaRecord(
    'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80',
    'elisa-club-mobile-hero.jpg',
    'Elisa Club 710 mobile wood paneling'
  );
  const clubGal1 = await createMediaRecord(
    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
    'elisa-club-boards.jpg',
    'Processed calibrated wood stacks',
    'High density tropical hardwood calibrated core layers.'
  );
  const clubGal2 = await createMediaRecord(
    'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80',
    'elisa-club-timber.jpg',
    'Raw tropical hardwood timber stack',
    'Tropical hardwood core logs selected for BWP boiling water testing.'
  );
  const clubApp1 = await createMediaRecord(
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    'elisa-club-kitchen.jpg',
    '100% Waterproof modular kitchen cabinetry'
  );
  const clubApp2 = await createMediaRecord(
    'https://images.unsplash.com/photo-1620626011761-996317b69766?auto=format&fit=crop&w=600&q=80',
    'elisa-club-bathrooms.jpg',
    'Moisture-proof bathroom vanity framing'
  );
  const clubApp3 = await createMediaRecord(
    'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=600&q=80',
    'elisa-club-marine.jpg',
    'Yacht cabins and marine grade wood joinery'
  );

  const primeHero = await createMediaRecord(
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80',
    'decor-club-prime-hero.jpg',
    'Luxurious wood veneer paneled room',
    'Premium marine-grade plywood structures displaying high mechanical strength and luxury claddings.'
  );
  const primeMobileHero = await createMediaRecord(
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
    'decor-club-prime-mobile-hero.jpg',
    'Decor Club Prime mobile wood paneling'
  );
  const primeGal1 = await createMediaRecord(
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    'decor-club-prime-grain.jpg',
    'Architectural wood veneer grain',
    'Smooth wood veneer face applied over multi-layer calibrated plywood.'
  );
  const primeGal2 = await createMediaRecord(
    'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80',
    'decor-club-prime-paneling.jpg',
    'Premium vertical wood partitions',
    'Zero gaps and high screw holding capacity panel constructions.'
  );
  const primeApp1 = await createMediaRecord(
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    'decor-club-prime-office.jpg',
    'Premium corporate office executive space'
  );
  const primeApp2 = await createMediaRecord(
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80',
    'decor-club-prime-lobby.jpg',
    'Luxury hotel entrance lobby timber wall panels'
  );
  const primeApp3 = await createMediaRecord(
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
    'decor-club-prime-residential.jpg',
    'Luxury modular wardrobe and kitchen partitions'
  );

  console.log('All Media assets saved.');

  // 3. Create Site Settings (Preserving logo/favicon)
  await SiteSetting.create({
    brandName: 'Elisa Decor',
    tagline: 'Crafting Premium Spaces with Sophisticated Materials',
    logo: preservedLogoId || undefined,
    favicon: preservedFaviconId || undefined,
    phone: '+91 82107 20731',
    email: 'contact@elisadecor.com',
    address: 'Anshika Plywoods, Manish Hardware Building, Ranchi - Patna Rd, Jhumri Telaiya, Jharkhand 825409',
    whatsApp: '+91 82107 20731',
    socialUrls: {
      facebook: 'https://facebook.com/elisadecor',
      instagram: 'https://instagram.com/elisadecor',
      twitter: 'https://twitter.com/elisadecor',
      youtube: 'https://youtube.com/elisadecor',
    },
    businessHours: 'Monday - Saturday: 9:30 AM - 6:30 PM (Sunday Closed)',
    googleMapsUrl: 'https://maps.google.com',
    defaultSeo: {
      title: 'Elisa Decor | Premium Plywood, Boards & Custom Decor Panels',
      description: 'Experience the ultimate in architectural craftsmanship with Elisa Decor. Premium eco-friendly plywood, Club 710 marine grade wood, and designer panels for premium residential and commercial interiors.',
      ogTitle: 'Elisa Decor | Premium Wood Manufacturing Solutions',
      ogDescription: 'Experience the ultimate in architectural craftsmanship with Elisa Decor. Premium eco-friendly plywood, Club 710 marine grade wood, and designer panels.',
      ogImage: greenHero._id,
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
      { label: 'About Us', url: '/about', order: 2, visible: true },
      { label: 'Elisa Green', url: '/products/elisa-green', order: 3, visible: true },
      { label: 'Elisa Club 710', url: '/products/elisa-club-710', order: 4, visible: true },
      { label: 'Decor Club Prime', url: '/products/decor-club-prime', order: 5, visible: true },
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

  // 4. Create 3 Products linked to Media
  const p1 = await Product.create({
    name: 'Elisa Green',
    slug: 'elisa-green',
    productCode: 'EL-GREEN-303',
    shortDescription: 'High-density, premium moisture-resistant plywood engineered for long-lasting interiors.',
    longDescription: 'Elisa Green is our premium eco-friendly Commercial MR Plus (Moisture Resistant - IS 303) grade plywood. Manufactured using high-quality hardwood timber and bonded with synthetic MUF resin, it provides exceptional stability, moisture resistance, anti-termite characteristics, and zero core gaps.',
    logo: creativeGreen._id,
    heroImage: creativeGreen._id,
    mobileHeroImage: greenMobileHero._id,
    gallery: [creativeGreen._id, greenHero._id, greenGal1._id, greenGal2._id],
    warranty: '15 Years',
    certifications: 'MR - IS 303 Grade, E0/E1 Compliant',
    features: [
      { title: 'Water Resistant', description: 'Long-lasting protection against moisture and dampness.', icon: 'Droplets' },
      { title: 'Moisture Resistant Interior Grade', description: 'Formulated with amino adhesives and vacuum pressure chemical treatment.', icon: 'ShieldAlert' },
      { title: 'Eco Friendly (E0/E1)', description: 'Low formaldehyde emissions ensuring healthy indoor air quality.', icon: 'Leaf' },
      { title: '100% Calibrated Surface', description: 'Perfect wood grain thickness with zero surface undulations.', icon: 'Grid' },
    ],
    specifications: [
      { key: 'Grade', value: 'MR Plus Grade (IS:303)' },
      { key: 'Timber Source', value: 'Selected Sustainable Hardwood' },
      { key: 'Technology', value: 'Quad-Core Press & Vacuum Pressure Chemical Treatment (VPCT)' },
      { key: 'Pest Resistance', value: 'Anti-Termite, Anti-Fungal, & Anti-Bacterial' },
      { key: 'Moisture Content', value: '8 - 12%' },
      { key: 'Thickness Options', value: '6mm, 9mm, 12mm, 16mm, 19mm' },
    ],
    applications: [
      { title: 'Residential Wardrobes', description: 'Perfect structural strength for durable closets and custom cabinetry.', image: greenApp1._id },
      { title: 'Wall Paneling & Partitions', description: 'High stability reduces warp in large vertical installations.', image: greenApp2._id },
      { title: 'Living Room Furniture', description: 'Seamless screw holding capacity for modern sofas, beds, and tables.', image: greenApp3._id },
    ],
    benefits: [
      'Dimensional Stability: Calibrated 100% with zero surface undulations or core gaps',
      'Vacuum Pressure Chemical Treatment (VPCT) for complete pest and microbial resistance',
      'Formaldehyde class E0 / E1 compliance for healthier indoor air'
    ],
    faqs: [
      { question: 'Is Elisa Green plywood water-resistant?', answer: 'Yes, Elisa Green is an MR Plus grade water-resistant interior plywood, offering long-lasting moisture protection.' },
      { question: 'What is the emission rating of Elisa Green?', answer: 'Elisa Green conforms to strict E0/E1 formaldehyde emission standards.' },
    ],
    status: 'PUBLISHED',
    sortOrder: 3,
    seo: {
      title: 'Elisa Green Plywood | MR Plus Grade Premium Hardwood Board',
      description: 'Elisa Green is a premium MR Plus grade hardwood plywood with zero core gaps, termite resistance, and low formaldehyde emissions.',
      ogImage: creativeGreen._id,
    },
  });

  const p2 = await Product.create({
    name: 'Elisa Club 710',
    slug: 'elisa-club-710',
    productCode: 'EL-CLUB-710',
    shortDescription: 'Super premium, 100% waterproof Marine-Grade plywood designed for extreme environments.',
    longDescription: 'Elisa Club 710 is our flagship architectural-grade BWP (Boiling Water Proof) Marine Plywood. Built with carefully selected premium tropical hardwood and bonded with un-extended Phenol Formaldehyde resin at high pressure and temperature to ensure permanent waterproofing and exceptional strength.',
    logo: creativeClub710._id,
    heroImage: creativeClub710._id,
    mobileHeroImage: clubMobileHero._id,
    gallery: [creativeClub710._id, clubHero._id, clubGal1._id, clubGal2._id],
    warranty: '25 Years',
    certifications: 'BWP - IS 710 Grade, E0/E1 Compliant',
    features: [
      { title: 'Boiling Waterproof (BWP)', description: 'Can withstand continuous boiling water exposure without layer separation.', icon: 'Droplets' },
      { title: 'Quad-Core Press Tech', description: 'High density core compression for structural durability.', icon: 'Wrench' },
      { title: 'Termite & Borer Proof', description: 'Chemically treated with anti-termite, anti-fungal, and anti-bacterial barriers.', icon: 'Shield' },
      { title: 'Vacuum Pressure Treatment', description: 'Deep preservative impregnation under heavy pressure cycles.', icon: 'Sliders' },
    ],
    specifications: [
      { key: 'Grade', value: 'BWP Marine Grade (IS:710)' },
      { key: 'Timber Source', value: 'Premium Tropical Hardwood' },
      { key: 'Technology', value: 'Quad-Core Press & Vacuum Pressure Treatment' },
      { key: 'Adhesive Used', value: 'Un-extended Phenol Formaldehyde (PF) Resin' },
      { key: 'Pest Protection', value: '100% Termite, Fungal & Borer Proof' },
      { key: 'Thickness Options', value: '6mm, 9mm, 12mm, 16mm, 19mm, 25mm' },
    ],
    applications: [
      { title: 'Modular Kitchen Cabinets', description: 'Excellent resistance to moisture, steam, and heavy storage loads.', image: clubApp1._id },
      { title: 'Bathroom Vanity Structures', description: 'Unaffected by direct contact with water, splash, and high humidity.', image: clubApp2._id },
      { title: 'Yachts & Marine Interior', description: 'Meets rigorous standards for marine crafts and seaside villas.', image: clubApp3._id },
    ],
    benefits: [
      'Boiling Waterproof (BWP - IS 710) grade suitable for extreme moisture zones',
      'Dimensional stability: Calibrated 100% with zero surface undulations or core gaps',
      'Treated with Vacuum Pressure Technology (VPCT) for lifetime pest and marine borer protection'
    ],
    faqs: [
      { question: 'What does IS:710 grade mean?', answer: 'IS:710 is the Bureau of Indian Standards code for Marine Grade Plywood.' },
      { question: 'How long is the warranty on Elisa Club 710?', answer: 'Elisa Club 710 comes with a 25-year manufacturer warranty against delamination.' },
    ],
    status: 'PUBLISHED',
    sortOrder: 2,
    seo: {
      title: 'Elisa Club 710 | Premium IS:710 BWP Marine Plywood',
      description: 'Discover Elisa Club 710 Marine Grade BWP Plywood. 100% waterproof, termite proof, tropical hardwood, designed for modular kitchens and luxury bathrooms.',
      ogImage: creativeClub710._id,
    },
  });

  const p3 = await Product.create({
    name: 'Decor Club Prime',
    slug: 'decor-club-prime',
    productCode: 'DCP-PRIME-710',
    shortDescription: 'Super-premium Boiling Water Proof marine calibrated plywood with premium Gurjan faces.',
    longDescription: 'Decor Club Prime is a super-premium Boiling Water Proof (BWP) marine-grade plywood conforming to IS:710 standards. Backed by 25 stringent BIS tests, it is manufactured using select exotic hardwood cores and a premium Gurjan face, bonded with Phenol Formaldehyde synthetic resin. It features Calibrated core layers with zero gaps, advanced Glue Line Protection (GLP) for 100% borer and termite proofing, and exceptional mechanical strength.',
    logo: creativePrime._id,
    heroImage: creativePrime._id,
    mobileHeroImage: primeMobileHero._id,
    gallery: [creativePrime._id, primeHero._id, primeGal1._id, primeGal2._id],
    warranty: '30 Years',
    certifications: 'BWP - IS 710 Grade, BIS Tested (25 Stringent Tests Passed)',
    features: [
      { title: 'BWP (IS:710)', description: 'Boiling Water Proof grade conforming to rigorous IS:710 standards.', icon: 'Droplets' },
      { title: 'Glue Line Protection (GLP)', description: 'Borosil / GLP patent for 100% borer and termite proofing.', icon: 'Shield' },
      { title: 'Calibrated Core', description: 'Seamless layers with zero gaps or overlaps in the core.', icon: 'Grid' },
      { title: '65% Stronger Glue Shear', description: 'GSS is 65% stronger than ordinary plywood.', icon: 'Sparkles' },
    ],
    specifications: [
      { key: 'Grade', value: 'BWP Marine Grade (IS:710)' },
      { key: 'Face Veneer', value: 'Premium Gurjan Face' },
      { key: 'Glue / Resin', value: 'Phenol Formaldehyde (PF) Synthetic Resin' },
      { key: 'Moisture Content', value: '8% - 12%' },
      { key: 'Mechanical Properties', value: 'Screw Holding Strength >200 kg, Nail Holding Strength >85 kg' },
      { key: 'Thickness Range', value: '4mm, 6mm, 9mm, 12mm, 16mm, 19mm, 25mm' },
    ],
    applications: [
      { title: 'Luxury Kitchen Cabinetry', description: 'Maximum structural reliability in environments exposed to heat and steam.', image: primeApp3._id },
      { title: 'Hotel Lobbies & Wood Cladding', description: 'Warp-free wood veneer alignment and premium structural stability.', image: primeApp2._id },
      { title: 'Bespoke Executive Furnishings', description: 'Uniform calibration and immense strength for custom office conference desks.', image: primeApp1._id },
    ],
    benefits: [
      '30 Years Warranty: Manufacturer warranty against any manufacturing defects under normal usage',
      'calibrated core layers ensure flat surfaces with zero core gaps or overlapping',
      'Borosil / GLP: Patent Glue Line Protection and finished panel treatment for complete termite/borer protection',
      'Glue Shear Strength (GSS) is 65% stronger than ordinary plywood',
      'Screw holding strength of >200 kg and nail holding strength of >85 kg'
    ],
    faqs: [
      { question: 'What is the warranty period for Decor Club Prime?', answer: 'Decor Club Prime comes with a 30-year manufacturer warranty against manufacturing defects under normal usage.' },
      { question: 'How is Decor Club Prime protected from borers?', answer: 'It features patent Borosil / Glue Line Protection (GLP) and finished panel treatment for 100% borer and termite proofing.' },
    ],
    status: 'PUBLISHED',
    sortOrder: 1,
    seo: {
      title: 'Decor Club Prime | Premium Gurjan Face IS:710 Plywood',
      description: 'Decor Club Prime is a premium BWP marine-grade plywood with Gurjan face veneer, Borosil GLP termite protection, and a 30-year warranty.',
      ogImage: creativePrime._id,
    },
  });

  console.log(`Seeded 3 products with complete Media assets: ${p1.name}, ${p2.name}, ${p3.name}`);

  // 5. Homepage CMS sections with 3 Slides matching the 3 Products (Clean wood stacks)
  await Homepage.create({
    sections: [
      {
        type: 'Hero',
        enabled: true,
        order: 1,
        content: {
          slides: [
            {
              title: 'Decor Club Prime Plywood',
              subtitle: 'Gurjan Face BWP IS:710 Marine Grade',
              eyebrow: 'ELISA DECOR',
              description: 'Super-premium calibrated marine plywood with patent Glue Line Protection, passed 25 stringent BIS tests, offering a 30-year warranty.',
              ctaText1: 'Explore Club Prime',
              ctaUrl1: '/products/decor-club-prime',
              ctaText2: 'Request Quote',
              ctaUrl2: '/contact',
              desktopImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80',
              mobileImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
            },
            {
              title: 'Elisa Club 710 Plywood',
              subtitle: '100% Waterproof BWP Marine-Grade',
              eyebrow: 'ELISA DECOR',
              description: 'Flagship Boiling Water Proof marine plywood engineered with premium tropical hardwood cores and Phenol Formaldehyde bonding for ultimate durability.',
              ctaText1: 'Explore Club 710',
              ctaUrl1: '/products/elisa-club-710',
              ctaText2: 'Request Quote',
              ctaUrl2: '/contact',
              desktopImage: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1600&q=80',
              mobileImage: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80',
            },
            {
              title: 'Elisa Green Plywood',
              subtitle: 'Precision Calibrated MR Plus Sheets',
              eyebrow: 'ELISA DECOR',
              description: 'Eco-friendly, moisture-resistant plywood with E0/E1 low emissions and zero core gaps. Manufactured for wardrobes, paneling, and interior woodwork.',
              ctaText1: 'Explore Elisa Green',
              ctaUrl1: '/products/elisa-green',
              ctaText2: 'Request Quote',
              ctaUrl2: '/contact',
              desktopImage: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1600&q=80',
              mobileImage: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
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
          description1: 'Founded on the principles of extreme durability, precision calibration, and ecological responsibility, Elisa Decor provides architects and interior contractors with wood sheets that never warp.',
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
          secondaryCtaText: 'Explore Core Standards',
          secondaryCtaUrl: '/process',
        },
        settings: { align: 'center' },
      },
    ],
    seo: {
      title: 'Elisa Decor | Premium Plywood, Marine Grade Boards & Custom Materials',
      description: 'Welcome to Elisa Decor. We engineer premium, warp-free, and termite-resistant BWP marine-grade plywood and commercial BWR sheets for architects and luxury interiors.',
      ogImage: greenHero._id,
    },
  });
  console.log('Homepage CMS sections configured with 3 matching product slides.');

  await FAQ.create({ question: 'What is the difference between BWR and BWP grade plywood?', answer: 'BWR = Boiling Water Resistant (wardrobes, furniture). BWP = Boiling Water Proof (kitchens, bathrooms).', published: true, sortOrder: 1 });
  await FAQ.create({ question: 'How can I verify if Elisa plywood is genuine?', answer: 'All Elisa Decor products come with a unique branding stamp and QR codes on the board face.', published: true, sortOrder: 2 });

  await Testimonial.create({ name: 'Anjali Sharma', designation: 'Principal Architect', company: 'Studio Line Design', testimonial: 'Elisa Club 710 has become our default specification. The calibration is perfect, and we have had zero warping complaints across multiple modular kitchen projects.', status: 'PUBLISHED', sortOrder: 1 });
  await Testimonial.create({ name: 'Rajesh Patel', designation: 'Interior Contractor', company: 'Patel Joinery Works', testimonial: 'Elisa Green BWR plywood has excellent screw-holding capacity. The density is uniform with zero gaps inside.', status: 'PUBLISHED', sortOrder: 2 });
  console.log('Testimonials & FAQs seeded.');

  // Create Projects Gallery Seeds
  console.log('Seeding dynamic Projects showcases...');
  await Project.create({
    title: 'Premium Calibrated Modular Kitchen',
    slug: 'premium-calibrated-modular-kitchen',
    description: 'Calibrated base frames assembled using Elisa Club 710 BWP marine plywood sheets. Features high resistance to kitchen sink humidity, direct water splash, and steam exposure.',
    coverImage: clubHero._id,
    gallery: [clubGal1._id, clubGal2._id],
    category: 'KITCHEN',
    location: 'Ranchi, Jharkhand',
    productsUsed: [p2._id],
    status: 'PUBLISHED',
    sortOrder: 1,
    seo: { title: 'Premium Modular Kitchen Case Study', description: 'Real-world modular kitchen assembled with Elisa Club 710 marine plywood.' }
  });

  await Project.create({
    title: 'Bespoke Walk-in Wardrobe Closet',
    slug: 'bespoke-walk-in-wardrobe-closet',
    description: 'Wardrobe carcass and storage partitions constructed using E1 emission standard certified Elisa Green calibrated BWR boards, finished with warm decorative veneer claddings.',
    coverImage: greenGal1._id,
    gallery: [greenGal1._id, greenGal2._id],
    category: 'WARDROBE',
    location: 'Jamshedpur, Jharkhand',
    productsUsed: [p1._id],
    status: 'PUBLISHED',
    sortOrder: 2,
    seo: { title: 'Designer Walk-in Wardrobe Showcase', description: 'Designer bedroom wardrobes framing built with Elisa Green calibrated BWR plywood.' }
  });

  await Project.create({
    title: 'Corporate Executive Boardroom',
    slug: 'corporate-executive-boardroom',
    description: 'Asymmetric feature walls and custom conference table backing surfaces supported by Decor Club Prime calibrated boards for warp-free wood veneer alignment and structural stability.',
    coverImage: primeHero._id,
    gallery: [primeGal1._id, primeGal2._id],
    category: 'COMMERCIAL',
    location: 'Patna, Bihar',
    productsUsed: [p3._id],
    status: 'PUBLISHED',
    sortOrder: 3,
    seo: { title: 'Commercial Office Boardroom Wall Cladding', description: 'Executive workspace wooden claddings assembled with Decor Club Prime marine plywood.' }
  });
  console.log('Projects Gallery showcases seeded.');

  await mongoose.disconnect();
  console.log('\n✅ Database seeding complete. Connection closed safely.\n');
  console.log(`   Admin Login: admin@elisadecor.com`);
  console.log(`   Password:    admin123\n`);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
