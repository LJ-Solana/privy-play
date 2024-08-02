import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';

export default function TokenSwapScreen() {
  const [fromToken, setFromToken] = useState({ symbol: 'XRP', name: 'XRP', balance: '0.06027' });
  const [toToken, setToToken] = useState({ symbol: 'USDC', name: 'USD Coin', balance: '0.00' });
  const [amount, setAmount] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Swap Tokens</Text>
          <Text style={styles.marketTrend}>⚡ 0.5%</Text>
        </View>
        
        <View style={styles.swapContainer}>
          <View style={styles.tokenInput}>
            <View style={styles.tokenInfo}>
              <Ionicons name="logo-usd" size={32} color="#ffffff" style={styles.tokenIcon} />
              <View>
                <Text style={styles.tokenName}>{fromToken.name}</Text>
                <Text style={styles.tokenBalance}>Balance: {fromToken.balance} {fromToken.symbol}</Text>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#888"
              />
              <TouchableOpacity style={styles.maxButton}>
                <Text style={styles.maxButtonText}>Max</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity style={styles.swapButton}>
            <Ionicons name="arrow-down-circle" size={40} color="#BB86FC" />
          </TouchableOpacity>
          
          <View style={styles.tokenInput}>
            <View style={styles.tokenInfo}>
              <Ionicons name="logo-usd" size={32} color="#ffffff" style={styles.tokenIcon} />
              <View>
                <Text style={styles.tokenName}>{toToken.name}</Text>
                <Text style={styles.tokenBalance}>USDC on Solana</Text>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.input}>0</Text>
              <Text style={styles.usdValue}>$0.00</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.swapActionButton}>
          <Text style={styles.swapActionButtonText}>Swap</Text>
        </TouchableOpacity>
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  marketTrend: {
    fontSize: 14,
    color: '#BB86FC',
  },
  swapContainer: {
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  tokenInput: {
    marginBottom: 16,
  },
  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tokenIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tokenBalance: {
    fontSize: 12,
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
    padding: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    color: '#ffffff',
  },
  maxButton: {
    backgroundColor: '#3a3a3c',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  maxButtonText: {
    fontSize: 12,
    color: '#BB86FC',
  },
  usdValue: {
    fontSize: 16,
    color: '#888',
  },
  swapButton: {
    alignSelf: 'center',
    marginVertical: 16,
  },
  swapActionButton: {
    backgroundColor: '#BB86FC',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  swapActionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
});