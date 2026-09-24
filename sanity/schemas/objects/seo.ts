import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'seo',
  title: 'SEO & Social',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Title used for search engines and browsers (max 60 characters).',
      validation: (Rule) => Rule.max(60).warning('Longer titles may be truncated by search engines.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Description for search engines (max 160 characters).',
      validation: (Rule) => Rule.max(160).warning('Keep under 160 characters for best SEO.'),
    }),
    defineField({
      name: 'shareImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Image displayed when sharing the link on WhatsApp, Twitter, etc. (1200x630px recommended).',
    }),
  ],
});
