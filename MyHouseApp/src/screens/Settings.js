import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const navigation = useNavigation();
  const { dark, colors, toggleTheme } = useTheme();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('English');

  const handleLanguageChange = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      [
        { text: 'English', onPress: () => setCurrentLanguage('English') },
        { text: 'Tamil', onPress: () => setCurrentLanguage('Tamil') },
        { text: 'Hindi', onPress: () => setCurrentLanguage('Hindi') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy Policy', 'This feature is coming soon.');
  };

  return (
    <View style={styles.page}>
      <StatusBar barStyle="light-content" backgroundColor="#183b74" />

      <View style={styles.headerArea}>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTextBlock}>
          <Text style={styles.heroTitle}>Settings</Text>
          <Text style={styles.heroSubtitle}>Manage your preferences and account settings</Text>
        </View>
        <View style={styles.heroIconCard}>
          <Ionicons name="settings-outline" size={26} color="#2563eb" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={[styles.cardItem, styles.cardFirstItem]} onPress={toggleTheme} activeOpacity={0.8}>
            <View style={styles.iconBoxAccent}>
              <Ionicons name="moon-outline" size={22} color="#2563eb" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Dark Mode</Text>
              <Text style={styles.cardSubtitle}>Switch between light and dark theme</Text>
            </View>
            <Switch
              value={dark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#d1d5db', true: '#2563eb' }}
            />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.cardItem} onPress={() => setIsNotificationsEnabled(!isNotificationsEnabled)} activeOpacity={0.8}>
            <View style={styles.iconBoxAccent}>
              <Ionicons name="notifications-outline" size={22} color="#2563eb" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Notifications</Text>
              <Text style={styles.cardSubtitle}>Manage all push notifications</Text>
            </View>
            <Switch
              value={isNotificationsEnabled}
              onValueChange={setIsNotificationsEnabled}
              trackColor={{ false: '#d1d5db', true: '#2563eb' }}
            />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.cardItem} onPress={handleLanguageChange} activeOpacity={0.8}>
            <View style={styles.iconBoxAccent}>
              <Ionicons name="language-outline" size={22} color="#2563eb" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Translate to ({currentLanguage})</Text>
              <Text style={styles.cardSubtitle}>Change the app language</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.cardItem} onPress={() => navigation.navigate('Profile', { isEditing: true })} activeOpacity={0.8}>
            <View style={styles.iconBoxAccent}>
              <Ionicons name="create-outline" size={22} color="#2563eb" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Edit My Profile</Text>
              <Text style={styles.cardSubtitle}>Update your personal information</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={[styles.cardItem, styles.cardLastItem]} onPress={handlePrivacy} activeOpacity={0.8}>
            <View style={styles.iconBoxAccent}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#2563eb" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Privacy Policy</Text>
              <Text style={styles.cardSubtitle}>Read our privacy policy</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <View style={styles.safeCard}>
          <View style={styles.safeIconBox}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#1d4ed8" />
          </View>
          <View style={styles.safeTextArea}>
            <Text style={styles.safeTitle}>Your data is safe with us</Text>
            <Text style={styles.safeSubtitle}>We don’t share your personal information with anyone.</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#94a3b8" />
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#eef4ff',
  },
  headerArea: {
    backgroundColor: '#183b74',
    paddingTop: 52,
    paddingBottom: 42,
    paddingHorizontal: 22,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 80,
    position: 'relative',
    overflow: 'hidden',
  },
  heroCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    marginHorizontal: 16,
    marginTop: -8,
    paddingVertical: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 7,
  },
  heroTextBlock: {
    paddingTop: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 22,
    maxWidth: 240,
  },
  heroIconCard: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  settingsTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  settingsSubtitle: {
    fontSize: 15,
    color: '#dbeafe',
    lineHeight: 22,
    maxWidth: '95%',
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 7,
    marginBottom: 18,
  },
  cardFirstItem: {
    paddingTop: 18,
  },
  cardLastItem: {
    paddingBottom: 18,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxAccent: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    lineHeight: 19,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginLeft: 72,
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
    marginBottom: 18,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    lineHeight: 19,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  safeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
  },
  safeIconBox: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#e0efff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  safeTextArea: {
    flex: 1,
  },
  safeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  safeSubtitle: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 19,
  },
});
