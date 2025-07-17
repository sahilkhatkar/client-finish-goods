// import puppeteer from 'puppeteer';

// export async function GET() {
//   const browser = await puppeteer.launch({
//     headless: 'new',
//     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//   });

//   const page = await browser.newPage();

//   // For simplicity, inline the styles — but you can also import from your CSS module if needed
//   const html = `
//     <html>
//       <head>
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             padding: 2rem;
//           }
//           h1 {
//             background-color: red;
//             color: white;
//             padding: 0.5rem;
//             text-align: center;
//           }
//           section {
//             margin-bottom: 1.5rem;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-top: 0.5rem;
//           }
//           th, td {
//             border: 1px solid #ccc;
//             padding: 6px;
//             text-align: left;
//           }
//           .total {
//             font-weight: bold;
//             color: #d9534f;
//             margin-top: 1rem;
//           }
//         </style>
//       </head>
//       <body>
//         <h1>Proforma Invoice</h1>
//         <section>
//           <h3>Exporter</h3>
//           <p>H.R EXPORTS PVT.LTD</p>
//           <p>Invoice No: 24748</p>
//           <p>Date: 28/02/2025</p>
//         </section>
//         <section>
//           <h3>Buyer</h3>
//           <p>Setara Limited<br/>84 KATHERINE ROAD<br/>LONDON E6 IEN, UK</p>
//         </section>
//         <section>
//           <h3>Goods</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>Item</th>
//                 <th>Qty (MT)</th>
//                 <th>Rate</th>
//                 <th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>SETARA SUPREME 1121 STEAM BASMATI RICE</td>
//                 <td>220.0</td>
//                 <td>$1034.09</td>
//                 <td>$227499.80</td>
//               </tr>
//             </tbody>
//           </table>
//           <p class="total">Total: USD 227,499.80</p>
//         </section>
//         <section>
//           <h3>Required Documents</h3>
//           <ul>
//             <li>COMMERCIAL INVOICE</li>
//             <li>BILL OF LADING</li>
//             <li>CERTIFICATE OF ORIGIN</li>
//             <li>FUMIGATION CERTIFICATE</li>
//             <li>PHYTOSANITARY CERTIFICATE</li>
//             <li>PACKING LIST</li>
//           </ul>
//           <p><strong>Remarks:</strong> 5 TON PESTICIDE FREE PER FCL</p>
//         </section>
//       </body>
//     </html>
//   `;

//   await page.setContent(html, { waitUntil: 'networkidle0' });

//   const buffer = await page.pdf({ format: 'A4' });
//   await browser.close();

//   return new Response(buffer, {
//     headers: {
//       'Content-Type': 'application/pdf',
//       'Content-Disposition': 'attachment; filename="proforma_invoice.pdf"',
//     },
//   });
// }






import puppeteer from 'puppeteer';
import { getToken } from 'next-auth/jwt';

export async function GET(request) {
  const token = await getToken({ req: request });

  if (!token) {
    return new Response('Not authenticated (JWT missing)', { status: 401 });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 👇 Instead of using cookies, we pass token as query param to page
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const url = `${baseUrl}/dashboard/pdfGen/html?token=${encodeURIComponent(token.sub)}`;

  await page.goto(url, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
  });

  await browser.close();

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="proforma_invoice.pdf"',
    },
  });
}
