import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Alert,
    Image
} from 'react-native';
import TenantFilterPanel from '../../../shared/components/TenantFilterPanel';
import { useNavigation } from '@react-navigation/native';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import propertyListStyles from '../../residential/tenant/propertyListStyles';
import { getAvailableVehicles } from './api';
import { getTenantPageStyles } from '../../../styles/tenantPageStyles';
import { getOwnerFormThemeColors } from '../../../styles/ownerFormStyles';
import TenantPageHeader from '../../../shared/components/TenantPageHeader';
import { useTheme } from '../../../context/ThemeContext';
import { getTimeAgo } from '../../../shared/utils/timeUtils.js';

// Component to display selected filters as horizontal boxes with remove option
const SelectedFilterBox = ({ label, value, onRemove }) => {
    if (!value) return null;
    return (
        <View style={propertyListStyles.selectedFilterBox}>
            <View style={propertyListStyles.selectedFilterContent}>
                <Text style={propertyListStyles.selectedFilterText}>
                    {label}: {value}
                </Text>
                <TouchableOpacity onPress={onRemove} style={propertyListStyles.removeFilterButton}>
                    <Text style={propertyListStyles.removeFilterText}>✕</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const RENT_FILTER_OPTIONS = [
    { label: "Any", value: "" },
    { label: "2000-4000", value: "2000-4000" },
    { label: "4000-6000", value: "4000-6000" },
    { label: "6000-8000", value: "6000-8000" },
    { label: "8000-10000", value: "8000-10000" },
    { label: "10000-12000", value: "10000-12000" },
];

const TYPE_FILTER_OPTIONS = [
    { label: "Any", value: "" },
    { label: "Car", value: "Car" },
    { label: "Bus", value: "Bus" },
    { label: "Van", value: "Van" },
    { label: "Auto", value: "Auto" },
];

const AREA_FILTER_OPTIONS = [
    { label: "Any", value: "" },
    { label: "Area 1", value: "Area 1" },
    { label: "Area 2", value: "Area 2" },
    { label: "Area 3", value: "Area 3" },
];

const VehiclesList = () => {
    const { dark } = useTheme();
    const themeColors = getOwnerFormThemeColors(dark);
    const tps = getTenantPageStyles(dark);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rentFilter, setRentFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [areaFilter, setAreaFilter] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async (filters = {}) => {
        try {
            setLoading(true);
            const data = await getAvailableVehicles(filters);
            console.log('Raw vehicles API response:', data);

            // Map API fields directly to UI (API already returns normalized field names)
            const normalizedVehicles = (data || []).map(item => ({
                ...item,
                id: item.id,
                name: item.name || '',
                model: item.model || '',
                type: item.type || '',
                fuelType: item.fuelType || '',
                acPrice: item.acPrice || 0,
                nonAcPrice: item.nonAcPrice || 0,
                area: item.area || '',
                city: item.city || '',
                images: Array.isArray(item.images) ? item.images : [],
                createdAt: item.createdAt
            }));

            setVehicles(normalizedVehicles);
        } catch (error) {
            console.error('Error loading vehicles:', error);
            setVehicles([]);
            Alert.alert(
                'Error',
                `Failed to load vehicles: ${error.message || 'Unknown error'}. Please check your internet connection and try again.`
            );
        } finally {
            setLoading(false);
        }
    };

    // Apply filters when any filter changes
    useEffect(() => {
        const filters = {};
        if (rentFilter) filters.rent = rentFilter;
        if (typeFilter) filters.type = typeFilter;
        if (areaFilter) filters.area = areaFilter;

        fetchVehicles(filters);
    }, [rentFilter, typeFilter, areaFilter]);

    const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
    const API_HOST = API_BASE_URL.replace(/\/api$/, '');

    const getRentLabel = (value) => {
        switch (value) {
            case '2000-4000': return '₹2000-4000';
            case '4000-6000': return '₹4000-6000';
            case '6000-8000': return '₹6000-8000';
            case '8000-10000': return '₹8000-10000';
            case '10000-12000': return '₹10000-12000';
            default: return '';
        }
    };

    const renderVehicleCard = ({ item }) => {
        const firstImageRaw = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null;
        const firstImage = (typeof firstImageRaw === 'string' && firstImageRaw) 
            ? (firstImageRaw.startsWith('http') ? firstImageRaw : `${API_HOST}${firstImageRaw}`) 
            : 'https://coresg-normal.trae.ai/api/ide/v1/text-to-image?prompt=car%20or%20vehicle%20rental%20property%20listing%20placeholder%20image&image_size=square';
        return (
            <View style={tps.card}>
                <Image 
                    source={{ uri: firstImage }} 
                    style={propertyListStyles.imagePlaceholder} 
                    resizeMode="cover"
                />

                <View style={propertyListStyles.detailsContainer}>
                    <Text style={propertyListStyles.location}>{item.area || item.city || 'Unknown'}</Text>

                    <View style={tps.propertyInfo}>
                        <Text style={propertyListStyles.bedroomsText}>{item.name || 'Vehicle'}</Text>
                        <Text style={propertyListStyles.rentText}>
                            ₹{item.acPrice || item.nonAcPrice || 0} / day
                        </Text>
                    </View>

                    <Text style={[propertyListStyles.infoText, { marginBottom: 8 }]}>
                        Fuel: {item.fuelType || 'N/A'}
                    </Text>
                    <Text style={{ marginLeft: 12, marginBottom: 8, color: tps.colors.subText, fontSize: 12, fontWeight: '500' }}>
                        Posted {getTimeAgo(item.createdAt)}
                    </Text>
                    <TouchableOpacity
                        style={propertyListStyles.viewMoreButton}
                        onPress={() => navigation.navigate('VehicleDetails', { id: item.id })}
                    >
                        <Text style={propertyListStyles.viewMoreText}>View Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={tps.screen}>
            <Header />
            <TenantPageHeader
                title="Available Vehicles"
                subtitle="Browse cars, buses, and more for rent"
            />
            <View style={propertyListStyles.content}>
                <View style={propertyListStyles.titleRow}>
                    <Text style={tps.pageTitle}>Listings</Text>
                    <TouchableOpacity style={tps.filterBtn} onPress={() => setIsFilterVisible(!isFilterVisible)}>
                        <Text style={tps.filterBtnText}>
                            {isFilterVisible ? 'Hide Filter' : 'Filter'} {isFilterVisible ? '▲' : '▼'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {isFilterVisible && (
                    <TenantFilterPanel
                        colors={themeColors}
                        sections={[
                            { key: "rent", label: "Rent", options: RENT_FILTER_OPTIONS, value: rentFilter, onSelect: setRentFilter },
                            { key: "type", label: "Type", options: TYPE_FILTER_OPTIONS, value: typeFilter, onSelect: setTypeFilter },
                            { key: "area", label: "Area", options: AREA_FILTER_OPTIONS, value: areaFilter, onSelect: setAreaFilter },
                        ]}
                    />
                )}

                {/* Display selected filters horizontally with remove option */}
                <View style={propertyListStyles.selectedFiltersContainer}>
                    <SelectedFilterBox
                        label="Rent"
                        value={getRentLabel(rentFilter)}
                        onRemove={() => setRentFilter('')}
                    />
                    <SelectedFilterBox
                        label="Type"
                        value={typeFilter}
                        onRemove={() => setTypeFilter('')}
                    />
                    <SelectedFilterBox
                        label="Area"
                        value={areaFilter}
                        onRemove={() => setAreaFilter('')}
                    />
                </View>

                {/* Vehicles List */}
                {loading ? (
                    <Text style={propertyListStyles.loadingText}>Loading vehicles...</Text>
                ) : vehicles.length === 0 ? (
                    <Text style={propertyListStyles.noPropertiesText}>No vehicles available at the moment.</Text>
                ) : (
                    <FlatList
                        data={vehicles}
                        renderItem={renderVehicleCard}
                        keyExtractor={(item) => (item?.id || Math.random()).toString()}
                        style={propertyListStyles.list}
                    />
                )}
            </View>

            <Footer />
        </View>
    );
};

export default VehiclesList;
