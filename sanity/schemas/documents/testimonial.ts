import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Client Testimonial & Review',
  type: 'document',
  fields: [
    defineField({
      name: 'clientName',
      title: 'Client / Contact Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientRole',
      title: 'Client Role / Title',
      type: 'string',
      description: 'e.g., "Managing Director", "Logistics & Supply Chain Head", "Lead Coordinator"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company / Organization Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'service',
      title: 'Service Engaged',
      type: 'string',
      options: {
        list: [
          'Air Cargo & Logistics',
          'Flight Reservation & Ticketing',
          'Clearing & Forwarding',
          'Courier & Delivery',
          'Umrah & Ziyarah Pilgrimage',
          'International Business & Trade Services',
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Testimonial Statement / Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'avatar',
      title: 'Client Photo / Headshot',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'companyLogo',
      title: 'Company Logo (Optional)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'activityImage',
      title: 'Shipment / Travel Activity Image (Optional)',
      type: 'image',
      options: { hotspot: true },
      description: 'Operational photo related to the client (e.g. loaded air cargo pallet, travel delegation)',
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1 - 5)',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'verified',
      title: 'Verified Corporate Client',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
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
      title: 'clientName',
      subtitle: 'company',
      media: 'avatar',
    },
  },
});
