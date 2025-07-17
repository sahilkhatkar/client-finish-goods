'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  header: { textAlign: 'center', fontSize: 14, marginBottom: 10, fontWeight: 'bold' },
  section: { marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  label: { fontWeight: 'bold' },
  table: { marginTop: 8 },
  tableRow: { flexDirection: 'row', borderBottom: 1, paddingVertical: 2 },
  cell: { flex: 1 },
  cellWide: { flex: 2 },
});

const data = {
  exporter: 'H.R EXPORTS PVT.LTD',
  invoiceNo: '24748',
  date: '28/02/2025',
  buyer: 'Setara Limited\n84 KATHERINE ROAD\nLONDON E6 IEN, UK',
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

export default function ProformaInvoicePDF() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>PROFORMA INVOICE / SALES CONTRACT</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Exporter: </Text>
          <Text>{data.exporter}</Text>
          <Text>Invoice No: {data.invoiceNo}</Text>
          <Text>Date: {data.date}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Buyer:</Text>
          <Text>{data.buyer}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Consignee:</Text>
          <Text>{data.consignee}</Text>
        </View>

        <View style={styles.section}>
          <Text><Text style={styles.label}>Port of Loading:</Text> {data.portLoading}</Text>
          <Text><Text style={styles.label}>Port of Discharge:</Text> {data.portDischarge}</Text>
          <Text><Text style={styles.label}>Shipment Schedule:</Text> {data.schedule}</Text>
          <Text><Text style={styles.label}>Terms:</Text> {data.terms}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description of Goods:</Text>
          <View style={styles.table}>
            {data.items.map((item, i) => (
              <View style={styles.tableRow} key={i}>
                <Text style={styles.cellWide}>{item.description}</Text>
                <Text style={styles.cell}>{item.qty}</Text>
                <Text style={styles.cell}>${item.rate}</Text>
                <Text style={styles.cell}>${item.total}</Text>
              </View>
            ))}
          </View>
          <Text style={{ marginTop: 5 }}><Text style={styles.label}>Total:</Text> USD {data.total.toFixed(2)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Required Documents:</Text>
          {data.docs.map((d, i) => (
            <Text key={i}>{d}</Text>
          ))}
          <Text style={{ marginTop: 5 }}><Text style={styles.label}>Remarks:</Text> {data.remarks}</Text>
        </View>
      </Page>
    </Document>
  );
}
