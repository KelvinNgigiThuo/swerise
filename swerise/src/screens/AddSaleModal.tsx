import React, { useEffect, useMemo, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { getProductsWithCurrentPrice } from "../database";
import { ProductWithPrice, SaleInput, DebtInfo } from "./types";

// Define an interface for the props
interface AddSaleModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (sale: SaleInput, saleType: "cash" | "debt", debtInfo: DebtInfo) => void;
}

// Use the interface to type the props in the component
const AddSaleModal: React.FC<AddSaleModalProps> = ({ visible, onClose, onSubmit }) => {
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [product, setProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [saleType, setSaleType] = useState<"cash" | "debt">("cash");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [amountDue, setAmountDue] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const list = await getProductsWithCurrentPrice();
        setProducts(list);
        if (list.length > 0) {
          setProduct(list[0].product_id);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    if (visible) {
      loadProducts();
    }
  }, [visible]);

  const selectedProduct = useMemo(
    () => products.find(item => item.product_id === product) || null,
    [products, product]
  );

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }
    if (!quantity) {
      setTotalPrice("");
      return;
    }
    const qty = parseFloat(quantity);
    if (Number.isNaN(qty) || qty <= 0) {
      setTotalPrice("");
      return;
    }
    if (selectedProduct.price > 0) {
      const computed = qty * selectedProduct.price;
      setTotalPrice(computed.toFixed(2));
      if (saleType === "debt") {
        setAmountDue(computed.toFixed(2));
      }
    }
  }, [quantity, selectedProduct, saleType]);

  useEffect(() => {
    if (saleType === "debt" && totalPrice) {
      setAmountDue(totalPrice);
    }
  }, [saleType, totalPrice]);

  const handleAddSale = () => {
    if (!selectedProduct) {
      Alert.alert("Please select a product.");
      return;
    }

    // Validate inputs
    if (!quantity) {
      Alert.alert("Please fill in all required fields.");
      return;
    }
    const qty = parseFloat(quantity);
    if (Number.isNaN(qty) || qty <= 0) {
      Alert.alert("Please enter a valid quantity.");
      return;
    }

    const priceLocked = selectedProduct.price > 0;
    const manualTotal = parseFloat(totalPrice);
    const computedTotal = priceLocked ? qty * selectedProduct.price : manualTotal;
    const total = computedTotal;
    if (!priceLocked && (!totalPrice || Number.isNaN(total) || total <= 0)) {
      Alert.alert("Total price is required when price is not set.");
      return;
    }
    if (priceLocked && (!Number.isFinite(total) || total <= 0)) {
      Alert.alert("Total price could not be calculated. Check quantity.");
      return;
    }

    if (saleType === "debt") {
      if (!customerName || !customerPhone) {
        Alert.alert("Customer name and phone are required for debt sales.");
        return;
      }
      if (!amountDue || Number.isNaN(parseFloat(amountDue))) {
        Alert.alert("Amount due is required for debt sales.");
        return;
      }
    }

    // Prepare the sale object
    const sale = {
      shop_id: 1, // Default shop ID
      product_id: selectedProduct.product_id,
      quantity: qty,
      unit_price: priceLocked ? selectedProduct.price : total / qty,
      total_price: total,
      employee_id: null, // Adjust this as needed for your use case
    };

    // Handle submission
    onSubmit(sale, saleType, {
      customer_name: customerName,
      customer_phone: customerPhone,
      amount_due: parseFloat(amountDue) || 0,
    });

    // Close the modal
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Sale</Text>

          <Text>Product:</Text>
          <Picker
            selectedValue={product}
            onValueChange={(itemValue) => setProduct(itemValue)}
          >
            {products.map(item => (
              <Picker.Item key={item.product_id} label={item.name} value={item.product_id} />
            ))}
          </Picker>

          <Text>
            Quantity {selectedProduct ? `(${selectedProduct.unit})` : ""}
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <Text>Total Price:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={totalPrice}
            onChangeText={setTotalPrice}
            editable={selectedProduct ? selectedProduct.price === 0 : true}
          />

          <Text>Sale Type:</Text>
          <Picker
            selectedValue={saleType}
            onValueChange={(itemValue) => setSaleType(itemValue)}
          >
            <Picker.Item label="Cash" value="cash" />
            <Picker.Item label="Debt" value="debt" />
          </Picker>

          {saleType === "debt" && (
            <>
              <Text>Customer Name:</Text>
              <TextInput
                style={styles.input}
                value={customerName}
                onChangeText={setCustomerName}
              />

              <Text>Customer Phone:</Text>
              <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                value={customerPhone}
                onChangeText={setCustomerPhone}
              />

              <Text>Amount Due:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amountDue}
                onChangeText={setAmountDue}
              />
            </>
          )}

          <TouchableOpacity style={styles.addButton} onPress={handleAddSale}>
            <Text style={styles.addButtonText}>Add Sale</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddSaleModal;

// Styles for the modal
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4682b4',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});
