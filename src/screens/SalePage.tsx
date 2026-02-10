import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { getSalesByDate, insertSale, insertDebt } from "../database";
import AddSaleModal from "./AddSaleModal";
import { Sale, SaleUI, Debt, DebtInfo } from './types';

const SalePage = () => {
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month'>('today');
  const [salesData, setSalesData] = useState<SaleUI[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const productMapping: { [key: number]: string } = {
    1: "Gas 6kg",
    2: "Gas 12kg",
    3: "Diesel",
    4: "Petrol",
    5: "Kerosene"
  };

  // Function to map the raw database sale to the UI-friendly format
  const mapSaleToUI = (sale: Sale): SaleUI => {
    return {
      id: sale.sale_id.toString(),
      date: new Date(sale.sale_date).toLocaleDateString(), 
      customer: sale.customer || "New",
      product: productMapping[sale.product_id] || "Unknown Product", 
      qty: `${sale.quantity} pcs`, 
      totalAmount: `${sale.total_price.toFixed(2)}` 
    };
  };

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const salesFromDatabase = await getSalesByDate(dateFilter); 
        const mappedSales = salesFromDatabase.map(mapSaleToUI);
        setSalesData(mappedSales);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    fetchSales();
  }, [dateFilter]);

  // Function to change the filter
  const handleFilterChange = (newFilter: 'today' | 'week' | 'month') => {
    setDateFilter(newFilter);
  };

  // Function to handle adding a sale
  const handleAddSale = async (
    sale: Omit<Sale, "sale_id">, 
    saleType: "cash" | "debt",
    debtInfo: DebtInfo
  ) => {
    try {
      
      const sale_id = await insertSale(sale, saleType, debtInfo); 

      if (saleType === "debt") {
        const debt: Debt = {
          sale_id: sale_id, 
          customer_name: debtInfo.customer_name,
          customer_phone: debtInfo.customer_phone,
          amount_due: debtInfo.amount_due,
          amount_paid: 0, 
        };

        
        await insertDebt(debt); 
      }

      setIsModalVisible(false); 

      
      const updatedSales = await getSalesByDate(dateFilter);
      setSalesData(updatedSales.map(mapSaleToUI));
    } catch (error) {
      console.error("Error adding sale:", error);
    }
  };

  const renderSaleItem = ({ item }: { item: SaleUI }) => (
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
        <Text style={styles.filterDate}>
          {dateFilter === 'today'
            ? 'Today'
            : dateFilter === 'week'
            ? 'This Week'
            : 'This Month'}
        </Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity onPress={() => handleFilterChange('today')}>
            <Text style={styles.filterButtonText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFilterChange('week')}>
            <Text style={styles.filterButtonText}>Week</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFilterChange('month')}>
            <Text style={styles.filterButtonText}>Month</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.subheadingSection}>
        <Text style={styles.subheadingText}>Date</Text>
        <Text style={styles.subheadingText}>Customer</Text>
        <Text style={styles.subheadingText}>Product</Text>
        <Text style={styles.subheadingText}>Qty</Text>
        <Text style={styles.subheadingText}>Total Amt (Ksh)</Text>
      </View>

      <FlatList
        data={salesData}
        renderItem={renderSaleItem}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity style={styles.addSaleButton}
      onPress={() => setIsModalVisible(true)}>
        <Text style={styles.addSaleText}>Add Sale</Text>
      </TouchableOpacity>
      {/* Add Sale Modal */}
      
      <AddSaleModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)} 
        onSubmit={handleAddSale} 
      />

    </View>
  );
};

export default SalePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 4,
  },
  dateText: {
    color: "#555",
    fontSize: 15,
  },
  syncButton: {
    borderRadius: 5,
    padding: 5,
  },
  syncText: {
    color: 'orange',
    fontSize: 15,
  },
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
    fontSize: 16,
  },
  filterDate: {
    color: 'white',
  },
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
  saleRow: {
    backgroundColor: 'lightblue',
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  saleColumn: {
    textAlign: 'center',
    width: '20%',
  },
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
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  filterButtonText: {
    color: 'white',
    fontSize: 14,
    padding: 5,
  },
});
