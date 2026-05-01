import React, { useEffect, useRef } from 'react'
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

export type DrawerRoute = 'Home' | 'Chat' | 'Notifications'

interface NavItem {
  route: DrawerRoute
  label: string
  icon: string
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Platform',
    items: [{ route: 'Chat', label: 'AI Mentor', icon: '🤖' }],
  },
  {
    label: 'Navigation',
    items: [
      { route: 'Home', label: 'Feed', icon: '📰' },
      { route: 'Notifications', label: 'Notifications', icon: '🔔' },
    ],
  },
]

const DRAWER_WIDTH = Dimensions.get('window').width * 0.72

interface DrawerMenuProps {
  visible: boolean
  currentRoute: string
  onNavigate: (route: DrawerRoute) => void
  onClose: () => void
}

export default function DrawerMenu({
  visible,
  currentRoute,
  onNavigate,
  onClose,
}: DrawerMenuProps) {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -DRAWER_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start()
  }, [visible])

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Drawer panel */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        {/* Brand */}
        <View style={styles.brand}>
          <Text style={styles.brandTitle}>MindBridge</Text>
          <Text style={styles.brandSub}>Your safe space</Text>
        </View>

        {/* Nav groups */}
        <View style={styles.nav}>
          {NAV_GROUPS.map((group) => (
            <View key={group.label} style={styles.group}>
              <Text style={styles.groupLabel}>{group.label}</Text>
              {group.items.map((item) => {
                const active = currentRoute === item.route
                return (
                  <TouchableOpacity
                    key={item.route}
                    style={[styles.navItem, active && styles.navItemActive]}
                    onPress={() => {
                      onNavigate(item.route)
                      onClose()
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.navIcon}>{item.icon}</Text>
                    <Text style={[styles.navLabel, active && styles.navLabelActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>MindBridge v1.0</Text>
        </View>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#1a1a2e',
    paddingTop: 56,
    paddingBottom: 24,
    display: 'flex',
    flexDirection: 'column',
  },
  brand: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    marginBottom: 16,
  },
  brandTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  brandSub: {
    color: '#818cf8',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  nav: {
    flex: 1,
    paddingHorizontal: 12,
  },
  group: {
    marginBottom: 20,
  },
  groupLabel: {
    color: '#6366f1',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  navItemActive: {
    backgroundColor: '#312e81',
  },
  navIcon: {
    fontSize: 16,
    width: 22,
    textAlign: 'center',
  },
  navLabel: {
    color: '#c7d2fe',
    fontSize: 14,
  },
  navLabelActive: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  footerText: {
    color: '#4f46e5',
    fontSize: 11,
  },
})
