import { StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width } = Dimensions.get('window');
const buttonWidth = (width - 80) / 3; // Reduced the width by increasing the total padding

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.greeting}>Welcome, LJ!</ThemedText>
          <TouchableOpacity style={styles.notificationIcon}>
            <Ionicons name="notifications-outline" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.balanceContainer}>
          <ThemedText style={styles.balanceLabel}>Total Balance</ThemedText>
          <ThemedText style={styles.balanceAmount}>$12,345.67</ThemedText>
          <ThemedText style={styles.balanceChange}>+2.5% today</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="arrow-up-outline" size={20} color="#fff" />
            <ThemedText style={styles.actionText}>Send</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="arrow-down-outline" size={20} color="#fff" />
            <ThemedText style={styles.actionText}>Receive</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="swap-horizontal-outline" size={20} color="#fff" />
            <ThemedText style={styles.actionText}>Swap</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.assetsContainer}>
          <ThemedText style={styles.assetsTitle}>Your Assets</ThemedText>
          <ThemedView style={styles.assetItem}>
            <Ionicons name="logo-bitcoin" size={24} color="#F7931A" />
            <ThemedText style={styles.assetName}>Bitcoin</ThemedText>
            <ThemedText style={styles.assetBalance}>0.5 BTC</ThemedText>
            <ThemedText style={styles.assetValue}>$15,000</ThemedText>
          </ThemedView>
          <ThemedView style={styles.assetItem}>
            <Ionicons name="logo-twitter" size={24} color="#3C3C3D" />
            <ThemedText style={styles.assetName}>Twitter</ThemedText>
            <ThemedText style={styles.assetBalance}>2.5 Shares</ThemedText>
            <ThemedText style={styles.assetValue}>$5,000</ThemedText>
          </ThemedView>
          <ThemedView style={styles.assetItem}>
            <Ionicons name="ellipse" size={24} color="#26A17B" />
            <ThemedText style={styles.assetName}>Tether</ThemedText>
            <ThemedText style={styles.assetBalance}>1000 USDT</ThemedText>
            <ThemedText style={styles.assetValue}>$1,000</ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
  },
  notificationIcon: {
    padding: 8,
    marginTop: 24,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 10,
    minHeight: 60, 
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 4, 
  },
  balanceAmount: {
    fontSize: 32, 
    fontWeight: 'bold',
    marginVertical: 4, 
    textAlign: 'center',
  },
  balanceChange: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#4A90E2',
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    width: buttonWidth,
    height: buttonWidth * 0.8, // Reduced height to 80% of the width
    justifyContent: 'center',
  },
  actionText: {
    color: '#fff',
    marginTop: 4,
    fontSize: 12, // Reduced font size to fit smaller buttons
  },
  assetsContainer: {
    marginBottom: 24,
  },
  assetsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  assetName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  assetBalance: {
    fontSize: 16,
    marginRight: 8,
  },
  assetValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
