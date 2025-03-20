import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
  },
  header: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  table: {
    display: 'table',
    width: '100%',
    border: '1px solid #000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  tableCell: {
    flex: 1,
    padding: 5,
    textAlign: 'center',
    borderRight: '1px solid #000',
    fontSize: 12,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

const PickupListPDF = ({ pickups }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Today's Pickup List</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Pickup ID</Text>
          <Text style={styles.tableCell}>Contact Number</Text>
          <Text style={styles.tableCell}>Name</Text>
          <Text style={styles.tableCell}>Estimated Amount</Text>
          <Text style={styles.tableCell}>Choose Item</Text>
        </View>

        {pickups.map((pickup) => (
          <View style={styles.tableRow} key={pickup._id}>
            <Text style={styles.tableCell}>{pickup._id}</Text>
            <Text style={styles.tableCell}>{pickup.contactNumber}</Text>
            <Text style={styles.tableCell}>{pickup.name}</Text>
            <Text style={styles.tableCell}>{pickup.estimatedAmount}</Text>
            <Text style={styles.tableCell}>{pickup.chooseItem}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default PickupListPDF;
