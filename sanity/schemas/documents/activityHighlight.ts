import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'activityHighlight',
  title: 'Operational Activity Highlight',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Activity Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'code',
      title: 'Reference / Index Code',
      type: 'string',
      description: 'e.g., "01", "02", "ACT-01"',
    }),
    defineField({
      name: 'category',
      title: 'Operation Category',
      type: 'string',
      options: {
        list: [
          'Air Freight & Cargo Charter',
          'Bonded Customs & Forwarding',
          'Executive Aviation & Ticketing',
          'Pilgrimage & Delegation Travel',
          'Secure Express Consignment',
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary / Operational Narrative',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Representative Activity Photograph / Graphic',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stat',
      title: 'Key Operational Metric',
      type: 'string',
      description: 'e.g., "48h Hub Feed", "100% Cleared", "10,000+ Passengers", "3 Core Hubs"',
    }),
    defineField({
      name: 'statLabel',
      title: 'Metric Label',
      type: 'string',
      description: 'e.g., "Transit Turnaround", "Manifest Compliance", "Travelers Guided", "Network Coverage"',
    }),
    defineField({
      name: 'capabilities',
      title: 'Key Capabilities (Bullet points)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'linkUrl',
      title: 'Action Link URL',
      type: 'string',
      description: 'e.g. "/cargo-logistics" or "/enquire"',
    }),
    defineField({
      name: 'linkText',
      title: 'Action Link Text',
      type: 'string',
      initialValue: 'Enquire for this service',
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
      title: 'title',
      subtitle: 'category',
      media: 'image',
    },
  },
});
