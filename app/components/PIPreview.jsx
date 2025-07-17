'use client';

import { useEffect, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import ProformaInvoicePage from './ProformaInvoicePage';

export default function PIPreview() {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const generatePreview = async () => {
      const blob = await pdf(<ProformaInvoicePage />).toBlob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    };

    generatePreview();
  }, []);

  if (!previewUrl) return <p>Generating preview...</p>;

  return (
    <iframe
      src={previewUrl}
      width="100%"
      height="700px"
      style={{ border: '1px solid #ccc', marginTop: '2rem' }}
      title="PI Preview"
    />
  );
}
