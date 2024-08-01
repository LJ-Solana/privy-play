import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, SafeAreaView, Text, ActivityIndicator, RefreshControl, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const XRPL_API_ENDPOINT = 'https://xrplcluster.com/';
const XRP_WALLET_ADDRESS = 'rPjYcrLKwUXb6STyqfK5J1XcTZBA4HLYLf';

export default function ActivityScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching transactions...');
      const response = await axios.post(XRPL_API_ENDPOINT, {
        method: 'account_tx',
        params: [{
          account: XRP_WALLET_ADDRESS,
          limit: 20
        }]
      });
  
      console.log('Response received:', JSON.stringify(response.data, null, 2));
  
      if (response.data.result.status !== 'success') {
        throw new Error(`API returned non-success status: ${response.data.result.status}`);
      }
  
      if (!response.data.result.transactions || !Array.isArray(response.data.result.transactions)) {
        throw new Error('Invalid or missing transactions in API response');
      }
  
      const processedTransactions = response.data.result.transactions.map(processTransaction);
      setTransactions(processedTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error('Error response:', err.response.data);
          console.error('Error status:', err.response.status);
          console.error('Error headers:', err.response.headers);
          setError(`Failed to fetch transactions. Server responded with status ${err.response.status}.`);
        } else if (err.request) {
          console.error('Error request:', err.request);
          setError('Failed to fetch transactions. No response received from server.');
        } else {
          console.error('Error message:', err.message);
          setError(`Failed to fetch transactions: ${err.message}`);
        }
      } else {
        console.error('Error message:', err instanceof Error ? err.message : String(err));
        setError(`Failed to fetch transactions: ${err instanceof Error ? err.message : String(err)}`);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const processTransaction = (tx) => {
    const transaction = tx.tx;
    let type, amount, currency, recipient, sender, details;

    const rippleEpoch = new Date('2000-01-01T00:00:00Z').getTime() / 1000;
    const transactionDate = new Date((rippleEpoch + transaction.date) * 1000);

    switch (transaction.TransactionType) {
      case 'Payment':
        type = transaction.Account === XRP_WALLET_ADDRESS ? 'Sent' : 'Received';
        if (typeof transaction.Amount === 'object') {
          amount = parseFloat(transaction.Amount.value).toFixed(2);
          currency = transaction.Amount.currency;
        } else {
          amount = (parseFloat(transaction.Amount) / 1000000).toFixed(2);
          currency = 'XRP';
        }
        amount = type === 'Sent' ? `-${amount}` : `+${amount}`;
        recipient = transaction.Destination;
        sender = transaction.Account;
        break;
      case 'TrustSet':
        type = 'Trust Line Set';
        amount = parseFloat(transaction.LimitAmount.value).toFixed(2);
        currency = transaction.LimitAmount.currency;
        recipient = transaction.LimitAmount.issuer;
        break;
      // Add other cases as needed
      default:
        type = transaction.TransactionType;
        amount = '0.000000';
        currency = '';
    }

    return {
      id: transaction.hash,
      type,
      amount,
      currency,
      recipient,
      sender,
      details,
      date: transactionDate.toLocaleDateString(),
    };
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'Sent':
        return 'arrow-up-outline';
      case 'Received':
        return 'arrow-down-outline';
      case 'Trust Line Set':
        return 'link-outline';
      default:
        return 'ellipsis-horizontal-outline';
    }
  };

  const openTransactionInXRPScan = (txId) => {
    Linking.openURL(`https://xrpscan.com/tx/${txId}`);
  };

  const formatAmount = (amount, currency) => {
    const formattedAmount = parseFloat(amount).toExponential(2);
    return `${formattedAmount} ${currency}`;
  };

  const renderTransactionItem = (transaction) => (
    <TouchableOpacity 
      key={transaction.id} 
      style={styles.transactionItem}
      onPress={() => openTransactionInXRPScan(transaction.id)}
    >
      <View style={styles.transactionIconContainer}>
        <Ionicons name={getTransactionIcon(transaction.type)} size={24} color="#fff" />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionType}>{transaction.type}</Text>
        {transaction.recipient && (
          <Text style={styles.transactionDetails}>To: {transaction.recipient.substring(0, 8)}...</Text>
        )}
        {transaction.sender && transaction.sender !== XRP_WALLET_ADDRESS && (
          <Text style={styles.transactionDetails}>From: {transaction.sender.substring(0, 8)}...</Text>
        )}
      </View>
      <View style={styles.transactionAmounts}>
        <Text style={[styles.transactionAmount, { color: transaction.amount.startsWith('-') ? '#FF5252' : '#4CAF50' }]}>
          {formatAmount(transaction.amount.replace(/[+-]/, ''), transaction.currency)}
        </Text>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={fetchTransactions}>
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#BB86FC" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <ScrollView 
            style={styles.content}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {transactions.map(renderTransactionItem)}
          </ScrollView>
        )}
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
  transactionDetails: {
    fontSize: 14,
    color: '#888',
  },
  transactionAmounts: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  errorText: {
    color: '#FF5252',
    textAlign: 'center',
    marginTop: 20,
  },
});