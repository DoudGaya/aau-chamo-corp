import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || '8ubhp1gx';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production';
const token = process.env.SANITY_API_READ_TOKEN?.trim() || process.env.SANITY_API_WRITE_TOKEN?.trim();

if (!token) {
  console.error('Missing SANITY_API_READ_TOKEN with write permissions.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-09-01',
  token,
  useCdn: false,
});

async function uploadImageAsset(filePath, filename) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found for upload: ${filePath}`);
    return null;
  }
  try {
    console.log(`Uploading asset: ${filename}...`);
    const stream = fs.createReadStream(filePath);
    const asset = await client.assets.upload('image', stream, {
      filename,
    });
    console.log(`Uploaded asset ${filename} -> ${asset._id}`);
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (err) {
    console.error(`Failed to upload asset ${filename}:`, err.message);
    return null;
  }
}

async function runSeed() {
  console.log(`Starting Sanity demo content seeding into ${projectId} (${dataset})...`);

  // 1. Upload Activity Images
  const cargoImg = await uploadImageAsset(
    path.join('public', 'images', 'activity-cargo-ramp.jpg'),
    'activity-cargo-ramp.jpg'
  );
  const customsImg = await uploadImageAsset(
    path.join('public', 'images', 'activity-customs-hub.jpg'),
    'activity-customs-hub.jpg'
  );
  const aviationImg = await uploadImageAsset(
    path.join('public', 'images', 'activity-aviation-hub.jpg'),
    'activity-aviation-hub.jpg'
  );
  const pilgrimageImg = await uploadImageAsset(
    path.join('public', 'images', 'activity-pilgrimage.jpg'),
    'activity-pilgrimage.jpg'
  );

  // 2. Activity Highlights (Operational Activities in Action)
  const activities = [
    {
      _id: 'activity-scheduled-air-cargo',
      _type: 'activityHighlight',
      title: 'Scheduled Air Cargo & Heavy Freighter Operations',
      code: '01',
      category: 'Air Freight & Cargo Charter',
      summary:
        'Direct palletized freight intake, ramp escort, and space allocation across domestic and international airline freighters at Mallam Aminu Kano International Airport (KAN) and Lagos (LOS).',
      image: cargoImg,
      stat: '48-Hour Hub Feed',
      statLabel: 'Transit Turnaround',
      capabilities: [
        'Main deck freighter palletization & ULD loading',
        'Perishable & dangerous goods compliance',
        'Ramp escort & airside transfer supervision',
      ],
      linkUrl: '/cargo-logistics',
      linkText: 'Explore air cargo corridors',
      order: 1,
      featured: true,
    },
    {
      _id: 'activity-customs-clearing-transit',
      _type: 'activityHighlight',
      title: 'Bonded Customs Clearing & Inter-Terminal Transit',
      code: '02',
      category: 'Bonded Customs & Forwarding',
      summary:
        'End-to-end import/export documentation, tariff classification, single goods declaration (SGD), and secure inter-terminal transit for sea and air shipments.',
      image: customsImg,
      stat: '100% Cleared',
      statLabel: 'Documentation Compliance',
      capabilities: [
        "Form 'M' & PAAR expedited processing",
        'Bonded warehouse release & escort',
        'Direct seaport & airport door-to-door transit',
      ],
      linkUrl: '/services/clearing-forwarding',
      linkText: 'Review clearing protocol',
      order: 2,
      featured: true,
    },
    {
      _id: 'activity-corporate-aviation',
      _type: 'activityHighlight',
      title: 'Corporate Aviation & Group Flight Reservations',
      code: '03',
      category: 'Executive Aviation & Ticketing',
      summary:
        'Corporate flight reservations, itinerary management, and group travel charters across domestic carriers and premier international airlines.',
      image: aviationImg,
      stat: '3 Core Hubs',
      statLabel: 'Kano · Abuja · Lagos',
      capabilities: [
        'Dedicated corporate booking accounts',
        'Fast-track VIP protocol & airport lounge access',
        'Flexible schedule re-routing & reissue management',
      ],
      linkUrl: '/flight-travel',
      linkText: 'Book & enquire flights',
      order: 3,
      featured: true,
    },
    {
      _id: 'activity-umrah-pilgrimage',
      _type: 'activityHighlight',
      title: 'Umrah Pilgrimage & Delegation Ground Coordination',
      code: '04',
      category: 'Pilgrimage & Delegation Travel',
      summary:
        'Comprehensive pilgrimage travel facilitation including visa processing, scheduled group flights to Jeddah/Madinah, and structured ground transport guidance.',
      image: pilgrimageImg,
      stat: '10,000+ Pilgrims',
      statLabel: 'Guided Since Inception',
      capabilities: [
        'Saudi e-visa & biometric appointment coordination',
        'Dedicated reception team at Jeddah & Madinah',
        'Structured air-conditioned ground transfer fleets',
      ],
      linkUrl: '/umrah-ziyarah',
      linkText: 'View pilgrimage packages',
      order: 4,
      featured: true,
    },
  ];

  for (const act of activities) {
    console.log(`Writing activity document: ${act.title}`);
    await client.createOrReplace(act);
  }

  // 3. Strategic Partners
  const partners = [
    {
      _id: 'partner-egyptair-cargo',
      _type: 'partner',
      name: 'EgyptAir Cargo & Airlines',
      slug: { _type: 'slug', current: 'egyptair-cargo' },
      category: 'airline',
      scope:
        'Scheduled cargo allotment and passenger corridors linking Kano & Lagos to Cairo and Mediterranean/Middle East hubs.',
      badge: 'IATA Airline Partner',
      websiteUrl: 'https://www.egyptair.com',
      order: 1,
      featured: true,
    },
    {
      _id: 'partner-saudia-cargo',
      _type: 'partner',
      name: 'Saudia Airlines & Cargo',
      slug: { _type: 'slug', current: 'saudia-cargo' },
      category: 'airline',
      scope:
        'Dedicated passenger seats and air cargo space allocations connecting Northern Nigeria to Jeddah, Madinah & Riyadh.',
      badge: 'Pilgrimage Carrier Alliance',
      websiteUrl: 'https://www.saudia.com',
      order: 2,
      featured: true,
    },
    {
      _id: 'partner-turkish-cargo',
      _type: 'partner',
      name: 'Turkish Airlines Cargo',
      slug: { _type: 'slug', current: 'turkish-cargo' },
      category: 'airline',
      scope:
        'Worldwide wide-body freight transit network connecting Mallam Aminu Kano International Airport to over 120 countries.',
      badge: 'Global Freight Alliance',
      websiteUrl: 'https://www.turkishcargo.com',
      order: 3,
      featured: true,
    },
    {
      _id: 'partner-nahco-aviance',
      _type: 'partner',
      name: 'NAHCO Aviance',
      slug: { _type: 'slug', current: 'nahco-aviance' },
      category: 'ground_handling',
      scope:
        'Airport apron operations, ULD cargo loading, aircraft ground power, and bonded warehouse clearance across Nigerian gateways.',
      badge: 'Certified Ground Handler',
      websiteUrl: 'https://nahcoaviance.com',
      order: 4,
      featured: true,
    },
    {
      _id: 'partner-sahco-handling',
      _type: 'partner',
      name: 'SAHCO Ground Handling',
      slug: { _type: 'slug', current: 'sahco-handling' },
      category: 'ground_handling',
      scope:
        'Aviation ramp logistics, temperature-controlled cold-chain cargo storage, and airside consignment transfer services.',
      badge: 'Cold-Chain & Ramp Alliance',
      websiteUrl: 'https://sahcoplc.com',
      order: 5,
      featured: true,
    },
    {
      _id: 'partner-ncs-licensed',
      _type: 'partner',
      name: 'Nigeria Customs Service Licensed',
      slug: { _type: 'slug', current: 'ncs-licensed-agent' },
      category: 'customs_port',
      scope:
        "Accredited customs brokerage, Form 'M' & PAAR clearance, single goods declaration (SGD) processing, and bonded escrow.",
      badge: 'Authorized Clearing Agent',
      order: 6,
      featured: true,
    },
  ];

  for (const p of partners) {
    console.log(`Writing partner document: ${p.name}`);
    await client.createOrReplace(p);
  }

  // 4. Client Testimonials
  const testimonials = [
    {
      _id: 'testimonial-mustapha-danbatta',
      _type: 'testimonial',
      clientName: 'Alhaji Mustapha Danbatta',
      clientRole: 'Managing Director',
      company: 'Sahel Grain & Agro-Export Consortium',
      service: 'Air Cargo & Logistics',
      quote:
        'Our bulk sesame and agricultural shipments through Mallam Aminu Kano International Airport require strict flight schedules. A.A.U Chamo manages the palletization, cargo hold space confirmation, and export customs clearance with absolute operational discipline.',
      rating: 5,
      verified: true,
      order: 1,
      featured: true,
    },
    {
      _id: 'testimonial-amina-bello',
      _type: 'testimonial',
      clientName: 'Hajiya Amina Bello-Katsina',
      clientRole: 'Group Operations Director',
      company: 'Al-Bayan Pilgrimage Delegations',
      service: 'Umrah & Ziyarah Pilgrimage',
      quote:
        'Coordinating flights, group visas, and airport protocol for over 240 Umrah pilgrims from Kano to Madinah was completely seamless. Every booking reference was verified in advance, giving our delegates total comfort and peace of mind.',
      rating: 5,
      verified: true,
      order: 2,
      featured: true,
    },
    {
      _id: 'testimonial-tunde-adeleke',
      _type: 'testimonial',
      clientName: 'Engr. Tunde Adeleke',
      clientRole: 'Head of Procurement & Supply',
      company: 'Horizon Power & Infrastructure Ltd',
      service: 'Clearing & Forwarding',
      quote:
        'Emergency power generation parts cleared through Lagos bonded terminal and freighted to Kano within 36 hours. The structured reference tracking kept our project directors updated at every operational handover point without guesswork.',
      rating: 5,
      verified: true,
      order: 3,
      featured: true,
    },
    {
      _id: 'testimonial-bashir-farouk',
      _type: 'testimonial',
      clientName: 'Alhaji Bashir Umar Farouk',
      clientRole: 'Chief Executive Officer',
      company: 'Danfarouk Global Trading Group',
      service: 'International Business & Trade Services',
      quote:
        'In cross-border trade between Nigeria, Dubai, and Guangzhou, having a single corporate partner that handles both executive flight itineraries and freight clearance under one roof has eliminated costly weeks of friction for our merchant network.',
      rating: 5,
      verified: true,
      order: 4,
      featured: true,
    },
  ];

  for (const t of testimonials) {
    console.log(`Writing testimonial document: ${t.clientName}`);
    await client.createOrReplace(t);
  }

  console.log('Sanity demo data seeding COMPLETED successfully!');
}

runSeed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
