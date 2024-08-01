import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';

const { width } = Dimensions.get('window');

export default function TokenSwapScreen() {
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDT');
  const [amount, setAmount] = useState('');

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', icon: 'logo-ethereum', color: '#627EEA' },
    { symbol: 'BTC', name: 'Bitcoin', icon: 'logo-bitcoin', color: '#F7931A' },
    { symbol: 'USDT', name: 'Tether', icon: 'logo-usd', color: '#26A17B' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a237e', '#3949ab']}
          style={styles.header}
        >
          <ThemedText style={styles.title}>Asset Swap</ThemedText>
          <View style={styles.statsContainer}>
            <Ionicons name="trending-up-outline" size={20} color="#ffffff" />
            <ThemedText style={styles.statsText}>Market is up 0.5%</ThemedText>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content}>
          <View style={styles.swapContainer}>
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>From</ThemedText>
              <View style={styles.tokenInput}>
                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder="0.0"
                  placeholderTextColor="#757575"
                />
                <TouchableOpacity style={styles.tokenSelector}>
                  <ThemedText style={styles.tokenText}>{fromToken}</ThemedText>
                  <Ionicons name="chevron-down" size={24} color="#3949ab" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.swapButton}>
              <Ionicons name="swap-vertical" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>To</ThemedText>
              <View style={styles.tokenInput}>
                <ThemedText style={styles.input}>0.0</ThemedText>
                <TouchableOpacity style={styles.tokenSelector}>
                  <ThemedText style={styles.tokenText}>{toToken}</ThemedText>
                  <Ionicons name="chevron-down" size={24} color="#3949ab" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.swapActionButton}>
            <LinearGradient
              colors={['#3949ab', '#5c6bc0']}
              style={styles.swapActionGradient}
            >
              <ThemedText style={styles.swapActionButtonText}>Swap Tokens</ThemedText>
            </LinearGradient>
          </TouchableOpacity>

          <ThemedText style={styles.recentSwapsTitle}>Recent Swaps</ThemedText>
          {tokens.map((token, index) => (
            <View key={index} style={styles.recentSwapItem}>
              <View style={[styles.tokenIconContainer, { backgroundColor: token.color }]}>
                {/* <Ionicons name={token.icon} size={20} color="#fff" /> */}
              </View>
              <View style={styles.swapItemContent}>
                <ThemedText style={styles.swapItemTitle}>{token.name}</ThemedText>
                <ThemedText style={styles.swapItemSubtitle}>1 {token.symbol} = 1,234.56 USD</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#3949ab" />
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
    backgroundColor: '#1a237e',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    marginLeft: 5,
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  swapContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#212121',
  },
  tokenInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 18,
    color: '#212121',
  },
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  tokenText: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 5,
    color: '#212121',
  },
  swapButton: {
    alignSelf: 'center',
    backgroundColor: '#3949ab',
    borderRadius: 20,
    padding: 10,
    marginVertical: 10,
  },
  swapActionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  swapActionGradient: {
    padding: 15,
    alignItems: 'center',
  },
  swapActionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  recentSwapsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#212121',
  },
  recentSwapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tokenIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  swapItemContent: {
    flex: 1,
  },
  swapItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  swapItemSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
});