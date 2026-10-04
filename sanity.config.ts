import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schema } from './sanity/schema';
import { deskStructure } from './sanity/deskStructure';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '8ubhp1gx';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: 'A.A.U Chamo Content Studio',
  schema,
  plugins: [
    deskTool({
      structure: deskStructure,
    }),
  ],
});
