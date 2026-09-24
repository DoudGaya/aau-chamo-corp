import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Tip / Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({
      name: 'type',
      title: 'Content Type',
      type: 'string',
      options: { list: [{ title: 'Quick Tip', value: 'tip' }, { title: 'Full Guide', value: 'guide' }] },
    }),
    defineField({ name: 'author', title: 'Author', type: 'reference', to: [{ type: 'staffMember' }] }),
    defineField({ name: 'mainImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'seo', title: 'SEO Config', type: 'seo' }),
  ],
});
