import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';

export default function ProfileScreen() {
  const userInfo = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://placeholder.com/150x150',
  };

  const menuItems = [
    { icon: 'person-outline', title: 'Personal Information' },
    { icon: 'lock-closed-outline', title: 'Security' },
    { icon: 'card-outline', title: 'Payment Methods' },
    { icon: 'notifications-outline', title: 'Notifications' },
    { icon: 'help-circle-outline', title: 'Help & Support' },
    { icon: 'settings-outline', title: 'Settings' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a237e', '#3949ab']}
        style={styles.header}
      >
        <ThemedText style={styles.headerTitle}>Profile</ThemedText>
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileInfo}>
          <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
          <ThemedText style={styles.name}>{userInfo.name}</ThemedText>
          <ThemedText style={styles.email}>{userInfo.email}</ThemedText>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <Ionicons name={item.icon} size={24} color="#3949ab" />
              <ThemedText style={styles.menuItemText}>{item.title}</ThemedText>
              <Ionicons name="chevron-forward" size={24} color="#757575" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <LinearGradient
            colors={['#3949ab', '#5c6bc0']}
            style={styles.logoutGradient}
          >
            <ThemedText style={styles.logoutText}>Log Out</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  profileInfo: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  email: {
    fontSize: 16,
    color: '#757575',
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#212121',
  },
  logoutButton: {
    margin: 20,
  },
  logoutGradient: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
