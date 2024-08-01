import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ActivityScreen() {
  const transactions = [
    { id: 1, type: 'Swapped', amount: '+30,973.89986 USDC', secondaryAmount: '-174.60275 SOL', platform: 'Jupiter', date: 'Yesterday' },
    { id: 2, type: 'Swapped', amount: '+164.7055 SOL', secondaryAmount: '-30,000.03266 PYUSD', platform: 'Jupiter', date: 'Yesterday' },
    { id: 3, type: 'Sent', amount: '-125.92M MUMU', recipient: 'LJ Hot (LJ2X...Vnqq)', date: 'Yesterday' },
    { id: 4, type: 'Swapped', amount: '+325.92M MUMU', secondaryAmount: '-30,000.03266 PYUSD', platform: 'Jupiter', date: 'Yesterday' },
    { id: 5, type: 'Received', amount: '+< 0.00001 SOL', sender: '2RMY...Vnqq', date: 'Yesterday' },
    { id: 6, type: 'Received', amount: '+9.8 SOL', sender: 'LJ Hot (LJ2X...Vnqq)', date: 'Yesterday' },
    { id: 7, type: 'Received', amount: '+< 0.00001 SOL', sender: 'Habp...4E96', date: 'Yesterday' },
    { id: 8, type: 'Received', amount: '+< 0.00001 SOL', sender: 'FLiP...eaZ7', date: 'Yesterday' },
    { id: 9, type: 'Sent', amount: '-2.119 PYUSD', recipient: 'Unknown', date: 'Yesterday' },
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.dateHeader}>Yesterday</Text>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIconContainer}>
                <Ionicons name={getTransactionIcon(transaction.type)} size={24} color="#fff" />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionType}>{transaction.type}</Text>
                {transaction.platform && <Text style={styles.transactionPlatform}>{transaction.platform}</Text>}
                {transaction.recipient && <Text style={styles.transactionRecipient}>To {transaction.recipient}</Text>}
                {transaction.sender && <Text style={styles.transactionSender}>From {transaction.sender}</Text>}
              </View>
              <View style={styles.transactionAmounts}>
                <Text style={[styles.transactionAmount, { color: transaction.amount.startsWith('+') ? '#4CAF50' : '#fff' }]}>
                  {transaction.amount}
                </Text>
                {transaction.secondaryAmount && (
                  <Text style={styles.transactionSecondaryAmount}>{transaction.secondaryAmount}</Text>
                )}
              </View>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  transactionIconContainer: {
    backgroundColor: '#3a3a3c',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  transactionPlatform: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  transactionRecipient: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  transactionSender: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  transactionAmounts: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  transactionSecondaryAmount: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
});