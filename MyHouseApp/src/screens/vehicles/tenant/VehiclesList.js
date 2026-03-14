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
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import categoryContentStyles from '../../../styles/categoryContentStyles';
import propertyListStyles from '../../residential/tenant/propertyListStyles';
import { getAvailableVehicles } from './api';

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

const VehiclesList = () => {
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
                images: Array.isArray(item.images) ? item.images : []
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
        const firstImage = firstImageRaw ? (firstImageRaw.startsWith('http') ? firstImageRaw : `${API_HOST}${firstImageRaw}`) : null;
        return (
            <View style={propertyListStyles.card}>
                {firstImage ? (
                    <Image source={{ uri: firstImage }} style={propertyListStyles.imagePlaceholder} />
                ) : (
                    <View style={propertyListStyles.imagePlaceholder}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#4A90E2' }}>
                                {item.type ? item.type.toUpperCase() : 'VEHICLE'}
                            </Text>
                            <Text style={{ fontSize: 10, color: '#666', marginTop: 4 }}>
                                {item.model || 'Model N/A'}
                            </Text>
                        </View>
                    </View>
                )}

                <View style={propertyListStyles.detailsContainer}>
                    <Text style={propertyListStyles.location}>{item.area || item.city || 'Unknown'}</Text>

                    <View style={propertyListStyles.propertyInfo}>
                        <Text style={propertyListStyles.bedroomsText}>{item.name || 'Vehicle'}</Text>
                        <Text style={propertyListStyles.rentText}>
                            ₹{item.acPrice || item.nonAcPrice || 0} / day
                        </Text>
                    </View>

                    <Text style={[propertyListStyles.infoText, { marginBottom: 8 }]}>
                        Fuel: {item.fuelType || 'N/A'}
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
        <View style={categoryContentStyles.container}>
            <Header />

            {/* Content */}
            <View style={categoryContentStyles.content}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={categoryContentStyles.pageTitle}>Available Vehicles</Text>
                    <TouchableOpacity 
                        style={[propertyListStyles.searchButton, { marginBottom: 15, flexDirection: 'row', alignItems: 'center' }]}
                        onPress={() => setIsFilterVisible(!isFilterVisible)}
                    >
                        <Text style={propertyListStyles.searchButtonText}>
                            {isFilterVisible ? 'Hide Filter' : 'Filter'}
                        </Text>
                        <Text style={[propertyListStyles.searchButtonText, { marginLeft: 5 }]}>
                            {isFilterVisible ? '▲' : '▼'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Filter Section with Three Rectangular Boxes */}
                {isFilterVisible && (
                    <View style={propertyListStyles.filterContainer}>
                        <View style={propertyListStyles.filterBox}>
                            <Text style={propertyListStyles.filterLabel}>Rent:</Text>
                            <Picker
                                selectedValue={rentFilter}
                                style={propertyListStyles.picker}
                                onValueChange={(itemValue) => setRentFilter(itemValue)}
                                mode="dropdown"
                            >
                                <Picker.Item label="Any" value="" color="#999999" style={{ fontSize: 15 }} />
                                <Picker.Item label="2000-4000" value="2000-4000" color="#000000" style={{ fontSize: 15 }} />
                                <Picker.Item label="4000-6000" value="4000-6000" color="#000000" style={{ fontSize: 15 }} />
                                <Picker.Item label="6000-8000" value="6000-8000" color="#000000" style={{ fontSize: 15 }} />
                                <Picker.Item label="8000-10000" value="8000-10000" color="#000000" style={{ fontSize: 15 }} />
                                <Picker.Item label="10000-12000" value="10000-12000" color="#000000" style={{ fontSize: 15 }} />
                            </Picker>
                        </View>

                        <View style={propertyListStyles.filterBox}>
                            <Text style={propertyListStyles.filterLabel}>Type:</Text>
                            <Picker
                                selectedValue={typeFilter}
                                style={propertyListStyles.picker}
                                onValueChange={(itemValue) => setTypeFilter(itemValue)}
                                mode="dropdown"
                            >
                                <Picker.Item label="Any" value="" color="#999999" style={{ fontSize: 15 }} />
                                <Picker.Item label="Car" value="Car" color="#000000" style={{ fontSize: 15 }} />
                                <Picker.Item label="Bus" value="Bus" color="#000000" style={{ fontSize: 15 }} />
                                <Picker.Item label="Van" value="Van" color="#000000" style={{ fontSize: 15 }} />
                                <Picker.Item label="Auto" value="Auto" color="#000000" style={{ fontSize: 15 }} />
                            </Picker>
                        </View>

                        <View style={propertyListStyles.filterBox}>
                            <Text style={propertyListStyles.filterLabel}>Area:</Text>
                            <Picker
                                selectedValue={areaFilter}
                                style={propertyListStyles.picker}
                                onValueChange={(itemValue) => setAreaFilter(itemValue)}
                                mode="dropdown"
                            >
                                <Picker.Item label="Any" value="" color="#999999" style={{ fontSize: 15 }} />
                                <Picker.Item label="Area 1" value="Area 1" color="#000000" style={{ fontSize: 15 }} />
                                <Picker.Item label="Area 2" value="Area 2" color="#000000" style={{ fontSize: 15 }} />
                                <Picker.Item label="Area 3" value="Area 3" color="#000000" style={{ fontSize: 15 }} />
                            </Picker>
                        </View>
                    </View>
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
                        keyExtractor={(item) => item.id.toString()}
                        style={propertyListStyles.list}
                    />
                )}
            </View>

            <Footer />
        </View>
    );
};

export default VehiclesList;
