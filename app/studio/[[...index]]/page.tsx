'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';
import '../studio.css';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

export default function StudioPage() {
  if (!projectId) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        fontFamily: 'sans-serif',
      }}>
        <div style={{
          maxWidth: '540px',
          background: '#1e293b',
          borderRadius: '12px',
          padding: '32px',
          border: '1px solid #334155',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>
            Sanity Studio Not Connected
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
            To use the embedded Studio at <code>/studio</code>, set your Sanity Project ID in <code>.env</code>:
          </p>
          <pre style={{
            background: '#020617',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#38bdf8',
            textAlign: 'left',
            overflowX: 'auto',
          }}>
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
          </pre>
        </div>
      </div>
    );
  }

  return <NextStudio config={config} />;
}
