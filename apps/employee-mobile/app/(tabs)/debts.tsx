import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type DebtStatus = 'Open' | 'Overdue' | 'Cleared';
type FilterKey = 'open' | 'overdue' | 'cleared' | 'all';
type CollectionMethod = 'cash' | 'mpesa';

type DebtAccount = {
  id: string;
  customerName: string;
  phone: string;
  dueDate: string;
  outstanding: number;
};

type DebtEventType = 'sale_on_debt' | 'payment' | 'adjustment';

type DebtEvent = {
  id: string;
  debtId: string;
  type: DebtEventType;
  amount: number;
  createdAt: string;
  method?: CollectionMethod;
  note: string;
};

const initialDebtAccounts: DebtAccount[] = [
  { id: 'debt-1', customerName: 'M. Wanjiku', phone: '0712 456 908', dueDate: '2026-03-27', outstanding: 2800 },
  { id: 'debt-2', customerName: 'K. Otieno', phone: '0709 133 201', dueDate: '2026-03-24', outstanding: 1500 },
  { id: 'debt-3', customerName: 'A. Kiptoo', phone: '0723 900 415', dueDate: '2026-03-29', outstanding: 1200 },
  { id: 'debt-4', customerName: 'Shop Van 04', phone: '0720 221 991', dueDate: '2026-03-23', outstanding: 3200 },
];

const initialDebtEvents: DebtEvent[] = [
  {
    id: 'event-1',
    debtId: 'debt-1',
    type: 'sale_on_debt',
    amount: 2800,
    createdAt: '2026-03-25T09:05:00.000Z',
    note: '13kg cylinder sale recorded on debt',
  },
  {
    id: 'event-2',
    debtId: 'debt-2',
    type: 'sale_on_debt',
    amount: 2200,
    createdAt: '2026-03-23T10:12:00.000Z',
    note: 'Petrol sale recorded on debt',
  },
  {
    id: 'event-3',
    debtId: 'debt-2',
    type: 'payment',
    amount: -700,
    createdAt: '2026-03-24T14:21:00.000Z',
    method: 'mpesa',
    note: 'Partial payment received',
  },
  {
    id: 'event-4',
    debtId: 'debt-3',
    type: 'sale_on_debt',
    amount: 1200,
    createdAt: '2026-03-25T07:55:00.000Z',
    note: '6kg cylinder sale recorded on debt',
  },
  {
    id: 'event-5',
    debtId: 'debt-4',
    type: 'sale_on_debt',
    amount: 3200,
    createdAt: '2026-03-22T16:08:00.000Z',
    note: 'Diesel sale recorded on debt',
  },
];

const filterOrder: FilterKey[] = ['open', 'overdue', 'cleared', 'all'];
const filterLabels: Record<FilterKey, string> = {
  open: 'Open',
  overdue: 'Overdue',
  cleared: 'Cleared',
  all: 'All',
};

const eventLabel: Record<DebtEventType, string> = {
  sale_on_debt: 'Sale on debt',
  payment: 'Payment',
  adjustment: 'Adjustment',
};

const parseNumber = (raw: string) => {
  const cleaned = raw.replace(/,/g, '').trim();
  if (!cleaned) {
    return NaN;
  }
  return Number(cleaned);
};

