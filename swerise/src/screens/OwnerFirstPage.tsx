import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  getProductsWithCurrentPrice,
  setProductPrice,
  insertRestock,
  getStockThresholds,
  setStockThreshold
} from "../database";
import { ProductWithPrice, StockThreshold } from "./types";

const OwnerFirstPage = () => {
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [thresholds, setThresholds] = useState<StockThreshold[]>([]);
  const [priceInputs, setPriceInputs] = useState<Record<number, string>>({});
  const [thresholdInputs, setThresholdInputs] = useState<Record<number, string>>({});
  const [restockProduct, setRestockProduct] = useState<number | null>(null);
  const [restockQuantity, setRestockQuantity] = useState("");

  const shopId = 1;

  const selectedRestockProduct = useMemo(
    () => products.find(item => item.product_id === restockProduct) || null,
    [products, restockProduct]
  );

  const loadData = async () => {
    try {
      const productList = await getProductsWithCurrentPrice();
      const thresholdList = await getStockThresholds(shopId);
      setProducts(productList);
      setThresholds(thresholdList);
      setRestockProduct(productList.length > 0 ? productList[0].product_id : null);

      const priceState: Record<number, string> = {};
      productList.forEach(item => {
        priceState[item.product_id] = item.price.toString();
      });
      setPriceInputs(priceState);

      const thresholdState: Record<number, string> = {};
      thresholdList.forEach(item => {
        thresholdState[item.product_id] = item.threshold_quantity.toString();
      });
      setThresholdInputs(thresholdState);
    } catch (error) {
      console.error("Error loading owner data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePriceSave = async (productId: number) => {
    const value = parseFloat(priceInputs[productId]);
    if (Number.isNaN(value) || value < 0) {
      Alert.alert("Enter a valid price.");
      return;
    }
    await setProductPrice(productId, value, null);
    loadData();
  };

  const handleThresholdSave = async (productId: number) => {
    const value = parseFloat(thresholdInputs[productId]);
    if (Number.isNaN(value) || value < 0) {
      Alert.alert("Enter a valid threshold.");
      return;
    }
    await setStockThreshold(shopId, productId, value);
    loadData();
  };

  const handleRestock = async () => {
    if (!restockProduct) {
      Alert.alert("Select a product to restock.");
      return;
    }
    const qty = parseFloat(restockQuantity);
    if (Number.isNaN(qty) || qty <= 0) {
      Alert.alert("Enter a valid quantity.");
      return;
    }
    await insertRestock(shopId, restockProduct, qty, null);
    setRestockQuantity("");
    Alert.alert("Restock recorded.");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Owner Console</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Prices</Text>
        {products.map(item => (
          <View key={item.product_id} style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.label}>{item.name}</Text>
              <Text style={styles.subLabel}>Unit: {item.unit}</Text>
            </View>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={priceInputs[item.product_id] ?? ""}
              onChangeText={text =>
                setPriceInputs(current => ({ ...current, [item.product_id]: text }))
              }
            />
            <TouchableOpacity style={styles.actionButton} onPress={() => handlePriceSave(item.product_id)}>
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Set Stock Thresholds</Text>
        {thresholds.map(item => (
          <View key={item.product_id} style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.label}>{item.name}</Text>
              <Text style={styles.subLabel}>Unit: {item.unit}</Text>
            </View>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={thresholdInputs[item.product_id] ?? ""}
              onChangeText={text =>
                setThresholdInputs(current => ({ ...current, [item.product_id]: text }))
              }
            />
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleThresholdSave(item.product_id)}
            >
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Record Restock</Text>
        <Text style={styles.label}>Product</Text>
        <Picker selectedValue={restockProduct} onValueChange={value => setRestockProduct(value)}>
          {products.map(item => (
            <Picker.Item key={item.product_id} label={item.name} value={item.product_id} />
          ))}
        </Picker>
        <Text style={styles.label}>
          Quantity {selectedRestockProduct ? `(${selectedRestockProduct.unit})` : ""}
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={restockQuantity}
          onChangeText={setRestockQuantity}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={handleRestock}>
          <Text style={styles.primaryText}>Save Restock</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12
  },
  section: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  rowLeft: {
    flex: 1
  },
  label: {
    fontSize: 14,
    fontWeight: "600"
  },
  subLabel: {
    fontSize: 12,
    color: "#666"
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 80,
    marginRight: 8
  },
  actionButton: {
    backgroundColor: "#4682b4",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6
  },
  actionText: {
    color: "white"
  },
  primaryButton: {
    backgroundColor: "#252F40",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8
  },
  primaryText: {
    color: "white",
    fontWeight: "bold"
  }
});

export default OwnerFirstPage;
