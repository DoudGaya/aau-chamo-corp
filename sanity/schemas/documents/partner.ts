import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'partner',
  title: 'Partner & Strategic Alliance',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Partner Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Airline Carrier Alliance', value: 'airline' },
          { title: 'Ground Handling & Ramp Operations', value: 'ground_handling' },
          { title: 'Customs & Port Logistics Authority', value: 'customs_port' },
          { title: 'Corporate & Trade Partner', value: 'corporate_trade' },
          { title: 'Travel & Tourism Alliance', value: 'travel_tourism' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'scope',
      title: 'Operational Scope / Agreement',
      type: 'string',
      description: 'e.g., "Direct scheduled air freight allocation across Middle East corridors"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'badge',
      title: 'Accreditation / Badge',
      type: 'string',
      description: 'e.g., "IATA Registered", "Authorized Cargo Alliance", "NCS Licensed"',
    }),
    defineField({
      name: 'logo',
      title: 'Partner Logo / Brand Mark',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'activityImage',
      title: 'Operational Activity Graphic / Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Photo representing this partnership in action (e.g. aircraft on ramp, warehouse handover)',
    }),
    defineField({
      name: 'websiteUrl',
      title: 'Partner Website URL (Optional)',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers display first (e.g. 1, 2, 3)',
    }),
    defineField({
      name: 'featured',
      title: 'Feature on Homepage',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'scope',
      media: 'logo',
    },
  },
});
