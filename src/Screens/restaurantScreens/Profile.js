import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Header from '../../Components/Header';

const Profile = () => {
    const [profileData, setProfileData] = useState({
        restaurantName: '',
        ownerName: '',
        contact: '',
        openHours: '',
        deliveryPlaces: '',
        address: '',
        email: '',
    });
    const [loading, setLoading] = useState(true);
    const [logoUri, setLogoUri] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                console.log("Token from AsyncStorage:", token); // Debugging log
                if (!token) throw new Error('No token found');

                const response = await axios.get('http://192.168.8.100:5000/restaurant/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                console.log("Response from backend:", response.data); // Debugging log

                if (response.data) {
                    // Mapping response data to profileData state
                    setProfileData({
                        restaurantName: response.data.username,
                        ownerName: response.data.ownername,
                        contact: response.data.contact,
                        openHours: response.data.openHours,
                        deliveryPlaces: response.data.deliveryPlaces,
                        address: response.data.address,
                        email: response.data.email,
                    });

                    // Handle logo
                    if (response.data.logo && response.data.logo.data) {
                        // Convert the Buffer to a Base64 string
                        const base64Logo = response.data.logo.data.reduce((data, byte) => data + String.fromCharCode(byte), '');
                        const logoBase64 = `data:image/png;base64,${btoa(base64Logo)}`; // Create data URI
                        setLogoUri(logoBase64); // Set logo URI
                    }
                }
            } catch (error) {
                console.error('Error fetching restaurant profile data:', error);
                Alert.alert('Error', 'Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleInputChange = (field, value) => {
        setProfileData((prev) => ({ ...prev, [field]: value }));
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSaveProfile = async () => {
        if (!validateEmail(profileData.email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        const formData = new FormData();
        formData.append('restaurantName', profileData.restaurantName);
        formData.append('ownerName', profileData.ownerName);
        formData.append('contactNumber', profileData.contact);
        formData.append('openHours', profileData.openHours);
        formData.append('deliveryPlaces', profileData.deliveryPlaces);
        formData.append('address', profileData.address);
        formData.append('email', profileData.email);

        if (logoUri) {
            formData.append('logo', {
                uri: logoUri,
                type: 'image/jpeg',
                name: 'restaurant_logo.jpg',
            });
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('No token found');

            setIsSaving(true);

            await axios.post('http://192.168.8.100:5000/restaurant/updateProfile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'An error occurred while updating the profile. Please try again later.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogoUpload = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const uri = response.assets[0]?.uri;
                if (uri) {
                    setLogoUri(uri);
                }
            }
        });
    };

    if (loading || isSaving) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Header title="Restaurant Profile" />
            <View style={styles.container2}>
                <Text style={styles.label}>Restaurant Name</Text>
                <TextInput
                    style={styles.input}
                    value={profileData.restaurantName}
                    onChangeText={(text) => handleInputChange('restaurantName', text)}
                    placeholder="Restaurant Name"
                    placeholderTextColor="#999"
                />

                <Text style={styles.label}>Add Logo</Text>
                <TouchableOpacity style={styles.logoUploadButton} onPress={handleLogoUpload}>
                    {logoUri ? (
                        <Image source={{ uri: logoUri }} style={styles.logo} />
                    ) : (
                        <Text style={styles.logoPlaceholder}>Upload Logo</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.label}>Owner Name</Text>
                <TextInput
                    style={styles.input}
                    value={profileData.ownerName}
                    onChangeText={(text) => handleInputChange('ownerName', text)}
                    placeholder="Owner Name"
                    placeholderTextColor="#999"
                />

                <Text style={styles.label}>Contact Number</Text>
                <TextInput
                    style={styles.input}
                    value={profileData.contact}
                    onChangeText={(text) => handleInputChange('contact', text)}
                    placeholder="Contact Number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>Open Hours</Text>
                <TextInput
                    style={styles.input}
                    value={profileData.openHours}
                    onChangeText={(text) => handleInputChange('openHours', text)}
                    placeholder="Open Hours"
                    placeholderTextColor="#999"
                />

                <Text style={styles.label}>Delivery Places</Text>
                <TextInput
                    style={styles.input}
                    value={profileData.deliveryPlaces}
                    onChangeText={(text) => handleInputChange('deliveryPlaces', text)}
                    placeholder="Delivery Places"
                    placeholderTextColor="#999"
                />

                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={styles.input}
                    value={profileData.address}
                    onChangeText={(text) => handleInputChange('address', text)}
                    placeholder="Address"
                    placeholderTextColor="#999"
                />

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    value={profileData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    placeholder="Email Address"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                />

                <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    container2: {
        flexGrow: 1,
        padding: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: '#F9F9F9',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    logoUploadButton: {
        height: 150,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        marginBottom: 16,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    logoPlaceholder: {
        color: '#999',
        fontSize: 16,
    },
    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Profile;
