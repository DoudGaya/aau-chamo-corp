import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'regulatoryLicense',
  title: 'Accreditation & Regulatory License',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'License / Accreditation Title',
      type: 'string',
      description: 'e.g. "Air Transport Organiser (ATO) License", "IATA Cargo Agency Accreditation", "CAC Corporate Incorporation"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'licenseNumber',
      title: 'License / Registration Number',
      type: 'string',
      description: 'e.g. "RC: 1782299", "NCAA/ATO/2026/044", "IATA: NG-88210"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'issuer',
      title: 'Issuing Authority / Regulatory Body',
      type: 'string',
      description: 'e.g. "Nigerian Civil Aviation Authority (NCAA)", "International Air Transport Association (IATA)", "Corporate Affairs Commission (CAC)"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Industry Sector',
      type: 'string',
      options: {
        list: [
          { title: 'Aviation & Airline Regulations', value: 'aviation' },
          { title: 'Air Cargo & Freight Logistics', value: 'cargo' },
          { title: 'Corporate & Commercial Trade', value: 'corporate' },
          { title: 'Hajj & Umrah Pilgrimage Agency', value: 'pilgrimage' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'scope',
      title: 'Operational Scope / Authorization',
      type: 'string',
      description: 'Brief description of authorized operations (e.g. "Authorized for nationwide air charter, ticketing and cargo consolidation")',
    }),
    defineField({
      name: 'badge',
      title: 'Official Emblem / Seal / Certificate Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'validity',
      title: 'Validity Status',
      type: 'string',
      description: 'e.g. "Active & In Good Standing", "Perpetual / Annual Audit"',
      initialValue: 'Active & In Good Standing',
    }),
    defineField({
      name: 'verificationUrl',
      title: 'Official Registry Verification Link (Optional)',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers display first (e.g. 1, 2, 3)',
      initialValue: 1,
    }),
    defineField({
      name: 'featured',
      title: 'Feature on Corporate Site',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'issuer',
      number: 'licenseNumber',
      media: 'badge',
    },
    prepare({ title, subtitle, number, media }) {
      return {
        title: title || 'Untitled License',
        subtitle: number ? `${subtitle} · ${number}` : subtitle,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }, { field: 'title', direction: 'asc' }],
    },
  ],
});

