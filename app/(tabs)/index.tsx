import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Dimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { HelloWave } from '@/components/HelloWave';

const { width } = Dimensions.get('window');
const buttonWidth = (width - 48) / 3 - 8;
const buttonHeight = 80;

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={['#1a237e', '#3949ab']}
          style={styles.header}
        >
          <ThemedText style={styles.greeting}>Welcome, LJ<HelloWave /></ThemedText>
          <TouchableOpacity style={styles.notificationIcon}>
            <Ionicons name="notifications-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </LinearGradient>
        
        <View style={styles.balanceCard}>
          <ThemedText style={styles.balanceLabel}>Total Balance</ThemedText>
          <ThemedText style={styles.balanceAmount}>$12,345.67</ThemedText>
          <View style={styles.balanceChangeContainer}>
            <Ionicons name="arrow-up" size={16} color="#4CAF50" />
            <ThemedText style={styles.balanceChange}>2.5% today</ThemedText>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          {['Send', 'Receive', 'Swap'].map((action, index) => (
            <TouchableOpacity key={action} style={styles.actionButton}>
              <LinearGradient
                colors={['#3949ab', '#5c6bc0']}
                style={styles.actionGradient}
              >
                <Ionicons 
                  name={index === 0 ? "arrow-up-outline" : index === 1 ? "arrow-down-outline" : "swap-horizontal-outline"} 
                  size={24} 
                  color="#fff" 
                />
                <ThemedText style={styles.actionText}>{action}</ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.assetsContainer}>
          <ThemedText style={styles.assetsTitle}>Your Assets</ThemedText>
          {[
            { name: 'Bitcoin', icon: 'logo-bitcoin', color: '#F7931A', balance: '0.5 BTC', value: '$15,000' },
            { name: 'Twitter', icon: 'logo-twitter', color: '#1DA1F2', balance: '2.5 Shares', value: '$5,000' },
            { name: 'Tether', icon: 'ellipse', color: '#26A17B', balance: '1000 USDT', value: '$1,000' },
          ].map((asset, index) => (
            <View key={asset.name} style={[styles.assetItem, index === 2 && styles.lastAssetItem]}>
              <View style={[styles.assetIcon, { backgroundColor: asset.color }]}>
                <Ionicons name={asset.icon as any} size={20} color="#fff" />
              </View>
              <ThemedText style={styles.assetName}>{asset.name}</ThemedText>
              <ThemedText style={styles.assetBalance}>{asset.balance}</ThemedText>
              <ThemedText style={styles.assetValue}>{asset.value}</ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 64,
    paddingBottom: 48, 
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  notificationIcon: {
    padding: 8,
  },
  balanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: -16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  balanceChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceChange: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 24,
  },
  actionButton: {
    width: buttonWidth,
    height: buttonHeight,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  assetsContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  assetsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#212121',
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  lastAssetItem: {
    borderBottomWidth: 0,
  },
  assetIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assetName: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },
  assetBalance: {
    fontSize: 14,
    color: '#757575',
    marginRight: 8,
  },
  assetValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
});