import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'staffMember',
  title: 'Staff Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Full legal or corporate professional name.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, ''),
      },
      validation: (Rule) => Rule.required(),
      description: 'Unique URL slug for the staff member profile page (e.g. /staff/alhaji-aliyu-chamo).',
    }),
    defineField({
      name: 'role',
      title: 'Corporate Position / Role',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Official corporate title (e.g. Managing Director & CEO, Head of Cargo Logistics).',
    }),
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
          { title: 'Customer Service & Relations', value: 'customer_service' },
          { title: 'Operations & Ground Handling', value: 'operations' },
          { title: 'Finance & Administration', value: 'finance_admin' },
          { title: 'Legal & Regulatory Compliance', value: 'legal_compliance' },
          { title: 'Information Technology', value: 'it_systems' },
        ],
      },
    }),
    defineField({
      name: 'station',
      title: 'Operational Station / Base',
      type: 'string',
      description: 'Primary station or office base (e.g. Kano Headquarters, Lagos Station, Abuja Station, Kaduna Station).',
    }),
    defineField({
      name: 'hierarchyOrder',
      title: 'Display Order (Hierarchy)',
      type: 'number',
      description: 'Lower numbers appear first in lists (e.g. 1 for MD/CEO, 2 for Executive Directors).',
      initialValue: 10,
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Descriptive text for accessibility.',
        }),
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Short Biography / Executive Summary',
      type: 'text',
      rows: 4,
      description: 'Concise executive summary shown on team cards and top of single profile page.',
    }),
    defineField({
      name: 'body',
      title: 'Detailed Biography & Professional Background',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
      description: 'Comprehensive professional history, career milestones, and leadership background.',
    }),
    defineField({
      name: 'responsibilities',
      title: 'Key Operational Responsibilities',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of core operations, governance areas, or service delivery functions overseen.',
    }),
    defineField({
      name: 'expertise',
      title: 'Areas of Expertise & Specializations',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Keywords/specializations (e.g. Air Freight Consolidation, IATA Ticketing, Diplomatic Cargo, Hajj Logistics).',
    }),
    defineField({
      name: 'qualifications',
      title: 'Education, Certifications & Credentials',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Academic degrees, professional licenses, and aviation/logistics certifications.',
    }),
    defineField({
      name: 'email',
      title: 'Public Email (Optional)',
      type: 'string',
      description: 'Official corporate email address displayed publicly.',
      validation: (Rule) =>
        Rule.custom((email) => {
          if (!email) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? true : 'Please enter a valid email address';
        }),
    }),
    defineField({
      name: 'phone',
      title: 'Direct / Office Phone (Optional)',
      type: 'string',
      description: 'Official corporate telephone or extension for direct inquiries.',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL (Optional)',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'twitterUrl',
      title: 'X / Twitter URL (Optional)',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'joinedYear',
      title: 'Tenure / Experience Summary',
      type: 'string',
      description: 'e.g. "With A.A.U Chamo since 2018" or "15+ Years Industry Experience".',
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Social Sharing Config',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'portrait',
      department: 'department',
      slug: 'slug.current',
      station: 'station',
    },
    prepare({ title, subtitle, media, department, slug, station }) {
      const deptLabels: Record<string, string> = {
        executive: 'Executive',
        cargo: 'Cargo & Logistics',
        aviation: 'Aviation & Travel',
        umrah: 'Umrah & Ziyarah',
        customer_service: 'Customer Service',
        operations: 'Operations',
        finance_admin: 'Finance & Admin',
        legal_compliance: 'Legal & Compliance',
        it_systems: 'IT & Systems',
      };
      const deptStr = department ? (deptLabels[department] || department) : null;
      const parts = [
        subtitle,
        deptStr ? `[${deptStr}]` : null,
        station ? `@ ${station}` : null,
        slug ? `(/staff/${slug})` : '(No slug)',
      ].filter(Boolean);
      return {
        title: title || 'Untitled Staff Member',
        subtitle: parts.join(' · '),
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order (Hierarchy)',
      name: 'hierarchyAsc',
      by: [
        { field: 'hierarchyOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
    {
      title: 'Full Name A–Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Department',
      name: 'departmentAsc',
      by: [
        { field: 'department', direction: 'asc' },
        { field: 'hierarchyOrder', direction: 'asc' },
      ],
    },
  ],
});
