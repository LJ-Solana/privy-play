import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ActivityScreen() {
  const transactions = [
    { id: 1, type: 'Sent', amount: '100 XRP', recipient: 'Alice', date: '2023-05-01', status: 'Completed' },
    { id: 2, type: 'Received', amount: '50 XRP', sender: 'Bob', date: '2023-04-28', status: 'Completed' },
    { id: 3, type: 'Swapped', amount: '200 XRP', to: '0.5 ETH', date: '2023-04-25', status: 'Completed' },
    { id: 4, type: 'Sent', amount: '75 XRP', recipient: 'Charlie', date: '2023-04-20', status: 'Pending' },
  ];

  const getTransactionIcon = (type: string): string => {
    switch (type) {
      case 'Sent':
        return 'arrow-up-outline';
      case 'Received':
        return 'arrow-down-outline';
      case 'Swapped':
        return 'swap-horizontal-outline';
      default:
        return 'ellipsis-horizontal-outline';
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    return 0;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Activity</Text>
        </View>
        <ScrollView style={styles.content}>
          {sortedTransactions.map((transaction) => (
            <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons name={getTransactionIcon(transaction.type) as keyof typeof Ionicons.glyphMap} size={24} color="#BB86FC" />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionType}>{transaction.type}</Text>
                <Text style={styles.transactionAmount}>{transaction.amount}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <View style={styles.transactionStatus}>
                <Text style={[
                  styles.statusText,
                  { color: transaction.status === 'Completed' ? '#03DAC6' : '#FF7597' }
                ]}>
                  {transaction.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BB86FC',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  transactionIcon: {
    backgroundColor: '#2C2C2C',
    borderRadius: 20,
    padding: 8,
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  transactionAmount: {
    fontSize: 14,
    color: '#BB86FC',
    marginTop: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  transactionStatus: {
    marginLeft: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
