'use client';

import { useState, useEffect } from 'react';

interface Material {
  id: string;
  title: string;
  type: string;
  fileUrl?: string;
  author: { displayName: string };
  createdAt: string;
}

interface MaterialsTabProps {
  classId?: string;
}

export default function MaterialsTab({ classId }: MaterialsTabProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Placeholder: real implementation needs Server Action
      setMaterials([]);
      setLoading(false);
    }
    load();
  }, [classId]);

  if (loading) return <p>Memuat...</p>;

  return (
    <div>
      <button style={{ marginBottom: 16 }}>Upload Materi</button>
      {materials.length === 0 ? (
        <p>Belum ada materi.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {materials.map((m) => (
            <li
              key={m.id}
              style={{
                padding: 12,
                border: '1px solid #ddd',
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <strong>{m.title}</strong>
              <p style={{ fontSize: 12, color: '#666' }}>
                Oleh {m.author.displayName} • {m.type}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
