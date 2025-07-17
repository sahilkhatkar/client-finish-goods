// 'use client';

// import { pdf } from '@react-pdf/renderer';
// import ProformaInvoicePDF from './ProformaInvoicePDF';


// export default function DownloadPIButton() {
//   const handleDownload = async () => {
//     const blob = await pdf(<ProformaInvoicePDF />).toBlob();
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'proforma_invoice.pdf';
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <button onClick={handleDownload}>
//       Download PI PDF
//     </button>
//   );
// }



'use client';

import { getSession } from 'next-auth/react';

export default function DownloadPIButton() {
  const handleDownload = async () => {
    const session = await getSession();

    if (!session) {
      alert('Not logged in!');
      return;
    }

    const token = session?.accessToken || session?.user?.token; // fallback, depends on your config

    const res = await fetch('/api/generate-pdf', {
      method: 'GET',
      headers: {
        'x-session-token': token,
      },
    });

    if (!res.ok) {
      alert('Failed to generate PDF');
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'proforma_invoice.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload}>
      Download PI PDF
    </button>
  );
}
