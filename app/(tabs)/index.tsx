import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Dimensions, View, Modal, Image, Animated, SafeAreaView, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

interface XRPData {
  balance: number;
  price: number;
  currencies?: string[];
  trustLines?: any[]; 
}

const { width } = Dimensions.get('window');
const buttonWidth = (width - 48) / 3 - 8;
const buttonHeight = 80;

const XRPL_API_ENDPOINT = 'https://xrplcluster.com/';
const XRP_WALLET_ADDRESS = 'rPjYcrLKwUXb6STyqfK5J1XcTZBA4HLYLf';


export default function HomeScreen() {
  const [xrpData, setXrpData] = useState({ balance: 0, price: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showQRModal, setShowQRModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [slideAnim] = useState(new Animated.Value(width));

  useEffect(() => {
    let isMounted = true;
    const fetchXRPData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        // Fetch account info (including XRP balance)
        const balanceResponse = await axios.post(XRPL_API_ENDPOINT, {
          method: 'account_info',
          params: [
            {
              account: XRP_WALLET_ADDRESS,
              strict: true,
              ledger_index: 'current',
              queue: true
            }
          ]
        });
        
        const balance = parseFloat(balanceResponse.data.result.account_data.Balance) / 1000000;
  
        // Fetch account currencies
        const currenciesResponse = await axios.post(XRPL_API_ENDPOINT, {
          method: 'account_currencies',
          params: [
            {
              account: XRP_WALLET_ADDRESS,
              strict: true,
              ledger_index: 'current'
            }
          ]
        });
  
        const currencies = currenciesResponse.data.result.receive_currencies;
  
        // Fetch account lines (trust lines and their balances)
        const linesResponse = await axios.post(XRPL_API_ENDPOINT, {
          method: 'account_lines',
          params: [
            {
              account: XRP_WALLET_ADDRESS,
              ledger_index: 'current'
            }
          ]
        });
  
        const trustLines = linesResponse.data.result.lines;
  
        // Fetch XRP price
        const priceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd');
        const price = priceResponse.data.ripple.usd;
  
        if (isMounted) {
          setXrpData({
            balance,
            price,
            currencies,
            trustLines
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching XRP data:', err);
        if (isMounted) {
          setError('Failed to fetch XRP data. Please try again later.');
          setLoading(false);
        }
      }
    };
  
    fetchXRPData();
  
    return () => {
      isMounted = false;
    };
  }, []);
  
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
              <Text style={styles.greeting}>Welcome, LJ</Text>
            <TouchableOpacity onPress={handleNotificationsPress}>
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF"/>
            </TouchableOpacity>
          </View>
          
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Account Balance</Text>
            <Text style={styles.balanceAmount}>${(xrpData.balance * xrpData.price).toFixed(2)}</Text>
            <View style={styles.balancePriceContainer}>
              <Text style={styles.balancePrice}>{xrpData.balance.toFixed(2)} XRP </Text>
            </View>
          </View>
          <View style={styles.actionsContainer}>
            {['Buy', 'Receive', 'Swap'].map((action, index) => (
              <TouchableOpacity key={action} style={styles.actionButton} onPress={index === 1 ? handleReceivePress : undefined}>
                <View style={styles.actionContent}>
                  <Ionicons 
                    name={index === 0 ? "cart-outline" : index === 1 ? "arrow-down-outline" : "swap-horizontal-outline"} 
                    size={24} 
                    color="#fff" 
                  />
                  <Text style={styles.actionText}>{action}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.assetsContainer}>
            <Text style={styles.assetsTitle}>Your Assets</Text>
            {xrpData.trustLines && xrpData.trustLines.length > 0 ? (
              [
                { currency: 'XRP', balance: xrpData.balance, price: xrpData.price, isTrustline: false },
                ...(xrpData.trustLines || []).map((line) => ({
                  currency: line.currency,
                  balance: line.balance,
                  price: line.price,
                  isTrustline: true
                }))
              ].map((asset, index, array) => (
                <View key={asset.currency} style={[styles.assetItem, index === array.length - 1 && styles.lastAssetItem]}>
                  <View style={[styles.assetIcon, { backgroundColor: asset.currency === 'XRP' ? '#3700B3' : '#6200EE' }]}>
                    <Ionicons name={asset.currency === 'XRP' ? "logo-bitcoin" : "cash-outline"} size={20} color="#fff" />
                  </View>
                  <View style={styles.assetInfo}>
                    <Text style={styles.assetName}>
                      {asset.currency.length > 8 ? `${asset.currency.slice(0, 8)}...` : asset.currency}
                    </Text>
                    {asset.isTrustline && (
                      <Text style={styles.trustlineIndicator}>Trustline</Text>
                    )}
                  </View>
                  <View style={styles.assetValues}>
                    <Text style={styles.assetBalance}>
                      {parseFloat(asset.balance).toFixed(2)}
                    </Text>
                    <Text style={styles.assetValue}>
                      {asset.currency === 'XRP' 
                        ? `$${(parseFloat(asset.balance) * asset.price).toFixed(2)}`
                        : 'N/A'}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No assets available</Text>
            )}
          </View>
       
          <Modal visible={showQRModal} animationType="slide">
            <View style={styles.qrModalContainer}>
              <View style={styles.qrModalContent}>
                <Image source={{ uri: 'https://placeholder.com/200x200' }} style={styles.qrImage} />
                <Text style={styles.qrModalTitle}>Receive Funds</Text>
                <TouchableOpacity onPress={() => setShowQRModal(false)} style={styles.qrModalCloseButton}>
                  <Ionicons name="close" size={24} color="#BB86FC" />
                </TouchableOpacity>
              </View>
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
                <View style={styles.notificationsHeader}>
                  <Text style={styles.notificationsTitle}>Notifications</Text>
                  <TouchableOpacity onPress={closeNotifications} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#BB86FC" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView contentContainerStyle={styles.notificationsContent}>
                  {notifications.map((notification) => (
                    <View key={notification.id} style={styles.notificationItem}>
                      <View style={styles.notificationIcon}>
                        <Ionicons name={notification.icon as keyof typeof Ionicons.glyphMap} size={24} color="#BB86FC" />
                      </View>
                      <View style={styles.notificationContent}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        <Text style={styles.notificationMessage}>{notification.message}</Text>
                        <Text style={styles.notificationTime}>{notification.time}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </Animated.View>
            </TouchableOpacity>
          </Modal>
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
  scrollContent: {
    paddingBottom: 24,
  },
  noDataText: {
    fontSize: 16,
    color: '#BB86FC',
    textAlign: 'center',
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36, 
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    alignItems: 'center'
  },
  notificationIcon: {
    padding: 8,
  },
  balanceCard: {
    backgroundColor: '#1E1E1E',
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
    color: '#BB86FC',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  balanceChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceChange: {
    fontSize: 14,
    color: '#03DAC6',
    marginLeft: 4,
  },
  balancePriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balancePrice: {
    fontSize: 14,
    color: '#BB86FC',
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
    backgroundColor: '#BB86FC',
  },
  actionContent: {
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
    backgroundColor: '#1E1E1E',
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
    color: '#ffffff',
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
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
    color: '#ffffff',
  },
  assetBalance: {
    fontSize: 14,
    color: '#BB86FC',
    marginRight: 8,
  },
  assetValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  currenciesContainer: {
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
  trustLinesContainer: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#212121',
  },
  currencyItem: {
    fontSize: 16,
    color: '#212121',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  trustLineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  trustLineCurrency: {
    fontSize: 16,
    color: '#212121',
    flex: 1,
  },
  trustLineBalance: {
    fontSize: 14,
    color: '#757575',
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
    backgroundColor: '#1E1E1E',
    padding: 20,
    paddingTop: 40,
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notificationsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  closeButton: {
    padding: 8,
  },
  notificationsContent: {
    flexGrow: 1,
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
  qrModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  qrModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  qrModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  qrModalCloseButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
  },
  assetInfo: {
    flex: 1,
  },
  assetValues: {
    alignItems: 'flex-end',
  },
  trustlineIndicator: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
});