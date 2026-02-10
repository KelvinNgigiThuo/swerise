import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';

interface Sale {
  id: string;
  date: string;
  customer: string;
  product: string;
  qty: string;
  totalAmount: string;
}

const salesData: Sale[] = [
  { id: '1', date: '2024-11-01', customer: 'John Doe', product: 'Gas 6kg', qty: '2 pcs', totalAmount: '$40.00' },
  { id: '2', date: '2024-11-02', customer: 'Jane Smith', product: 'Gas 12kg', qty: '1 pc', totalAmount: '$20.00' },
  { id: '3', date: '2024-11-03', customer: 'Michael J', product: 'Kerosene', qty: '30 ltrs', totalAmount: '$60.00' },
  { id: '4', date: '2024-11-04', customer: 'Sarah Lee', product: 'Diesel', qty: '50 ltrs', totalAmount: '$100.00' },
  { id: '5', date: '2024-11-05', customer: 'Tom Clark', product: 'Petrol', qty: '40 ltrs', totalAmount: '$80.00' },
  { id: '6', date: '2024-11-06', customer: 'Ann Brown', product: 'Gas 6kg', qty: '3 pcs', totalAmount: '$60.00' },
  { id: '7', date: '2024-11-07', customer: 'Steve Ray', product: 'Gas 12kg', qty: '4 pcs', totalAmount: '$80.00' },
  { id: '8', date: '2024-11-08', customer: 'Emily S.', product: 'Kerosene', qty: '20 ltrs', totalAmount: '$40.00' },
  { id: '9', date: '2024-11-09', customer: 'Chris Wu', product: 'Diesel', qty: '25 ltrs', totalAmount: '$50.00' },
  { id: '10', date: '2024-11-10', customer: 'Laura Z.', product: 'Petrol', qty: '35 ltrs', totalAmount: '$70.00' },
  { id: '11', date: '2024-11-11', customer: 'Ben T.', product: 'Gas 6kg', qty: '1 pc', totalAmount: '$20.00' },
  { id: '12', date: '2024-11-12', customer: 'Cathy L.', product: 'Gas 12kg', qty: '2 pcs', totalAmount: '$40.00' },
  { id: '13', date: '2024-11-13', customer: 'David P.', product: 'Kerosene', qty: '15 ltrs', totalAmount: '$30.00' },
  { id: '14', date: '2024-11-14', customer: 'Ella G.', product: 'Diesel', qty: '45 ltrs', totalAmount: '$90.00' },
  { id: '15', date: '2024-11-15', customer: 'Frank H.', product: 'Petrol', qty: '60 ltrs', totalAmount: '$120.00' },
  { id: '16', date: '2024-11-16', customer: 'Grace M.', product: 'Gas 6kg', qty: '5 pcs', totalAmount: '$100.00' },
  { id: '17', date: '2024-11-17', customer: 'Henry N.', product: 'Gas 12kg', qty: '3 pcs', totalAmount: '$60.00' },
  { id: '18', date: '2024-11-18', customer: 'Isla R.', product: 'Kerosene', qty: '10 ltrs', totalAmount: '$20.00' },
  { id: '19', date: '2024-11-19', customer: 'Jake O.', product: 'Diesel', qty: '55 ltrs', totalAmount: '$110.00' },
  { id: '20', date: '2024-11-20', customer: 'Kate P.', product: 'Petrol', qty: '25 ltrs', totalAmount: '$50.00' },
];


const SalePage = () => {
  
  const renderSaleItem = ({ item }: { item: Sale }) => (
    <View style={styles.saleRow}>
      <Text style={styles.saleColumn}>{item.date}</Text>
      <Text style={styles.saleColumn}>{item.customer}</Text>
      <Text style={styles.saleColumn}>{item.product}</Text>
      <Text style={styles.saleColumn}>{item.qty}</Text>
      <Text style={styles.saleColumn}>{item.totalAmount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
        <TouchableOpacity style={styles.syncButton}>
          <Text style={styles.syncText}>Sync</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headingSection}>
        <Text style={styles.headingText}>Sales Records</Text>
        <Text style={styles.filterDate}>Today to 10/10/2024</Text>
      </View>

      <View style={styles.subheadingSection}>
        <Text style={styles.subheadingText}>Date</Text>
        <Text style={styles.subheadingText}>Customer</Text>
        <Text style={styles.subheadingText}>Product</Text>
        <Text style={styles.subheadingText}>Qty</Text>
        <Text style={styles.subheadingText}>Total Amt</Text>
      </View>

      <FlatList
      data={salesData}
      renderItem={renderSaleItem}
      keyExtractor={(item) => item.id}
      />

      <TouchableOpacity style={styles.addSaleButton}>
        <Text style={styles.addSaleText}>Add Sale</Text>
      </TouchableOpacity>
    </View>
  );
}

export default SalePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 4
  },
  dateText: {
    color: "#555",
    fontSize: 15
  },
  syncButton: {
    borderRadius: 5,
    padding: 5,
  },
  syncText: {
    color: 'orange',
    fontSize: 15
  },

  // heading section
  headingSection: {
    backgroundColor: '#4682b4',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 3,
  },
  headingText: {
    color: 'white',
    fontSize: 16
  },
  filterDate: {
    color: 'white',
  },

  // subheading section
  subheadingSection: {
    backgroundColor: '#4682b4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign: 'center',
    paddingTop: 3,
    paddingBottom: 6,
  },
  subheadingText: {
    color: 'white',
    fontSize: 14,
    width: '20%',
    textAlign: 'center',
  },

  // sales render section
  saleRow: {
    backgroundColor: 'lightblue',
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
    flexDirection: 'row',
    justifyContent:'space-between',
    paddingVertical: 8,
  },
  saleColumn: {
    textAlign: 'center',
    width: '20%',
  },
  // Add sale button
  addSaleButton: {
    backgroundColor: "white",
    borderRadius: 100,
    bottom: 5,
    right: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    position: 'absolute',
    elevation: 3,
  },
  addSaleText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
