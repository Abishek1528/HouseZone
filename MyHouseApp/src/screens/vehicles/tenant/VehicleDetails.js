import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Image
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getVehicleDetails } from './api';

const VehicleDetails = () => {
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const route = useRoute();
    const { id } = route.params;

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const data = await getVehicleDetails(id);
            setVehicle(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        );
    }

    if (!vehicle) return null;

    return (
        <View style={styles.mainContainer}>
            <Header />
            <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
                <View style={styles.detailsContainer}>
                    {/* Images Gallery */}
                    {Array.isArray(vehicle.vehicle_images) && vehicle.vehicle_images.length > 0 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                            {vehicle.vehicle_images.map((imgRaw, idx) => {
                                const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
                                const API_HOST = API_BASE_URL.replace(/\/api$/, '');
                                const img = imgRaw.startsWith('http') ? imgRaw : `${API_HOST}${imgRaw}`;
                                return (
                                    <View key={idx} style={{ marginRight: 10 }}>
                                        <Image source={{ uri: img }} style={{ width: 220, height: 140, borderRadius: 8 }} />
                                    </View>
                                );
                            })}
                        </ScrollView>
                    )}
                    {/* Vehicle Name and Location */}
                    <Text style={styles.vehicleName}>{vehicle.vehicle_name} {vehicle.vehicle_model}</Text>
                    <Text style={styles.location}>{vehicle.area}, {vehicle.city}</Text>

                    {/* Vehicle Information Box */}
                    <View style={styles.infoBox}>
                        <Text style={styles.boxTitle}>Vehicle Information</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Type:</Text>
                            <Text style={styles.infoValue}>{vehicle.vehicle_type ? vehicle.vehicle_type.toUpperCase() : 'N/A'}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Fuel Type:</Text>
                            <Text style={styles.infoValue}>{vehicle.fuel_type || 'N/A'}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Model:</Text>
                            <Text style={styles.infoValue}>{vehicle.vehicle_model || 'N/A'}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Seat Capacity:</Text>
                            <Text style={styles.infoValue}>{vehicle.seat_capacity || 'N/A'} Seats</Text>
                        </View>
                    </View>

                    {/* AC Pricing Box */}
                    <View style={styles.infoBox}>
                        <Text style={styles.boxTitle}>AC Pricing</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Charge/Day:</Text>
                            <Text style={styles.infoValue}>₹{vehicle.ac_charge_per_day || 0}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Charge/KM:</Text>
                            <Text style={styles.infoValue}>₹{vehicle.ac_charge_per_km || 0}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Waiting/Hour:</Text>
                            <Text style={styles.infoValue}>₹{vehicle.ac_waiting_charge_per_hour || 0}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Fixed:</Text>
                            <Text style={styles.infoValue}>{vehicle.ac_fixed ? 'Yes' : 'No'}</Text>
                        </View>
                    </View>

                    {/* Non-AC Pricing Box */}
                    <View style={styles.infoBox}>
                        <Text style={styles.boxTitle}>Non-AC Pricing</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Charge/Day:</Text>
                            <Text style={styles.infoValue}>₹{vehicle.nonac_charge_per_day || 0}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Charge/KM:</Text>
                            <Text style={styles.infoValue}>₹{vehicle.nonac_charge_per_km || 0}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Waiting/Hour:</Text>
                            <Text style={styles.infoValue}>₹{vehicle.nonac_waiting_charge_per_hour || 0}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Fixed:</Text>
                            <Text style={styles.infoValue}>{vehicle.nonac_fixed ? 'Yes' : 'No'}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Footer />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flex: 1,
    },
    scrollContentContainer: {
        paddingBottom: 20,
    },
    detailsContainer: {
        padding: 15,
    },
    vehicleName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    location: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    infoBox: {
        borderWidth: 1,
        borderColor: '#4A90E2',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    boxTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A90E2',
        marginBottom: 12,
        textAlign: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'right',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default VehicleDetails;
