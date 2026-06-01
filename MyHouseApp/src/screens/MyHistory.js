import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StatusBar,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/Footer';
import myHistoryStyles, { HISTORY_COLORS } from '../styles/myHistoryStyles';
import { getMyBookingHistory } from './MyHistory/api';

const CATEGORY_META = {
  residential: { label: 'House', icon: 'home-outline', color: HISTORY_COLORS.primary },
  business: { label: 'Business', icon: 'business-outline', color: HISTORY_COLORS.headerBgAlt },
  vehicles: { label: 'Vehicle', icon: 'car-outline', color: HISTORY_COLORS.accent },
  machinery: { label: 'Machinery', icon: 'construct-outline', color: '#475569' },
};

const FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'booking', label: 'Booked' },
  { id: 'listing', label: 'Listed' },
];

const formatAmount = (value) => {
  if (value == null || value === '') return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return `₹${num.toLocaleString('en-IN')}`;
};

const HistoryCard = ({ item }) => {
  const meta = CATEGORY_META[item.category] || CATEGORY_META.residential;
  const isListing = item.activityType === 'listing';
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
    <View style={myHistoryStyles.card}>
      <View style={myHistoryStyles.cardHeader}>
        <View style={myHistoryStyles.badge}>
          <Ionicons name={meta.icon} size={18} color={meta.color} />
          <Text style={[myHistoryStyles.badgeText, { color: meta.color }]}>{meta.label}</Text>
        </View>
        <View
          style={[
            myHistoryStyles.activityPill,
            isListing ? myHistoryStyles.activityPillListed : myHistoryStyles.activityPillBooked,
          ]}
        >
          <Text
            style={[
              myHistoryStyles.activityPillText,
              isListing ? myHistoryStyles.activityPillTextListed : myHistoryStyles.activityPillTextBooked,
            ]}
          >
            {isListing ? 'Listed' : 'Booked'}
          </Text>
        </View>
      </View>

      <Text style={myHistoryStyles.bookingType}>{item.type}</Text>
      <Text style={myHistoryStyles.cardTitle}>{item.title}</Text>
      <Text style={myHistoryStyles.cardSubtitle}>{item.subtitle}</Text>

      {recordId ? (
        <Text style={myHistoryStyles.metaLine}>
          {isListing ? 'Listing' : 'Booking'} #{recordId}
          {item.propertyId && item.propertyId !== recordId ? ` • Ref #${item.propertyId}` : ''}
        </Text>
      ) : null}

      <View style={myHistoryStyles.detailsBox}>
        <Text style={myHistoryStyles.detailsTitle}>
          {isListing ? 'Owner details' : 'Your details'}
        </Text>
        <Text style={myHistoryStyles.detailRow}>
          Name: <Text style={myHistoryStyles.detailValue}>{displayName || 'N/A'}</Text>
        </Text>
        {!isListing ? (
          <>
            <Text style={myHistoryStyles.detailRow}>
              Job: <Text style={myHistoryStyles.detailValue}>{item.job || 'N/A'}</Text>
            </Text>
            <Text style={myHistoryStyles.detailRow}>
              Salary:{' '}
              <Text style={myHistoryStyles.detailValue}>{formatAmount(item.salary) || 'N/A'}</Text>
            </Text>
          </>
        ) : null}
        <Text style={myHistoryStyles.detailRow}>
          Mobile: <Text style={myHistoryStyles.detailValue}>{displayContact || 'N/A'}</Text>
        </Text>
        {isListing && item.itemCount != null ? (
          <Text style={myHistoryStyles.detailRow}>
            Items listed: <Text style={myHistoryStyles.detailValue}>{item.itemCount}</Text>
          </Text>
        ) : null}
        {rentLabel ? <Text style={myHistoryStyles.rentLine}>{rentLabel}</Text> : null}
        {item.advance ? (
          <Text style={myHistoryStyles.detailRow}>
            Advance: <Text style={myHistoryStyles.detailValue}>{formatAmount(item.advance)}</Text>
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default function MyHistory() {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ bookings: 0, listings: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activityFilter, setActivityFilter] = useState('all');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const filteredBookings = useMemo(() => {
    if (activityFilter === 'all') return bookings;
    return bookings.filter((item) => item.activityType === activityFilter);
  }, [bookings, activityFilter]);

  const filterLabel = FILTER_OPTIONS.find((f) => f.id === activityFilter)?.label || 'All';

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
        <View style={myHistoryStyles.emptyWrap}>
          <View style={myHistoryStyles.emptyIconCircle}>
            <Ionicons name="log-in-outline" size={36} color={HISTORY_COLORS.accent} />
          </View>
          <Text style={myHistoryStyles.emptyTitle}>Please log in</Text>
          <Text style={myHistoryStyles.emptyText}>
            Sign in to see all your bookings and owner listings (house, business, vehicle, machinery).
          </Text>
          <TouchableOpacity
            style={myHistoryStyles.actionBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={myHistoryStyles.actionBtnText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={myHistoryStyles.emptyWrap}>
        <View style={myHistoryStyles.emptyIconCircle}>
          <Ionicons name="time-outline" size={36} color={HISTORY_COLORS.accent} />
        </View>
        <Text style={myHistoryStyles.emptyTitle}>
          {bookings.length > 0 && activityFilter !== 'all'
            ? `No ${filterLabel.toLowerCase()} items`
            : 'No activity yet'}
        </Text>
        <Text style={myHistoryStyles.emptyText}>
          {bookings.length > 0 && activityFilter !== 'all'
            ? `You have no ${filterLabel.toLowerCase()} records. Try "All" or another filter.`
            : `Submit an owner form or book as tenant using the same mobile number as your login${userName ? ` (${userName})` : ''}.`}
        </Text>
        {bookings.length > 0 && activityFilter !== 'all' ? (
          <TouchableOpacity
            style={[myHistoryStyles.actionBtn, { marginBottom: 10 }]}
            onPress={() => setActivityFilter('all')}
          >
            <Text style={myHistoryStyles.actionBtnText}>Show all</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={myHistoryStyles.actionBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={myHistoryStyles.actionBtnText}>Browse Listings</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={myHistoryStyles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={HISTORY_COLORS.headerBg} />

      <View style={myHistoryStyles.headerSection}>
        <View style={myHistoryStyles.headerTopRow}>
          <View style={myHistoryStyles.headerTitleBlock}>
            <Text style={myHistoryStyles.headerTitle}>My History</Text>
            {isLoggedIn && userName ? (
              <Text style={myHistoryStyles.headerSubtitle}>
                {userName} • {bookings.length} total record{bookings.length !== 1 ? 's' : ''}
              </Text>
            ) : (
              <Text style={myHistoryStyles.headerSubtitle}>
                Your bookings and listings in one place
              </Text>
            )}
          </View>

          {isLoggedIn && !loading ? (
            <TouchableOpacity
              style={[
                myHistoryStyles.filterIconBtn,
                (filterMenuOpen || activityFilter !== 'all') && myHistoryStyles.filterIconBtnActive,
              ]}
              onPress={() => setFilterMenuOpen((open) => !open)}
              activeOpacity={0.8}
              accessibilityLabel="Filter history"
            >
              <Ionicons
                name={filterMenuOpen ? 'close' : 'filter'}
                size={22}
                color={HISTORY_COLORS.white}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {isLoggedIn && !loading && filterMenuOpen ? (
          <View style={myHistoryStyles.filterPanel}>
            <Text style={myHistoryStyles.filterPanelTitle}>Show activity</Text>
            <View style={myHistoryStyles.filterChipRow}>
              {FILTER_OPTIONS.map((opt) => {
                const count =
                  opt.id === 'all'
                    ? bookings.length
                    : opt.id === 'booking'
                      ? stats.bookings
                      : stats.listings;
                const active = activityFilter === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[myHistoryStyles.filterChip, active && myHistoryStyles.filterChipActive]}
                    onPress={() => {
                      setActivityFilter(opt.id);
                      setFilterMenuOpen(false);
                    }}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        myHistoryStyles.filterChipText,
                        active && myHistoryStyles.filterChipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <Text
                      style={[
                        myHistoryStyles.filterChipCount,
                        active && myHistoryStyles.filterChipCountActive,
                      ]}
                    >
                      {count}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : null}

        {isLoggedIn && !loading ? (
          <View style={myHistoryStyles.statsRow}>
            <View style={myHistoryStyles.statCard}>
              <Text style={myHistoryStyles.statValue}>{stats.bookings}</Text>
              <Text style={myHistoryStyles.statLabel}>Booked</Text>
            </View>
            <View style={myHistoryStyles.statCard}>
              <Text style={myHistoryStyles.statValue}>{stats.listings}</Text>
              <Text style={myHistoryStyles.statLabel}>Listed</Text>
            </View>
          </View>
        ) : null}
      </View>

      <View style={myHistoryStyles.content}>
        {isLoggedIn && !loading && activityFilter !== 'all' && bookings.length > 0 ? (
          <Text style={myHistoryStyles.contentFilterHint}>
            Showing {filteredBookings.length} {filterLabel.toLowerCase()} record
            {filteredBookings.length !== 1 ? 's' : ''}
          </Text>
        ) : null}

        {loading ? (
          <ActivityIndicator
            size="large"
            color={HISTORY_COLORS.primary}
            style={myHistoryStyles.loader}
          />
        ) : (
          <FlatList
            data={filteredBookings}
            keyExtractor={(item, index) =>
              `${item.activityType}-${item.category}-${item.recordId || item.bookingId}-${index}`
            }
            renderItem={({ item }) => <HistoryCard item={item} />}
            contentContainerStyle={
              filteredBookings.length === 0 ? myHistoryStyles.listEmpty : myHistoryStyles.listContent
            }
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadHistory(true)}
                colors={[HISTORY_COLORS.primary]}
                tintColor={HISTORY_COLORS.primary}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <Footer />
    </View>
  );
}
