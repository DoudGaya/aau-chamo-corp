import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'stationBranch',
  title: 'Station & Regional Branch',
  type: 'document',
  fields: [
    defineField({
      name: 'city',
      title: 'City / Station Name',
      type: 'string',
      description: 'e.g. Kano, Abuja, Lagos, Kaduna, Port Harcourt',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'code',
      title: 'Station Code',
      type: 'string',
      description: 'e.g. KAN, ABV, LOS, KAD',
    }),
    defineField({
      name: 'role',
      title: 'Station Role & Operations Scope',
      type: 'string',
      description: 'e.g. "Head office and operations coordination", "Aviation and logistics network coverage"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Physical Address (Optional)',
      type: 'string',
      description: 'Street address or airport cargo terminal location',
    }),
    defineField({
      name: 'phone',
      title: 'Station Direct Phone (Optional)',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Station Email (Optional)',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers display first (e.g. 1 for Kano Head Office, 2 for Abuja, 3 for Lagos)',
      initialValue: 1,
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active Station?',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'city',
      code: 'code',
      subtitle: 'role',
    },
    prepare({ title, code, subtitle }) {
      return {
        title: code ? `${title} (${code})` : title,
        subtitle,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }, { field: 'city', direction: 'asc' }],
    },
  ],
});

