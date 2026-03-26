import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  FUEL_OPTIONS,
  GAS_OPTIONS,
  OWNER_PRODUCT_CONFIG,
  type FuelProduct,
  type GasProduct,
  type ProductKey,
  type ProductPricingConfig,
  type SaleCategory,
} from '@/lib/owner-pricing';

type CaptureMode = 'single' | 'consolidated';
type PaymentMethod = 'cash' | 'mpesa' | 'debt' | 'mixed';
type DebtCustomerMode = 'existing' | 'new';

type ExistingCustomer = {
  id: string;
  name: string;
  phone: string;
  outstandingBalance: number;
};

const initialStockLevels: Record<ProductKey, number> = {
  petrol: 4200.5,
  diesel: 3865.2,
  kerosene: 970.4,
  '6kg': 34,
  '13kg': 21,
};

const existingCustomers: ExistingCustomer[] = [
  { id: 'cust-1', name: 'M. Wanjiku', phone: '0712 456 908', outstandingBalance: 3400 },
  { id: 'cust-2', name: 'K. Otieno', phone: '0709 133 201', outstandingBalance: 1850 },
  { id: 'cust-3', name: 'A. Kiptoo', phone: '0723 900 415', outstandingBalance: 700 },
];

const parseNumber = (raw: string) => {
  const cleaned = raw.replace(/,/g, '').trim();
  if (!cleaned) {
    return NaN;
  }
  return Number(cleaned);
};

const parseCount = (raw: string) => {
  const value = Number(raw.trim());
  if (!Number.isInteger(value)) {
    return NaN;
  }
  return value;
};

