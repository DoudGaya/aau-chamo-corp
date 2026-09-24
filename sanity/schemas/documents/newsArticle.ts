import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'newsArticle',
  title: 'News Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Headline', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'publishedAt', title: 'Publish Date', type: 'datetime', initialValue: () => new Date().toISOString() }),
    defineField({ name: 'featured', title: 'Featured Article?', type: 'boolean', initialValue: false }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Company News', value: 'company' },
          { title: 'Industry Updates', value: 'industry' },
          { title: 'Press Release', value: 'press' },
        ],
      },
    }),
    defineField({ name: 'excerpt', title: 'Short Excerpt', type: 'text', rows: 3, description: 'Used for article cards and lists.' }),
    defineField({ name: 'mainImage', title: 'Main Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'body', title: 'Article Content', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
    defineField({ name: 'seo', title: 'SEO Config', type: 'seo' }),
  ],
});
