'use client';

import styles from './ProformaInvoicePage.module.css';

const data = {
  exporter: 'H.R EXPORTS PVT.LTD',
  invoiceNo: '24748',
  date: '28/02/2025',
  buyer: `Setara Limited
84 KATHERINE ROAD
LONDON E6 IEN, UK`,
  consignee: 'TO THE ORDER',
  portLoading: 'MUNDRA',
  portDischarge: 'FELIXSTOWE, UK',
  terms: 'FOB',
  schedule: 'April',
  items: [
    {
      description: 'SETARA SUPREME 1121 STEAM BASMATI RICE',
      qty: 220.0,
      rate: 1034.09,
      total: 227499.8,
    },
  ],
  total: 227499.8,
  remarks: '5 TON PESTICIDE FREE PER FCL',
  docs: [
    '1. COMMERCIAL INVOICE',
    '2. BILL OF LADING',
    '3. CERTIFICATE OF ORIGIN',
    '4. FUMIGATION CERTIFICATE',
    '5. PHYTOSANITARY CERTIFICATE',
    '6. PACKING LIST',
  ],
};

export default function ProformaInvoicePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>PROFORMA INVOICE / SALES CONTRACT</h1>

      <section className={styles.section}>
        <h3>Exporter</h3>
        <p>{data.exporter}</p>
        <p>Invoice No: {data.invoiceNo}</p>
        <p>Date: {data.date}</p>
      </section>

      <section className={styles.section}>
        <h3>Buyer</h3>
        <pre className={styles.pre}>{data.buyer}</pre>
      </section>

      <section className={styles.section}>
        <h3>Consignee</h3>
        <p>{data.consignee}</p>
      </section>

      <section className={styles.section}>
        <div className={styles.row}>
          <div>
            <strong>Port of Loading:</strong> {data.portLoading}
          </div>
          <div>
            <strong>Port of Discharge:</strong> {data.portDischarge}
          </div>
        </div>
        <div className={styles.row}>
          <div>
            <strong>Shipment Schedule:</strong> {data.schedule}
          </div>
          <div>
            <strong>Terms:</strong> {data.terms}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3>Description of Goods</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty (MT)</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={i}>
                <td>{item.description}</td>
                <td>{item.qty}</td>
                <td>${item.rate}</td>
                <td>${item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className={styles.total}>Total: USD {data.total.toFixed(2)}</div>

      <section className={styles.section}>
        <h3>Required Documents</h3>
        <ul>
          {data.docs.map((doc, i) => (
            <li key={i}>{doc}</li>
          ))}
        </ul>
        <p><strong>Remarks:</strong> {data.remarks}</p>
        <p>
          <strong>General Terms:</strong> Title of goods remains with the seller until full payment...
        </p>
      </section>
    </div>
  );
}
