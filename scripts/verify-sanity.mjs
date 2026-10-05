import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-09-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
});

async function verify() {
  const partners = await client.fetch('*[_type == "partner"] | order(order asc) { _id, name, badge }');
  const testimonials = await client.fetch('*[_type == "testimonial"] | order(order asc) { _id, clientName, company }');
  const activities = await client.fetch('*[_type == "activityHighlight"] | order(order asc) { _id, title, "imageAsset": image.asset._ref }');

  console.log('✓ Found', partners.length, 'partners in Sanity CMS:');
  partners.forEach(p => console.log('  -', p.name, `(${p.badge || 'No badge'})`));

  console.log('\n✓ Found', testimonials.length, 'testimonials in Sanity CMS:');
  testimonials.forEach(t => console.log('  -', t.clientName, '·', t.company));

  console.log('\n✓ Found', activities.length, 'operational activities in Sanity CMS:');
  activities.forEach(a => console.log('  -', a.title, '· Image ref:', a.imageAsset));
}

verify().catch(console.error);
