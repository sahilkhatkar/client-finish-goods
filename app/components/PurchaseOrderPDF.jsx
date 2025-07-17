'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  logo: {
    width: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  section: {
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 8,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCellHeader: {
    fontWeight: 'bold',
    width: '33%',
    padding: 4,
    backgroundColor: '#eee',
    borderBottom: 1,
  },
  tableCell: {
    width: '33%',
    padding: 4,
    borderBottom: 1,
  },
});

export default function PurchaseOrderPDF({ order }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src="/logo.jpg" style={styles.logo} />
        <Text style={styles.title}>Purchase Order</Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Order ID:</Text>
            <Text>{order.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Customer:</Text>
            <Text>{order.customer}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text>{order.date}</Text>
          </View>
        </View>

        <Text style={styles.label}>Items:</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellHeader}>Item</Text>
            <Text style={styles.tableCellHeader}>Quantity</Text>
            <Text style={styles.tableCellHeader}>Price</Text>
          </View>
          {order.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.name}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>${item.price}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.section, { marginTop: 20 }]}>
          <Text style={styles.label}>Total:</Text>
          <Text>${order.total.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
}
