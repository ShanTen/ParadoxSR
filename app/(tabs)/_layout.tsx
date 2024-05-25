import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIconFA(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -10}} {...props} />;
}

function TabBarIconMC(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
}) {
  return <MaterialCommunityIcons size={28} style={{ marginBottom: -10}} {...props} />;
}


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,

        // For the life of me I cant figure out why I have to do this here, but not it in the other app??? 
        tabBarStyle: {
          backgroundColor: "rgba(0, 0, 0, 1)", 
          borderTopColor: "rgba(100, 100, 100, 0.3)",
          borderTopWidth: 1,
        },
        
        headerShown: useClientOnlyValue(true, false),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIconFA name="home" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="EventDetails"
        options={{
          title: 'Event Details',
          tabBarIcon: ({ color }) => <TabBarIconMC name="calendar" color={color} />,
          headerShown: false,
          href: null
        }}
      />
      <Tabs.Screen
        name="ProfilePage"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIconFA name="user-circle-o" color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
