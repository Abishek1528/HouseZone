import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import categoryContentStyles from '../styles/categoryContentStyles';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const navigation = useNavigation();
  const { dark, colors, toggleTheme } = useTheme();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(true);
  const [currentLanguage, setCurrentLanguage] = React.useState('English');

  const handleLanguageChange = () => {
    Alert.alert(
      "Select Language",
      "Choose your preferred language",
      [
        { text: "English", onPress: () => setCurrentLanguage('English') },
        { text: "Tamil", onPress: () => setCurrentLanguage('Tamil') },
        { text: "Hindi", onPress: () => setCurrentLanguage('Hindi') },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  return (
    <View style={[categoryContentStyles.container, { backgroundColor: colors.background }]}>
      <Header />
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        
        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon-outline" size={24} color={colors.primary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Switch 
            value={dark} 
            onValueChange={toggleTheme}
            trackColor={{ false: "#ccc", true: colors.primary }}
          />
        </View>

        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={24} color={colors.primary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Notifications</Text>
          </View>
          <Switch 
            value={isNotificationsEnabled} 
            onValueChange={setIsNotificationsEnabled}
            trackColor={{ false: "#ccc", true: colors.primary }}
          />
        </View>

        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: colors.border }]}
          onPress={handleLanguageChange}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="language-outline" size={24} color={colors.primary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Translate to ({currentLanguage})</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color={colors.subText} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: colors.border }]}
          onPress={() => navigation.navigate("Profile", { isEditing: true })}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="create-outline" size={24} color={colors.primary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Edit My Profile</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color={colors.subText} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="lock-closed-outline" size={24} color={colors.primary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color={colors.subText} />
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 15,
  },
});
