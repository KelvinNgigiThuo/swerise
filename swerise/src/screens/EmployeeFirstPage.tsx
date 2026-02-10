import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, FlatList } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements'; 
import SalePage from './SalePage';
import SettingsPage from './SettingsPage';
import { getTodaysSalesTotal, getTodaysCreditSales, getAllTimeSales, getAllTimeCreditSales, getLastFiveSales, getStockBalances } from '../database';
import { syncPending } from '../services/syncService';
import { useFocusEffect } from '@react-navigation/native';
import { Sale, SaleUI, StockBalance } from './types';

const Tab = createBottomTabNavigator();

const EmployeeHome = () => {
  const [salesTodayTotal, setTotalSales] = useState(0);
  const [creditTodaySales, setCreditSales] = useState(0);
  const [creditPercentage, setCreditPercentage] = useState(0);
  const [allTimeSales, setAllTimeSales] = useState(0);
  const [allTimeCreditSales, setAllTimeCreditSales] = useState(0);
  const [allTimeCreditPercentage, setAllTimeCreditPercentage] = useState(0);
  const [salesData, setSalesData] = useState<SaleUI[]>([]);
  const [stockBalances, setStockBalances] = useState<StockBalance[]>([]);

  const fetchData = async () => {
    try {
      const salesTodayTotal = await getTodaysSalesTotal();
      const creditTodaySales = await getTodaysCreditSales();
      const allTimeSales = await getAllTimeSales();
      const allTimeCreditSales = await getAllTimeCreditSales();
      const stock = await getStockBalances(1);

      setTotalSales(salesTodayTotal);
      setCreditSales(creditTodaySales);
      setAllTimeSales(allTimeSales);
      setAllTimeCreditSales(allTimeCreditSales);
      setStockBalances(stock);

      const percentage = salesTodayTotal > 0 ? (creditTodaySales / salesTodayTotal) * 100 : 0;
      setCreditPercentage(percentage);
      const allTimePercentage = allTimeSales > 0 ? (allTimeCreditSales / allTimeSales) * 100 : 0;
      setAllTimeCreditPercentage(allTimePercentage);
    } catch (error) {
      console.error('Error fetching today\'s sales:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const mapSaleToUI = (sale: Sale): SaleUI => ({
    id: sale.sale_id.toString(),
    date: new Date(sale.sale_date).toLocaleDateString(),
    customer: sale.customer_name || "New",
    product: sale.product_name || "Unknown Product",
    qty: `${sale.quantity} ${sale.product_unit || ""}`.trim(),
    totalAmount: `${sale.total_price.toFixed(2)}`
  });

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const salesFromDatabase = await getLastFiveSales();
        const mappedSales = salesFromDatabase.map(mapSaleToUI);
        setSalesData(mappedSales);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    fetchSales();
  }, []);

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
        <TouchableOpacity style={styles.syncButton} onPress={() => syncPending()}>
          <Text style={styles.syncText}> Sync </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.salesOverview}>
        <View style={styles.salesBox}>
          <Text style={styles.salesHeading}>Today's Sales</Text>
          <Text style={styles.salesNumber}>Ksh. {salesTodayTotal.toFixed(2)}</Text>
          <View style={styles.salesBottom}>
            <Text style={styles.salesBottomText}>Credits</Text>
            <Text style={styles.salesBottomText}>Ksh {creditTodaySales.toFixed(2)}</Text>
            <Text style={styles.salesBottomText}>{creditPercentage.toFixed(0)}%</Text>
          </View>
        </View>
        <View style={styles.salesBox}>
          <Text style={styles.salesHeading}>Total Sales</Text>
          <Text style={styles.salesNumber}>Ksh. {allTimeSales.toFixed(2)}</Text>
          <View style={styles.salesBottom}>
            <Text style={styles.salesBottomText}>Credits</Text>
            <Text style={styles.salesBottomText}>Ksh {allTimeCreditSales.toFixed(2)}</Text>
            <Text style={styles.salesBottomText}>{allTimeCreditPercentage.toFixed(2)}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.recentSales}>
        <Text style={styles.recentSalesHeading}>Recent Sales</Text>
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

      <View style={styles.bottomOverview}>
        <View style={styles.bottomOverviewBox}>
          <View style={styles.bottomOverviewHeading}>
            <Text style={styles.bottomOverviewHeadingText}>Inventory balance</Text>
          </View>
          <View style={styles.bottomOverviewSubHeading}>
            <Text style={styles.bottomOverviewSubHeadingText}>Product</Text>
            <Text style={styles.bottomOverviewSubHeadingText}>Qty</Text>
          </View>
          <View>
            {stockBalances.map(item => (
              <View key={item.product_id} style={styles.inventoryBox}>
                <Text>{item.name}</Text>
                <Text>
                  {item.balance} {item.unit}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomOverviewBox}>
          <View style={styles.bottomOverviewHeading}>
            <Text style={styles.bottomOverviewHeadingText}>Customer Balances</Text>
          </View>
          <View style={styles.bottomOverviewSubHeading}>
            <Text style={styles.bottomOverviewSubHeadingText}>Customer</Text>
            <Text style={styles.bottomOverviewSubHeadingText}>Bal.</Text>
          </View>
          <View style={styles.inventoryBox}>
            <Text>Alex</Text>
            <Text>Ksh 2,500</Text>
          </View>
          <View style={styles.inventoryBox}>
            <Text>Mathew</Text>
            <Text>Ksh 30,000</Text>
          </View>
          <View style={styles.inventoryBox}>
            <Text>Lucy</Text>
            <Text>Ksh 24,000</Text>
          </View>
          <View style={styles.inventoryBox}>
            <Text>Kelvin</Text>
            <Text>Ksh 10,000</Text>
          </View>
          <View style={styles.inventoryBox}>
            <Text>Loft</Text>
            <Text>Ksh 20,000</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const EmployeeFirstPage = () => {
  return (
    <Tab.Navigator
      initialRouteName="EmployeeHome"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'EmployeeHome') {
            iconName = 'home';
          } else if (route.name === 'Sales') {
            iconName = 'shopping-cart';
          } else if (route.name === 'Settings') {
            iconName = 'cogs';
          }

          return <Icon name={iconName} type="font-awesome" size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4682b4',
        tabBarInactiveTintColor: '#8a8a8a',
        tabBarStyle: {
          backgroundColor: '#252F40',
          height: 60,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="EmployeeHome"
        component={EmployeeHome}
        options={{ tabBarLabel: 'Home', headerShown: false }}
      />
      <Tab.Screen
        name="Sales"
        component={SalePage}
        options={{ tabBarLabel: 'Sales', headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsPage}
        options={{ tabBarLabel: 'Settings', headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  dateText: { 
    fontSize: 15 
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    paddingBottom: 15,
  },
  // recent sales
  recentSales: {
    backgroundColor: '#4682b4',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 15,
  },
  recentSalesHeading: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingVertical: 5,
  },
  subheadingSection: {
    backgroundColor: '#4682b4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign: 'center',
    paddingTop: 2,
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
    justifyContent:'space-between',
    paddingVertical: 8,
  },
  saleColumn: {
    textAlign: 'center',
    width: '20%',
  },
  recentSaleShowMoreButtonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  salesOverview: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' },
  salesBox: {
    backgroundColor: '#4682b4',
    width: '48.5%',
    borderRadius: 5,
  },
  salesBottom: {
    backgroundColor: 'lightblue',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  salesBottomText: { 
    color: 'red' },
  salesHeading: { 
    color: 'white', 
    paddingLeft: 10 },
  salesNumber: { 
    paddingLeft: 45, 
    fontSize: 20, 
    color: 'white' },
  syncButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    width: '20%',
  },
  syncText: { color: 'orange', fontSize: 15, fontWeight: 'bold' },

  // bottom overview
  bottomOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },
  bottomOverviewBox: {
    width: '48.5%',
    
  },
  bottomOverviewHeading: {
    backgroundColor: '#4682b4',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  bottomOverviewHeadingText:{
    color: 'white',
    fontSize: 15,
    paddingTop: 6,
    paddingLeft: 10,
  },
  bottomOverviewSubHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#4682b4',
  },
  bottomOverviewSubHeadingText:{
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 8
  },
  inventoryBox: {
    backgroundColor: 'lightblue',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

});

export default EmployeeFirstPage;
