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
import { useNavigation } from '@react-navigation/native';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import categoryContentStyles from '../../../styles/categoryContentStyles';
import propertyListStyles from '../../residential/tenant/propertyListStyles';
import { getAvailableVehicles } from './api';

const VehiclesList = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const data = await getAvailableVehicles();
            console.log('Raw vehicles API response:', data);

            // Map API fields directly to UI (API already returns normalized field names)
            const vehicles = (data || []).map(item => ({
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

            console.log('Normalized vehicles:', vehicles);
            setVehicles(vehicles);
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

    const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
    const API_HOST = API_BASE_URL.replace(/\/api$/, '');

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
                <Text style={categoryContentStyles.pageTitle}>Available Vehicles</Text>

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
