import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import categoryContentStyles from '../styles/categoryContentStyles';
import { useTheme } from '../context/ThemeContext';
import { getMyBookingHistory } from './MyHistory/api';

const CATEGORY_META = {
  residential: { label: 'House', icon: 'home-outline', color: '#2563eb' },
  business: { label: 'Business', icon: 'business-outline', color: '#7c3aed' },
  vehicles: { label: 'Vehicle', icon: 'car-outline', color: '#059669' },
  machinery: { label: 'Machinery', icon: 'construct-outline', color: '#d97706' },
};

const formatAmount = (value) => {
  if (value == null || value === '') return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return `₹${num.toLocaleString('en-IN')}`;
};

const HistoryCard = ({ item, colors }) => {
  const meta = CATEGORY_META[item.category] || CATEGORY_META.residential;
  const isListing = item.activityType === 'listing';
  const activityColor = isListing ? '#059669' : '#2563eb';
  const displayName = isListing ? item.ownerName : item.tenantName;
  const displayContact = isListing ? item.contactNo : item.mobileNumber;
  const rentLabel = item.leaseAmount
    ? `Lease: ${formatAmount(item.leaseAmount)}`
    : item.rent
      ? isListing && (item.category === 'vehicles' || item.category === 'machinery')
        ? `Charge: ${formatAmount(item.rent)}/day`
        : item.rent
          ? `Rent: ${formatAmount(item.rent)}/month`
          : null
      : null;

  const recordId = item.recordId || item.bookingId;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.badge, { backgroundColor: `${meta.color}22` }]}>
          <Ionicons name={meta.icon} size={18} color={meta.color} />
          <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
        </View>
        <View style={[styles.activityPill, { backgroundColor: `${activityColor}22` }]}>
          <Text style={[styles.activityPillText, { color: activityColor }]}>
            {isListing ? 'Listed' : 'Booked'}
          </Text>
        </View>
      </View>

      <Text style={[styles.bookingType, { color: colors.subText, marginBottom: 6 }]}>{item.type}</Text>
      <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.cardSubtitle, { color: colors.subText }]}>{item.subtitle}</Text>

      {recordId ? (
        <Text style={[styles.metaLine, { color: colors.subText }]}>
          {isListing ? 'Listing' : 'Booking'} #{recordId}
          {item.propertyId && item.propertyId !== recordId ? ` • Ref #${item.propertyId}` : ''}
        </Text>
      ) : null}

      <View style={[styles.detailsBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <Text style={[styles.detailsTitle, { color: colors.text }]}>
          {isListing ? 'Owner details' : 'Your details'}
        </Text>
        <Text style={[styles.detailRow, { color: colors.subText }]}>
          Name: <Text style={{ color: colors.text }}>{displayName || 'N/A'}</Text>
        </Text>
        {!isListing ? (
          <>
            <Text style={[styles.detailRow, { color: colors.subText }]}>
              Job: <Text style={{ color: colors.text }}>{item.job || 'N/A'}</Text>
            </Text>
            <Text style={[styles.detailRow, { color: colors.subText }]}>
              Salary: <Text style={{ color: colors.text }}>{formatAmount(item.salary) || 'N/A'}</Text>
            </Text>
          </>
        ) : null}
        <Text style={[styles.detailRow, { color: colors.subText }]}>
          Mobile: <Text style={{ color: colors.text }}>{displayContact || 'N/A'}</Text>
        </Text>
        {isListing && item.itemCount != null ? (
          <Text style={[styles.detailRow, { color: colors.subText }]}>
            Items listed: <Text style={{ color: colors.text }}>{item.itemCount}</Text>
          </Text>
        ) : null}
        {rentLabel ? (
          <Text style={[styles.rentLine, { color: '#059669' }]}>{rentLabel}</Text>
        ) : null}
        {item.advance ? (
          <Text style={[styles.detailRow, { color: colors.subText }]}>
            Advance: <Text style={{ color: colors.text }}>{formatAmount(item.advance)}</Text>
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default function MyHistory() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ bookings: 0, listings: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loadHistory = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const stored = await AsyncStorage.getItem('userDetails');
      if (!stored) {
        setIsLoggedIn(false);
        setBookings([]);
        setUserName('');
        return;
      }

      const user = JSON.parse(stored);
      const contact = user?.contact || user?.contact_number;
      const userId = user?.id;

      if (!contact) {
        setIsLoggedIn(false);
        setBookings([]);
        Alert.alert('Login required', 'Please log in to view your booking history.');
        return;
      }

      setIsLoggedIn(true);
      setUserName(user?.name || '');

      const result = await getMyBookingHistory({ contact, userId });
      const list = Array.isArray(result?.bookings) ? result.bookings : [];
      setBookings(list);
      setStats({
        bookings: result?.bookingCount ?? list.filter((i) => i.activityType === 'booking').length,
        listings: result?.listingCount ?? list.filter((i) => i.activityType === 'listing').length,
      });

      if (result?.accountName) {
        setUserName(result.accountName);
      }
    } catch (error) {
      console.error('My history load error:', error);
      setBookings([]);
      Alert.alert('Error', error.message || 'Failed to load your history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const renderEmpty = () => {
    if (loading) return null;

    if (!isLoggedIn) {
      return (
        <View style={styles.emptyWrap}>
          <Ionicons name="log-in-outline" size={48} color={colors.subText} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Please log in</Text>
          <Text style={[styles.emptyText, { color: colors.subText }]}>
            Sign in to see all your bookings and owner listings (house, business, vehicle, machinery).
          </Text>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.actionBtnText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyWrap}>
        <Ionicons name="time-outline" size={48} color={colors.subText} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No activity yet</Text>
        <Text style={[styles.emptyText, { color: colors.subText }]}>
          Submit an owner form or book as tenant using the same mobile number as your login ({userName ? `logged in as ${userName}` : 'your account'}).
        </Text>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.actionBtnText}>Browse Listings</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[categoryContentStyles.container, { backgroundColor: colors.background }]}>
      <Header />

      <View style={styles.content}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>My History</Text>
        {isLoggedIn && userName ? (
          <Text style={[styles.pageSubtitle, { color: colors.subText }]}>
            {userName} • {bookings.length} total ({stats.bookings} booked, {stats.listings} listed)
          </Text>
        ) : null}

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(item, index) => `${item.activityType}-${item.category}-${item.recordId || item.bookingId}-${index}`}
            renderItem={({ item }) => <HistoryCard item={item} colors={colors} />}
            contentContainerStyle={bookings.length === 0 ? styles.listEmpty : styles.listContent}
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => loadHistory(true)} colors={[colors.primary]} />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  bookingType: {
    fontSize: 12,
    fontWeight: '600',
  },
  activityPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  metaLine: {
    fontSize: 12,
    marginBottom: 10,
  },
  detailsBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  detailRow: {
    fontSize: 13,
    marginBottom: 4,
    lineHeight: 18,
  },
  rentLine: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  actionBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
