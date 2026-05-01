import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { usePushNotifications } from './src/hooks/usePushNotifications'
import ChatScreen from './src/screens/ChatScreen'
import HomeScreen from './src/screens/HomeScreen'
import NotificationsScreen from './src/screens/NotificationsScreen'
import DrawerMenu, { DrawerRoute } from './src/components/DrawerMenu'

export type RootStackParamList = {
  Home: undefined
  Chat: undefined
  Notifications: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  usePushNotifications()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currentRoute, setCurrentRoute] = useState<DrawerRoute>('Home')
  const navRef = useNavigationContainerRef<RootStackParamList>()

  const hamburger = (
    <TouchableOpacity
      onPress={() => setDrawerOpen(true)}
      style={{ paddingHorizontal: 8, paddingVertical: 4 }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text style={{ fontSize: 20, color: '#2d3c2d' }}>☰</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navRef}
        onStateChange={() => {
          const route = navRef.getCurrentRoute()?.name as DrawerRoute | undefined
          if (route) setCurrentRoute(route)
        }}
      >
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#f5f6f0' },
            headerTintColor: '#2d3c2d',
            headerTitleStyle: { fontWeight: '700' },
            headerLeft: () => hamburger,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'MindBridge' }} />
          <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'AI Mentor' }} />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{ title: 'Notifications' }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      <DrawerMenu
        visible={drawerOpen}
        currentRoute={currentRoute}
        onNavigate={(route) => navRef.navigate(route)}
        onClose={() => setDrawerOpen(false)}
      />

      <StatusBar style="dark" />
    </SafeAreaProvider>
  )
}
