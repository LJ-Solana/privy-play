import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ActivityScreen() {
  const transactions = [
    { id: 1, type: 'Sent', amount: '100 XRP', recipient: 'Alice', date: '2023-05-01', status: 'Completed' },
    { id: 2, type: 'Received', amount: '50 XRP', sender: 'Bob', date: '2023-04-28', status: 'Completed' },
    { id: 3, type: 'Swapped', amount: '200 XRP', to: '0.5 ETH', date: '2023-04-25', status: 'Completed' },
    { id: 4, type: 'Sent', amount: '75 XRP', recipient: 'Charlie', date: '2023-04-20', status: 'Pending' },
  ];

  const getTransactionIcon = (type) => {
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
        <LinearGradient
          colors={['#1a237e', '#3949ab']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Activity</Text>
        </LinearGradient>
        <ScrollView style={styles.content}>
          {sortedTransactions.map((transaction) => (
            <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons name={getTransactionIcon(transaction.type)} size={24} color="#3949ab" />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionType}>{transaction.type}</Text>
                <Text style={styles.transactionAmount}>{transaction.amount}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <View style={styles.transactionStatus}>
                <Text style={[
                  styles.statusText,
                  { color: transaction.status === 'Completed' ? '#4CAF50' : '#FFC107' }
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
    backgroundColor: '#1a237e',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionIcon: {
    backgroundColor: '#E8EAF6',
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
    color: '#212121',
  },
  transactionAmount: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9E9E9E',
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
