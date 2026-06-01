import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    Image,
    TouchableOpacity
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import ImageView from "react-native-image-viewing";
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getVehicleDetails } from './api';
import {
    tenantVehicleDetailsStyles as styles,
    getTenantPageStyles,
} from '../../../styles/tenantPageStyles';
import TenantPageHeader from '../../../shared/components/TenantPageHeader';
import { useTheme } from '../../../context/ThemeContext';

const VehicleDetails = () => {
    const { dark } = useTheme();
    const tps = getTenantPageStyles(dark);
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isImageViewVisible, setIsImageViewVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const route = useRoute();
    const navigation = useNavigation();
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

    const handleProceed = () => {
        navigation.navigate('NewTenantForm', { propertyId: id, category: 'vehicles' });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    if (!vehicle) return null;

    return (
        <View style={styles.mainContainer}>
            <Header />
            <TenantPageHeader
                title={vehicle?.vehicle_name || 'Vehicle Details'}
                subtitle={`${vehicle?.area || 'N/A'}, ${vehicle?.city || 'N/A'}`}
            />
            <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
                <View style={styles.detailsContainer}>
                    {/* Images Gallery */}
                    {Array.isArray(vehicle?.vehicle_images) && vehicle.vehicle_images.length > 0 && (
                        <View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                                {vehicle.vehicle_images.map((imgRaw, idx) => {
                                    if (!imgRaw || typeof imgRaw !== 'string') return null;
                                    const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
                                    const API_HOST = API_BASE_URL.replace(/\/api$/, '');
                                    const img = imgRaw.startsWith('http') ? imgRaw : `${API_HOST}${imgRaw}`;
                                    return (
                                        <TouchableOpacity 
                                            key={idx} 
                                            style={{ marginRight: 10 }}
                                            onPress={() => {
                                                setCurrentImageIndex(idx);
                                                setIsImageViewVisible(true);
                                            }}
                                        >
                                            <Image source={{ uri: img }} style={{ width: 220, height: 140, borderRadius: 8 }} />
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                            
                            <ImageView
                                images={vehicle.vehicle_images
                                    .filter(imgRaw => typeof imgRaw === 'string' && imgRaw)
                                    .map(imgRaw => {
                                        const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
                                        const API_HOST = API_BASE_URL.replace(/\/api$/, '');
                                        return {
                                            uri: imgRaw.startsWith('http') ? imgRaw : `${API_HOST}${imgRaw}`
                                        };
                                    })
                                }
                                imageIndex={currentImageIndex}
                                visible={isImageViewVisible}
                                onRequestClose={() => setIsImageViewVisible(false)}
                            />
                        </View>
                    )}
                    {/* Vehicle Name and Location */}
                    <Text style={styles.vehicleName}>{vehicle?.vehicle_name || 'Vehicle'} {vehicle?.vehicle_model || ''}</Text>
                    <Text style={styles.location}>{vehicle?.area || 'N/A'}, {vehicle?.city || 'N/A'}</Text>

                    {/* Vehicle Information Box */}
                    <View style={styles.infoBox}>
                        <Text style={styles.boxTitle}>Vehicle Information</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Type:</Text>
                            <Text style={styles.infoValue}>{vehicle?.vehicle_type ? vehicle.vehicle_type.toUpperCase() : 'N/A'}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Fuel Type:</Text>
                            <Text style={styles.infoValue}>{vehicle?.fuel_type || 'N/A'}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Model:</Text>
                            <Text style={styles.infoValue}>{vehicle?.vehicle_model || 'N/A'}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Seat Capacity:</Text>
                            <Text style={styles.infoValue}>{vehicle?.seat_capacity || 'N/A'} Seats</Text>
                        </View>
                    </View>

                    {/* AC Pricing Box */}
                    <View style={styles.infoBox}>
                        <Text style={styles.boxTitle}>AC Pricing</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Charge/Day:</Text>
                            <Text style={styles.infoValue}>₹{vehicle?.ac_charge_per_day || 0}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Charge/KM:</Text>
                            <Text style={styles.infoValue}>₹{vehicle?.ac_charge_per_km || 0}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Waiting/Hour:</Text>
                            <Text style={styles.infoValue}>₹{vehicle?.ac_waiting_charge_per_hour || 0}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Fixed:</Text>
                            <Text style={styles.infoValue}>{vehicle?.ac_fixed ? 'Yes' : 'No'}</Text>
                        </View>
                    </View>

                    {/* Non-AC Pricing Box */}
                    <View style={styles.infoBox}>
                        <Text style={styles.boxTitle}>Non-AC Pricing</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Charge/Day:</Text>
                            <Text style={styles.infoValue}>₹{vehicle?.nonac_charge_per_day || 0}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Charge/KM:</Text>
                            <Text style={styles.infoValue}>₹{vehicle?.nonac_charge_per_km || 0}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Waiting/Hour:</Text>
                            <Text style={styles.infoValue}>₹{vehicle?.nonac_waiting_charge_per_hour || 0}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Fixed:</Text>
                            <Text style={styles.infoValue}>{vehicle?.nonac_fixed ? 'Yes' : 'No'}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={[tps.bottomBar, { paddingHorizontal: 16, paddingBottom: 12 }]}>
                <TouchableOpacity style={tps.btnOutline} onPress={() => navigation.goBack()}>
                    <Text style={tps.btnOutlineText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={tps.btnPrimary} onPress={handleProceed}>
                    <Text style={tps.btnText}>Click OK to Proceed</Text>
                </TouchableOpacity>
            </View>
            <Footer />
        </View>
    );
};

export default VehicleDetails;
