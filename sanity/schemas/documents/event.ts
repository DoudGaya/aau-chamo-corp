import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Event Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({
      name: 'dateRange',
      title: 'Event Date & Time',
      type: 'object',
      fields: [
        defineField({ name: 'startDate', title: 'Start Date/Time', type: 'datetime' }),
        defineField({ name: 'endDate', title: 'End Date/Time (Optional)', type: 'datetime' }),
      ],
    }),
    defineField({ name: 'location', title: 'Location', type: 'string', description: 'e.g., "Kano HQ" or "Virtual"' }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'description', title: 'Event Details', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'registrationLink', title: 'External Registration Link (Optional)', type: 'url' }),
  ],
});
