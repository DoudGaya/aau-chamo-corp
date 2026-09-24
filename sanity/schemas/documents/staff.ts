import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'staffMember',
  title: 'Staff Member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Full Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', title: 'Corporate Position / Role', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'string',
      options: {
        list: [
          { title: 'Executive / Board', value: 'executive' },
          { title: 'Cargo & Logistics', value: 'cargo' },
          { title: 'Aviation & Travel', value: 'aviation' },
          { title: 'Umrah & Ziyarah', value: 'umrah' },
          { title: 'Customer Service', value: 'customer_service' },
        ],
      },
    }),
    defineField({ name: 'bio', title: 'Biography', type: 'text', rows: 4 }),
    defineField({ name: 'portrait', title: 'Portrait Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'hierarchyOrder', title: 'Display Order (Hierarchy)', type: 'number', description: 'Lower numbers appear first (e.g., 1 for CEO).' }),
    defineField({ name: 'email', title: 'Public Email (Optional)', type: 'string' }),
    defineField({ name: 'linkedinUrl', title: 'LinkedIn URL (Optional)', type: 'url' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'portrait' },
  },
});