const formatMoney = (value: number) =>
  `KES ${value.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;

const formatQty = (value: number, unit: ProductPricingConfig['unitLabel']) => {
  if (unit === 'L') {
    return `${value.toLocaleString('en-KE', { maximumFractionDigits: 1 })} L`;
  }
  return `${value.toLocaleString('en-KE', { maximumFractionDigits: 0 })} cylinders`;
};

export default function SaleEntryScreen() {
  const insets = useSafeAreaInsets();
  const [captureMode, setCaptureMode] = useState<CaptureMode>('single');
  const [saleCategory, setSaleCategory] = useState<SaleCategory>('fuel');
  const [fuelProduct, setFuelProduct] = useState<FuelProduct>('petrol');
  const [gasProduct, setGasProduct] = useState<GasProduct>('6kg');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

  const [quantityText, setQuantityText] = useState('');
  const [gasSaleAmountText, setGasSaleAmountText] = useState('');
  const [batchTransactionsText, setBatchTransactionsText] = useState('');
  const [batchWindowText, setBatchWindowText] = useState('');
  const [noteText, setNoteText] = useState('');

  const [debtCustomerMode, setDebtCustomerMode] = useState<DebtCustomerMode>('existing');
  const [existingCustomerId, setExistingCustomerId] = useState(existingCustomers[0]?.id ?? '');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerOpeningBalance, setNewCustomerOpeningBalance] = useState('0');

  const [stockLevels, setStockLevels] = useState<Record<ProductKey, number>>(initialStockLevels);

  const selectedProductKey: ProductKey = saleCategory === 'fuel' ? fuelProduct : gasProduct;
  const selectedProduct = OWNER_PRODUCT_CONFIG[selectedProductKey];
  const currentStock = stockLevels[selectedProductKey];
  const isGasSale = saleCategory === 'gas';

  const quantityValue = parseNumber(quantityText);
  const suggestedAmountValue =
    Number.isFinite(quantityValue) && quantityValue > 0
      ? quantityValue * selectedProduct.unitPrice
      : NaN;
  const manualGasAmountValue = parseNumber(gasSaleAmountText);
  const hasManualGasAmount = gasSaleAmountText.trim().length > 0;
  const amountValue = isGasSale
    ? hasManualGasAmount
      ? manualGasAmountValue
      : suggestedAmountValue
    : suggestedAmountValue;
  const openingBalanceValue = parseNumber(newCustomerOpeningBalance);
  const batchTransactions = parseCount(batchTransactionsText);
  const projectedStock =
    Number.isFinite(quantityValue) && quantityValue > 0 ? currentStock - quantityValue : null;

  const selectedExistingCustomer = useMemo(
    () => existingCustomers.find(customer => customer.id === existingCustomerId) ?? null,
    [existingCustomerId],
  );

  useEffect(() => {
    if (saleCategory === 'gas' && captureMode === 'consolidated') {
      setCaptureMode('single');
      setBatchTransactionsText('');
      setBatchWindowText('');
      setPaymentMethod('cash');
      Alert.alert(
        'Consolidated mode unavailable for gas',
        'Gas cylinder sales should be recorded directly per sale, especially for debt tracking.',
      );
    }
  }, [captureMode, saleCategory]);

  useEffect(() => {
    if (captureMode === 'consolidated' && paymentMethod === 'debt') {
      setPaymentMethod('cash');
    }
  }, [captureMode, paymentMethod]);

  const debtPreviewBalance =
    paymentMethod === 'debt' && Number.isFinite(amountValue) && amountValue > 0
      ? debtCustomerMode === 'existing' && selectedExistingCustomer !== null
        ? selectedExistingCustomer.outstandingBalance + amountValue
        : debtCustomerMode === 'new' && Number.isFinite(openingBalanceValue)
          ? openingBalanceValue + amountValue
          : null
      : null;

  const clearEntryFields = () => {
    setQuantityText('');
    setGasSaleAmountText('');
    setBatchTransactionsText('');
    setBatchWindowText('');
    setNoteText('');
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewCustomerOpeningBalance('0');
    setDebtCustomerMode('existing');
    if (existingCustomers[0]) {
      setExistingCustomerId(existingCustomers[0].id);
    }
  };

  const submitSale = () => {
    if (!Number.isFinite(quantityValue) || quantityValue <= 0) {
      Alert.alert('Quantity required', `Enter total quantity in ${selectedProduct.unitLabel}.`);
      return;
    }

    if (selectedProduct.unitLabel === 'cylinders' && !Number.isInteger(quantityValue)) {
      Alert.alert('Invalid quantity', 'Cylinder quantity must be a whole number.');
      return;
    }

    if (
      isGasSale &&
      hasManualGasAmount &&
      (!Number.isFinite(manualGasAmountValue) || manualGasAmountValue <= 0)
    ) {
      Alert.alert('Amount required', 'Enter a valid negotiated amount in KES for this gas sale.');
      return;
    }

    if (quantityValue > currentStock) {
      Alert.alert(
        'Insufficient stock',
        `Available stock: ${formatQty(currentStock, selectedProduct.unitLabel)}.`,
      );
      return;
    }

    if (captureMode === 'consolidated') {
      if (!Number.isFinite(batchTransactions) || batchTransactions <= 0) {
        Alert.alert(
          'Transactions required',
          'Enter number of sales covered in this consolidated entry.',
        );
        return;
      }

      if (batchWindowText.trim().length < 3) {
        Alert.alert(
          'Time window required',
          'Provide the period covered, for example 7:30 AM - 9:00 AM.',
        );
        return;
      }
    }

    if (paymentMethod === 'debt') {
      if (debtCustomerMode === 'existing' && selectedExistingCustomer === null) {
        Alert.alert('Customer required', 'Select an existing customer for this debt sale.');
        return;
      }

      if (debtCustomerMode === 'new' && newCustomerName.trim().length < 3) {
        Alert.alert('Customer required', 'Enter customer full name.');
        return;
      }
    }

    const updatedStock = Number(
      (currentStock - quantityValue).toFixed(selectedProduct.unitLabel === 'L' ? 1 : 0),
    );

    setStockLevels(previous => ({
      ...previous,
      [selectedProductKey]: updatedStock,
    }));

    const paymentLabel =
      paymentMethod === 'cash'
        ? 'Cash'
        : paymentMethod === 'mpesa'
          ? 'M-Pesa'
          : paymentMethod === 'mixed'
            ? 'Mixed'
            : 'Debt';

    const entryTypeLabel = captureMode === 'single' ? 'Single Sale' : 'Peak Hour Consolidated';
    const accountingLabel =
      captureMode === 'consolidated'
        ? `${selectedProduct.accountingAccount} (Consolidated Entry)`
        : selectedProduct.accountingAccount;

    const batchDetails =
      captureMode === 'consolidated'
        ? `\nTransactions covered: ${batchTransactions}\nPeriod: ${batchWindowText.trim()}`
        : '';

    const debtDetails =
      paymentMethod !== 'debt'
        ? ''
        : debtCustomerMode === 'existing'
          ? `\nDebt customer: ${selectedExistingCustomer?.name ?? '--'} (${selectedExistingCustomer?.phone ?? '--'})`
          : `\nDebt customer: ${newCustomerName.trim()} (${newCustomerPhone.trim() || 'No phone'})`;

    const debtBalanceText =
      paymentMethod === 'debt' && debtPreviewBalance !== null
        ? `\nNew debt balance: ${formatMoney(debtPreviewBalance)}`
        : '';

    const noteDetails = noteText.trim() ? `\nNote: ${noteText.trim()}` : '';
    const pricingModeDetails =
      isGasSale && hasManualGasAmount
        ? '\nPricing mode: Negotiated gas amount'
        : '\nPricing mode: Owner set pricing';

    Alert.alert(
      'Sale saved (dummy)',
      `Entry type: ${entryTypeLabel}\nProduct: ${selectedProduct.label}\nUnit price snapshot: ${formatMoney(selectedProduct.unitPrice)} / ${selectedProduct.unitLabel}\nQuantity: ${formatQty(quantityValue, selectedProduct.unitLabel)}\nAmount: ${formatMoney(amountValue)}${pricingModeDetails}\nPayment: ${paymentLabel}\nAccounting: ${accountingLabel}\nInventory bucket: ${selectedProduct.inventoryBucket}\nRemaining stock: ${formatQty(updatedStock, selectedProduct.unitLabel)}${batchDetails}${debtDetails}${debtBalanceText}${noteDetails}`,
      [
        { text: 'Go to Sales', onPress: () => router.replace('/(tabs)/sales') },
        { text: 'Record Another', style: 'default', onPress: clearEntryFields },
      ],
    );
  };

  const paymentOptions: { value: PaymentMethod; label: string; disabled?: boolean }[] =
    captureMode === 'consolidated'
      ? [
          { value: 'cash', label: 'Cash' },
          { value: 'mpesa', label: 'M-Pesa' },
          { value: 'mixed', label: 'Mixed' },
          { value: 'debt', label: 'Debt', disabled: true },
        ]
      : [
          { value: 'cash', label: 'Cash' },
          { value: 'mpesa', label: 'M-Pesa' },
          { value: 'debt', label: 'Debt' },
        ];

  const contentBottomInset =
    Platform.OS === 'android'
      ? Math.max(insets.bottom + 30, 26)
      : Math.max(insets.bottom + 24, 26);

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: contentBottomInset }]}>
          <View style={styles.headerRow}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
            <Text style={styles.title}>Record Sale</Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Capture Mode</Text>
            <View style={styles.chipRow}>
              <ChoiceChip
                label="Single Sale"
                active={captureMode === 'single'}
                onPress={() => setCaptureMode('single')}
              />
              <ChoiceChip
                label="Peak Hour Consolidated"
                active={captureMode === 'consolidated'}
                onPress={() => {
                  if (saleCategory === 'gas') {
                    Alert.alert(
                      'Unavailable for gas',
                      'For accuracy, gas cylinders should be entered per sale.',
                    );
                    return;
                  }
                  setCaptureMode('consolidated');
                }}
              />
            </View>
            <Text style={styles.helperText}>
              Use consolidated mode during high traffic to record many fuel sales as one entry.
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Product</Text>
            <View style={styles.chipRow}>
              <ChoiceChip
                label="Fuel"
                active={saleCategory === 'fuel'}
                onPress={() => setSaleCategory('fuel')}
              />
              <ChoiceChip
                label="Gas Cylinder"
                active={saleCategory === 'gas'}
                onPress={() => setSaleCategory('gas')}
              />
            </View>

            <View style={styles.chipRow}>
              {saleCategory === 'fuel'
                ? FUEL_OPTIONS.map(option => (
                    <ChoiceChip
                      key={option.value}
                      label={option.label}
                      active={fuelProduct === option.value}
                      onPress={() => setFuelProduct(option.value)}
                    />
                  ))
                : GAS_OPTIONS.map(option => (
                    <ChoiceChip
                      key={option.value}
                      label={option.label}
                      active={gasProduct === option.value}
                      onPress={() => setGasProduct(option.value)}
                    />
                  ))}
            </View>

            <View style={styles.infoBox}>
              <InfoLine label="Selling unit" value={selectedProduct.unitLabel === 'L' ? 'Litres (L)' : 'Cylinders'} />
              <InfoLine
                label="Owner unit price"
                value={`${formatMoney(selectedProduct.unitPrice)} / ${selectedProduct.unitLabel}`}
              />
              <InfoLine label="Accounting account" value={selectedProduct.accountingAccount} />
              <InfoLine label="Inventory bucket" value={selectedProduct.inventoryBucket} />
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Sale Details</Text>

            <Text style={styles.inputLabel}>
              Total Quantity ({selectedProduct.unitLabel === 'L' ? 'L' : 'cylinders'})
            </Text>
            <TextInput
              value={quantityText}
              onChangeText={setQuantityText}
              keyboardType="decimal-pad"
              placeholder={selectedProduct.unitLabel === 'L' ? 'e.g. 25.5' : 'e.g. 2'}
              placeholderTextColor="#86A092"
              style={styles.input}
            />

            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>
                {isGasSale ? 'Suggested total (owner pricing)' : 'Auto total (owner pricing)'}
              </Text>
              <Text style={styles.totalValue}>
                {Number.isFinite(suggestedAmountValue) ? formatMoney(suggestedAmountValue) : '--'}
              </Text>
            </View>

            {isGasSale && (
              <>
                <Text style={styles.inputLabel}>Final Sale Amount (KES)</Text>
                <TextInput
                  value={gasSaleAmountText}
                  onChangeText={setGasSaleAmountText}
                  keyboardType="decimal-pad"
                  placeholder={
                    Number.isFinite(suggestedAmountValue)
                      ? `Suggested ${formatMoney(suggestedAmountValue)}`
                      : 'Enter negotiated amount'
                  }
                  placeholderTextColor="#86A092"
                  style={styles.input}
                />
                <Text style={styles.helperText}>
                  Leave blank to use owner pricing. Fill this when a customer bargains on gas.
                </Text>
                {hasManualGasAmount && Number.isFinite(amountValue) && (
                  <Text style={styles.negotiatedValueText}>
                    Negotiated total: {formatMoney(amountValue)}
                  </Text>
                )}
              </>
            )}

            {captureMode === 'consolidated' && (
              <>
                <Text style={styles.inputLabel}>Transactions Covered</Text>
                <TextInput
                  value={batchTransactionsText}
                  onChangeText={setBatchTransactionsText}
                  keyboardType="number-pad"
                  placeholder="e.g. 17"
                  placeholderTextColor="#86A092"
                  style={styles.input}
                />

                <Text style={styles.inputLabel}>Period Covered</Text>
                <TextInput
                  value={batchWindowText}
                  onChangeText={setBatchWindowText}
                  placeholder="e.g. 7:30 AM - 9:00 AM"
                  placeholderTextColor="#86A092"
                  style={styles.input}
                />
              </>
            )}

            <Text style={styles.inputLabel}>Note (Optional)</Text>
            <TextInput
              value={noteText}
              onChangeText={setNoteText}
              placeholder="Short context for this entry"
              placeholderTextColor="#86A092"
              style={styles.input}
            />

            <View style={styles.infoBox}>
              <InfoLine
                label="Current stock"
                value={formatQty(currentStock, selectedProduct.unitLabel)}
              />
              {projectedStock !== null && (
                <InfoLine
                  label="Projected stock"
                  value={formatQty(projectedStock, selectedProduct.unitLabel)}
                />
              )}
              <InfoLine
                label="Reorder level"
                value={formatQty(selectedProduct.reorderLevel, selectedProduct.unitLabel)}
              />
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Payment</Text>
            <View style={styles.chipRow}>
              {paymentOptions.map(option => (
                <ChoiceChip
                  key={option.value}
                  label={option.label}
                  active={paymentMethod === option.value}
                  disabled={option.disabled}
                  onPress={() => {
                    if (!option.disabled) {
                      setPaymentMethod(option.value);
                    }
                  }}
                />
              ))}
            </View>
            {captureMode === 'consolidated' && (
              <Text style={styles.helperText}>
                Debt is disabled for consolidated entries. Capture debt sales directly as single entries.
              </Text>
            )}
          </View>

          {paymentMethod === 'debt' && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Debt Customer</Text>
              <View style={styles.chipRow}>
                <ChoiceChip
                  label="Existing Customer"
                  active={debtCustomerMode === 'existing'}
                  onPress={() => setDebtCustomerMode('existing')}
                />
                <ChoiceChip
                  label="New Customer"
                  active={debtCustomerMode === 'new'}
                  onPress={() => setDebtCustomerMode('new')}
                />
              </View>

              {debtCustomerMode === 'existing' ? (
                <View style={styles.innerBlock}>
                  {existingCustomers.map(customer => (
                    <Pressable
                      key={customer.id}
                      style={[
                        styles.customerRow,
                        existingCustomerId === customer.id && styles.customerRowActive,
                      ]}
                      onPress={() => setExistingCustomerId(customer.id)}>
                      <View style={styles.customerIdentity}>
                        <Text style={styles.customerName}>{customer.name}</Text>
                        <Text style={styles.customerMeta}>{customer.phone}</Text>
                      </View>
                      <Text style={styles.customerMeta}>
                        {formatMoney(customer.outstandingBalance)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={styles.innerBlock}>
                  <Text style={styles.inputLabel}>Customer Full Name</Text>
                  <TextInput
                    value={newCustomerName}
                    onChangeText={setNewCustomerName}
                    placeholder="e.g. Mary Wanjiku"
                    placeholderTextColor="#86A092"
                    style={styles.input}
                  />

                  <Text style={styles.inputLabel}>Phone Number (Optional)</Text>
                  <TextInput
                    value={newCustomerPhone}
                    onChangeText={setNewCustomerPhone}
                    keyboardType="phone-pad"
                    placeholder="e.g. 0712 000 000"
                    placeholderTextColor="#86A092"
                    style={styles.input}
                  />

                  <Text style={styles.inputLabel}>Existing Debt Balance (Optional)</Text>
                  <TextInput
                    value={newCustomerOpeningBalance}
                    onChangeText={setNewCustomerOpeningBalance}
                    keyboardType="decimal-pad"
                    placeholder="e.g. 0"
                    placeholderTextColor="#86A092"
                    style={styles.input}
                  />
                </View>
              )}

              {debtPreviewBalance !== null && (
                <View style={styles.previewBox}>
                  <Text style={styles.previewText}>
                    Projected debt balance: {formatMoney(debtPreviewBalance)}
                  </Text>
                </View>
              )}
            </View>
          )}

          <Pressable style={styles.submitButton} onPress={submitSale}>
            <Text style={styles.submitButtonText}>Save Sale</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ChoiceChip({
  label,
  active,
  disabled,
  onPress,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.chip, active && styles.chipActive, disabled && styles.chipDisabled]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={[styles.chipText, active && styles.chipTextActive, disabled && styles.chipTextDisabled]}>
        {label}
      </Text>
    </Pressable>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoLine}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#ECF4EF',
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 26,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    borderRadius: 10,
    backgroundColor: '#E6F1EA',
    borderWidth: 1,
    borderColor: '#D3E3DA',
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#1B4F35',
    fontWeight: '700',
    fontSize: 12,
  },
  title: {
    color: '#113725',
    fontSize: 22,
    fontWeight: '800',
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D3E3DA',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  sectionTitle: {
    color: '#113725',
    fontSize: 16,
    fontWeight: '800',
  },
  helperText: {
    color: '#4B6658',
    fontSize: 12,
    lineHeight: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#CBDBD1',
    backgroundColor: '#F8FCFA',
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  chipActive: {
    borderColor: '#1F7A4C',
    backgroundColor: '#E7F5EC',
  },
  chipDisabled: {
    backgroundColor: '#F1F3F2',
    borderColor: '#DEE5E0',
  },
  chipText: {
    color: '#395C4C',
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#19563A',
  },
  chipTextDisabled: {
    color: '#8AA093',
  },
  infoBox: {
    marginTop: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    backgroundColor: '#F8FCFA',
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 6,
  },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  infoLabel: {
    color: '#557261',
    fontSize: 12,
    fontWeight: '600',
  },
  infoValue: {
    color: '#17412F',
    fontSize: 12.5,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  inputLabel: {
    color: '#2C4F3F',
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 2,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C9DCD0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 11, android: 8 }),
    fontSize: 14,
    color: '#143A29',
  },
  totalBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDE9E2',
    backgroundColor: '#F8FCFA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 3,
  },
  totalLabel: {
    color: '#527060',
    fontSize: 12,
    fontWeight: '600',
  },
  totalValue: {
    color: '#1D5A3D',
    fontSize: 18,
    fontWeight: '800',
  },
  negotiatedValueText: {
    color: '#1A5D3C',
    fontSize: 12.5,
    fontWeight: '700',
  },
  innerBlock: {
    gap: 8,
  },
  customerRow: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDE9E2',
    backgroundColor: '#FBFDFC',
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  customerRowActive: {
    borderColor: '#1F7A4C',
    backgroundColor: '#EAF7F0',
  },
  customerIdentity: {
    flex: 1,
  },
  customerName: {
    color: '#163C2B',
    fontSize: 13.5,
    fontWeight: '700',
  },
  customerMeta: {
    color: '#567061',
    fontSize: 12,
    fontWeight: '600',
  },
  previewBox: {
    marginTop: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCE1D4',
    backgroundColor: '#EAF6EE',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  previewText: {
    color: '#1D5A3D',
    fontWeight: '700',
    fontSize: 12.5,
  },
  submitButton: {
    borderRadius: 12,
    backgroundColor: '#1F7A4C',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
