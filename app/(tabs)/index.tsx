import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Dimensions, View, Modal, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { HelloWave } from '@/components/HelloWave';

const { width } = Dimensions.get('window');
const buttonWidth = (width - 48) / 3 - 8;
const buttonHeight = 80;

export default function HomeScreen() {
  const [showQRModal, setShowQRModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [slideAnim] = useState(new Animated.Value(width));

  const handleReceivePress = () => {
    setShowQRModal(true);
  };

  const handleNotificationsPress = () => {
    setShowNotifications(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeNotifications = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowNotifications(false));
  };

  const notifications = [
    { id: 1, title: 'New Transaction', message: 'You received 0.1 BTC', time: '2 hours ago', icon: 'cash-outline' },
    { id: 2, title: 'Price Alert', message: 'ETH is up 5% in the last 24 hours', time: '5 hours ago', icon: 'trending-up-outline' },
    { id: 3, title: 'Security Update', message: 'Enable two-factor authentication for enhanced security', time: '1 day ago', icon: 'shield-checkmark-outline' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={['#1a237e', '#3949ab']}
          style={styles.header}
        >
          <ThemedText style={styles.greeting}>Welcome, LJ<HelloWave /></ThemedText>
          <TouchableOpacity style={styles.notificationIcon} onPress={handleNotificationsPress}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
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
          {['Buy', 'Receive', 'Swap'].map((action, index) => (
            <TouchableOpacity key={action} style={styles.actionButton} onPress={index === 1 ? handleReceivePress : undefined}>
              <LinearGradient
                colors={['#3949ab', '#5c6bc0']}
                style={styles.actionGradient}
              >
                <Ionicons 
                  name={index === 0 ? "cart-outline" : index === 1 ? "arrow-down-outline" : "swap-horizontal-outline"} 
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

        <Modal visible={showQRModal} animationType="slide">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#f0f0f0', padding: 16, borderRadius: 8 }}>
              <Image source={{ uri: 'https://placeholder.com/200x200' }} style={{ width: 200, height: 200 }} />
            </View>
            <ThemedText style={{ marginTop: 16, fontWeight: 'bold' }}>Receive Funds</ThemedText>
            <TouchableOpacity onPress={() => setShowQRModal(false)} style={{ position: 'absolute', top: 8, right: 0, padding: 16 }}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal visible={showNotifications} transparent={true} animationType="none">
          <TouchableOpacity style={styles.modalOverlay} onPress={closeNotifications} activeOpacity={1}>
            <Animated.View 
              style={[
                styles.notificationsContainer,
                { transform: [{ translateX: slideAnim }] }
              ]}
            >
              <ThemedText style={styles.notificationsTitle}>Notifications</ThemedText>
              <ScrollView>
                {notifications.map((notification) => (
                  <View key={notification.id} style={styles.notificationItem}>
                    <View style={styles.notificationIcon}>
                      <Ionicons name={notification.icon as keyof typeof Ionicons.glyphMap} size={24} color="#3949ab" />
                    </View>
                    <View style={styles.notificationContent}>
                      <ThemedText style={styles.notificationTitle}>{notification.title}</ThemedText>
                      <ThemedText style={styles.notificationMessage}>{notification.message}</ThemedText>
                      <ThemedText style={styles.notificationTime}>{notification.time}</ThemedText>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={closeNotifications} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
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
    paddingTop: 36,
    paddingBottom: 36, 
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  notificationsContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 40,
  },
  notificationsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 28,
    right: 0,
    padding: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
  },
});