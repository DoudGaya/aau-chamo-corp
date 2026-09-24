import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'galleryItem',
  title: 'Gallery Item',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          'Airport & cargo operations',
          'Training activities',
          'International business events',
          'Umrah & Ziyarah activities',
          'Staff & customer service',
          'Office locations',
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'text', rows: 2 }),
    defineField({ name: 'occurredAt', title: 'Date of occurrence', type: 'datetime' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
});