const formatMoney = (value: number) =>
  `KES ${value.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-KE', { day: '2-digit', month: 'short' });

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('en-KE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

function getStatus(outstanding: number, dueDate: string): DebtStatus {
  if (outstanding <= 0) {
    return 'Cleared';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(`${dueDate}T00:00:00`);
  return due < today ? 'Overdue' : 'Open';
}

function roundCurrency(value: number) {
  return Number(value.toFixed(0));
}

export default function DebtsTab() {
  const [accounts, setAccounts] = useState<DebtAccount[]>(initialDebtAccounts);
  const [events, setEvents] = useState<DebtEvent[]>(initialDebtEvents);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('open');
  const [selectedDebtId, setSelectedDebtId] = useState(initialDebtAccounts[0]?.id ?? '');

  const [paymentAmountText, setPaymentAmountText] = useState('');
  const [collectionMethod, setCollectionMethod] = useState<CollectionMethod>('mpesa');

  const [adjustmentAmountText, setAdjustmentAmountText] = useState('');
  const [adjustmentReasonText, setAdjustmentReasonText] = useState('');

  const accountStatusMap = useMemo(
    () =>
      Object.fromEntries(accounts.map(account => [account.id, getStatus(account.outstanding, account.dueDate)])),
    [accounts],
  );

  const filteredAccounts = useMemo(
    () =>
      accounts.filter(account => {
        if (activeFilter === 'all') {
          return true;
        }

        const status = accountStatusMap[account.id];
        if (activeFilter === 'open') {
          return status === 'Open';
        }
        if (activeFilter === 'overdue') {
          return status === 'Overdue';
        }
        return status === 'Cleared';
      }),
    [accounts, activeFilter, accountStatusMap],
  );

  const selectedAccount =
    accounts.find(account => account.id === selectedDebtId) ?? filteredAccounts[0] ?? accounts[0] ?? null;

  const selectedStatus = selectedAccount ? accountStatusMap[selectedAccount.id] : null;

  const selectedHistory = useMemo(
    () =>
      selectedAccount === null
        ? []
        : events
            .filter(event => event.debtId === selectedAccount.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [events, selectedAccount],
  );

  const totals = useMemo(() => {
    const open = accounts.filter(account => getStatus(account.outstanding, account.dueDate) === 'Open').length;
    const overdue = accounts.filter(account => getStatus(account.outstanding, account.dueDate) === 'Overdue').length;
    const totalOutstanding = accounts.reduce((acc, account) => acc + account.outstanding, 0);

    return { open, overdue, totalOutstanding };
  }, [accounts]);

  const updateOutstanding = (id: string, nextOutstanding: number) => {
    setAccounts(previous =>
      previous.map(account =>
        account.id === id
          ? {
              ...account,
              outstanding: roundCurrency(Math.max(nextOutstanding, 0)),
            }
          : account,
      ),
    );
  };

  const addEvent = (event: Omit<DebtEvent, 'id' | 'createdAt'>) => {
    setEvents(previous => [
      {
        id: `event-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...event,
      },
      ...previous,
    ]);
  };

  const applyPayment = () => {
    if (selectedAccount === null) {
      return;
    }

    const amount = parseNumber(paymentAmountText);
    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert('Invalid amount', 'Enter a valid payment amount in KES.');
      return;
    }

    if (selectedAccount.outstanding <= 0) {
      Alert.alert('Already cleared', 'This debt account is already fully cleared.');
      return;
    }

    const applied = Math.min(amount, selectedAccount.outstanding);
    const nextOutstanding = selectedAccount.outstanding - applied;

    updateOutstanding(selectedAccount.id, nextOutstanding);
    addEvent({
      debtId: selectedAccount.id,
      type: 'payment',
      amount: -applied,
      method: collectionMethod,
      note: `Debt payment received via ${collectionMethod === 'mpesa' ? 'M-Pesa' : 'cash'}`,
    });
    setPaymentAmountText('');

    Alert.alert('Payment recorded', `${formatMoney(applied)} applied to ${selectedAccount.customerName}.`);
  };

  const applyFullPayoff = () => {
    if (selectedAccount === null) {
      return;
    }

    if (selectedAccount.outstanding <= 0) {
      Alert.alert('Already cleared', 'This debt account is already fully cleared.');
      return;
    }

    const amount = selectedAccount.outstanding;

    updateOutstanding(selectedAccount.id, 0);
    addEvent({
      debtId: selectedAccount.id,
      type: 'payment',
      amount: -amount,
      method: collectionMethod,
      note: `Full payoff received via ${collectionMethod === 'mpesa' ? 'M-Pesa' : 'cash'}`,
    });

    Alert.alert('Debt cleared', `${selectedAccount.customerName} has fully paid ${formatMoney(amount)}.`);
  };

  const applyAdjustment = () => {
    if (selectedAccount === null) {
      return;
    }

    const amount = parseNumber(adjustmentAmountText);
    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert('Invalid reduction', 'Enter a valid reduction amount in KES.');
      return;
    }

    if (adjustmentReasonText.trim().length < 4) {
      Alert.alert('Reason required', 'Add a clear reason for this debt reduction.');
      return;
    }

    if (amount > selectedAccount.outstanding) {
      Alert.alert('Amount too high', 'Reduction cannot exceed the current outstanding balance.');
      return;
    }

    updateOutstanding(selectedAccount.id, selectedAccount.outstanding - amount);
    addEvent({
      debtId: selectedAccount.id,
      type: 'adjustment',
      amount: -amount,
      note: adjustmentReasonText.trim(),
    });
    setAdjustmentAmountText('');
    setAdjustmentReasonText('');

    Alert.alert('Reduction applied', `${formatMoney(amount)} has been reduced from this debt.`);
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.overline}>Debt Management</Text>
        <Text style={styles.title}>Outstanding Balance</Text>
        <Text style={styles.total}>{formatMoney(totals.totalOutstanding)}</Text>
        <Text style={styles.subtitle}>
          {totals.open} open • {totals.overdue} overdue
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>How Debt Starts</Text>
        <Text style={styles.helperText}>
          Debt records start from a sale marked as Debt in the sale entry flow.
        </Text>
        <Pressable style={styles.linkButton} onPress={() => router.push('/sale-entry')}>
          <Text style={styles.linkButtonText}>Record Debt Sale</Text>
        </Pressable>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Debt Accounts</Text>
        <View style={styles.filterRow}>
          {filterOrder.map(filter => (
            <Pressable
              key={filter}
              style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter)}>
              <Text style={[styles.filterChipText, activeFilter === filter && styles.filterChipTextActive]}>
                {filterLabels[filter]}
              </Text>
            </Pressable>
          ))}
        </View>

        {filteredAccounts.length === 0 ? (
          <Text style={styles.emptyText}>No debt accounts for this filter.</Text>
        ) : (
          filteredAccounts.map(account => {
            const status = accountStatusMap[account.id];
            return (
              <Pressable
                key={account.id}
                style={[styles.accountRow, selectedAccount?.id === account.id && styles.accountRowActive]}
                onPress={() => setSelectedDebtId(account.id)}>
                <View style={styles.accountMain}>
                  <Text style={styles.customerName}>{account.customerName}</Text>
                  <Text style={styles.accountMeta}>
                    {account.phone} • Due {formatDate(account.dueDate)}
                  </Text>
                </View>
                <View style={styles.accountAside}>
                  <Text style={styles.amountValue}>{formatMoney(account.outstanding)}</Text>
                  <Text
                    style={[
                      styles.statusText,
                      status === 'Overdue' && styles.statusOverdue,
                      status === 'Cleared' && styles.statusCleared,
                    ]}>
                    {status}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
      </View>

      {selectedAccount !== null && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Manage Selected Debt</Text>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryName}>{selectedAccount.customerName}</Text>
            <Text style={styles.summaryMeta}>Phone: {selectedAccount.phone}</Text>
            <Text style={styles.summaryMeta}>Due date: {formatDate(selectedAccount.dueDate)}</Text>
            <Text style={styles.summaryValue}>
              Outstanding: {formatMoney(selectedAccount.outstanding)}
            </Text>
            <Text
              style={[
                styles.statusText,
                selectedStatus === 'Overdue' && styles.statusOverdue,
                selectedStatus === 'Cleared' && styles.statusCleared,
              ]}>
              {selectedStatus}
            </Text>
          </View>

          <Text style={styles.subHeading}>Record Payment</Text>
          <TextInput
            value={paymentAmountText}
            onChangeText={setPaymentAmountText}
            keyboardType="decimal-pad"
            placeholder="Payment amount in KES"
            placeholderTextColor="#86A092"
            style={styles.input}
          />
          <View style={styles.filterRow}>
            <Pressable
              style={[styles.filterChip, collectionMethod === 'cash' && styles.filterChipActive]}
              onPress={() => setCollectionMethod('cash')}>
              <Text style={[styles.filterChipText, collectionMethod === 'cash' && styles.filterChipTextActive]}>
                Cash
              </Text>
            </Pressable>
            <Pressable
              style={[styles.filterChip, collectionMethod === 'mpesa' && styles.filterChipActive]}
              onPress={() => setCollectionMethod('mpesa')}>
              <Text style={[styles.filterChipText, collectionMethod === 'mpesa' && styles.filterChipTextActive]}>
                M-Pesa
              </Text>
            </Pressable>
          </View>
          <View style={styles.actionRow}>
            <Pressable style={styles.primaryButton} onPress={applyPayment}>
              <Text style={styles.primaryButtonText}>Apply Payment</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={applyFullPayoff}>
              <Text style={styles.secondaryButtonText}>Pay Off Full</Text>
            </Pressable>
          </View>

          <Text style={styles.subHeading}>Reduce Debt</Text>
          <TextInput
            value={adjustmentAmountText}
            onChangeText={setAdjustmentAmountText}
            keyboardType="decimal-pad"
            placeholder="Reduction amount in KES"
            placeholderTextColor="#86A092"
            style={styles.input}
          />
          <TextInput
            value={adjustmentReasonText}
            onChangeText={setAdjustmentReasonText}
            placeholder="Reason for reduction (e.g. pricing correction)"
            placeholderTextColor="#86A092"
            style={styles.input}
          />
          <Pressable style={styles.warningButton} onPress={applyAdjustment}>
            <Text style={styles.warningButtonText}>Apply Reduction</Text>
          </Pressable>
        </View>
      )}

      {selectedAccount !== null && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Debt History</Text>
          {selectedHistory.length === 0 ? (
            <Text style={styles.emptyText}>No events recorded for this debt yet.</Text>
          ) : (
            selectedHistory.map(event => (
              <View key={event.id} style={styles.historyRow}>
                <View style={styles.historyMain}>
                  <Text style={styles.historyTitle}>{eventLabel[event.type]}</Text>
                  <Text style={styles.historyMeta}>{event.note}</Text>
                  <Text style={styles.historyMeta}>
                    {formatDateTime(event.createdAt)}
                    {event.method ? ` • ${event.method === 'mpesa' ? 'M-Pesa' : 'Cash'}` : ''}
                  </Text>
                </View>
                <Text style={[styles.historyAmount, event.amount < 0 && styles.historyAmountNegative]}>
                  {event.amount < 0 ? '-' : '+'}
                  {formatMoney(Math.abs(event.amount))}
                </Text>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#ECF4EF',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
  heroCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D9E4DB',
    backgroundColor: '#F8FCF9',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  overline: {
    color: '#4D6D5E',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    marginTop: 6,
    color: '#113726',
    fontSize: 21,
    fontWeight: '800',
  },
  total: {
    marginTop: 4,
    color: '#7D4D00',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 4,
    color: '#6B7A71',
    fontSize: 12.5,
    fontWeight: '600',
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
    color: '#4E695C',
    fontSize: 12.5,
    lineHeight: 17,
  },
  linkButton: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBE1D4',
    backgroundColor: '#F0F8F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  linkButtonText: {
    color: '#1D5E3E',
    fontSize: 12.5,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#CBDBD1',
    backgroundColor: '#F8FCFA',
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  filterChipActive: {
    borderColor: '#1F7A4C',
    backgroundColor: '#E7F5EC',
  },
  filterChipText: {
    color: '#395C4C',
    fontSize: 12,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: '#19563A',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    backgroundColor: '#FCFDFC',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
  },
  accountRowActive: {
    borderColor: '#2A8856',
    backgroundColor: '#F4FBF7',
  },
  accountMain: {
    flex: 1,
  },
  accountAside: {
    alignItems: 'flex-end',
  },
  customerName: {
    color: '#163426',
    fontSize: 14,
    fontWeight: '700',
  },
  accountMeta: {
    marginTop: 2,
    color: '#607567',
    fontSize: 12,
  },
  amountValue: {
    color: '#173B2A',
    fontSize: 13.5,
    fontWeight: '800',
  },
  statusText: {
    marginTop: 2,
    color: '#1D6D42',
    fontSize: 11.5,
    fontWeight: '700',
  },
  statusOverdue: {
    color: '#8A2B1E',
  },
  statusCleared: {
    color: '#3C4D43',
  },
  summaryBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    backgroundColor: '#F8FCFA',
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 4,
  },
  summaryName: {
    color: '#163C2B',
    fontSize: 14.5,
    fontWeight: '800',
  },
  summaryMeta: {
    color: '#567061',
    fontSize: 12,
  },
  summaryValue: {
    marginTop: 1,
    color: '#17412F',
    fontSize: 13,
    fontWeight: '700',
  },
  subHeading: {
    marginTop: 4,
    color: '#204634',
    fontSize: 13,
    fontWeight: '800',
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C9DCD0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#143A29',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#1F7A4C',
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B9D7C5',
    backgroundColor: '#F3FAF6',
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#1C5A3C',
    fontSize: 13,
    fontWeight: '800',
  },
  warningButton: {
    borderRadius: 10,
    backgroundColor: '#7D4D00',
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    backgroundColor: '#FBFDFC',
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 8,
  },
  historyMain: {
    flex: 1,
  },
  historyTitle: {
    color: '#173527',
    fontSize: 13.5,
    fontWeight: '700',
  },
  historyMeta: {
    marginTop: 1,
    color: '#607567',
    fontSize: 12,
  },
  historyAmount: {
    color: '#1F5D3C',
    fontSize: 13,
    fontWeight: '800',
  },
  historyAmountNegative: {
    color: '#8A2B1E',
  },
  emptyText: {
    color: '#607567',
    fontSize: 12.5,
  },
});
