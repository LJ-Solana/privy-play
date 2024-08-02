import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const FOCUSED_COLOR = '#BB86FC'; 
const UNFOCUSED_COLOR = '#808080';

export default function TabLayout() {
  return (
    <Tabs 
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: FOCUSED_COLOR,
        tabBarInactiveTintColor: UNFOCUSED_COLOR,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="home" size={24} color={focused ? FOCUSED_COLOR : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="swaps"
        options={{
          title: 'Swaps',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="swap-horizontal" size={24} color={focused ? FOCUSED_COLOR : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="list" size={24} color={focused ? FOCUSED_COLOR : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="person" size={24} color={focused ? FOCUSED_COLOR : color} />
          ),
        }}
      />
    </Tabs>
  );
}