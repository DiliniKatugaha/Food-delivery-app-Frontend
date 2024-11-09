import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Header from '../../Components/Header';

const ProfileScreen = () => {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    status: '',
    contact: '',
    hostel: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('Retrieved token:', token);

        if (!token) throw new Error('No token found. Please log in again.');

        const response = await axios.get('http://192.168.8.100:5000/customer/profile', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        console.log('Response from backend:', response.data);

        if (response.data) {
          setUserDetails({
            username: response.data.username, 
            email: response.data.email,
            status: response.data.status,
            contact: response.data.contact,
            hostel: response.data.hostel,
            address: response.data.address,
          });
        }
      } catch (error) {
        console.error('Error fetching customer details:', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, []);

  const handleInputChange = (field, value) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSaveProfile = async () => {
    if (!validateEmail(userDetails.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No token found. Please log in again.');

      setIsSaving(true);

      await axios.put('http://192.168.8.100:5000/customer/profile', userDetails, {  
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
      <Header title="My Profile" />
      <View style={styles.formContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={userDetails.username}
          onChangeText={(text) => handleInputChange('name', text)}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={userDetails.email}
          onChangeText={(text) => handleInputChange('email', text)}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Status</Text>
        <TextInput
          style={styles.input}
          value={userDetails.status}
          onChangeText={(text) => handleInputChange('status', text)}
        />

        <Text style={styles.label}>Contact Number</Text>
        <TextInput
          style={styles.input}
          value={userDetails.contact}
          onChangeText={(text) => handleInputChange('contact', text)}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Hostel</Text>
        <TextInput
          style={styles.input}
          value={userDetails.hostel}
          onChangeText={(text) => handleInputChange('hostel', text)}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={userDetails.address}
          onChangeText={(text) => handleInputChange('address', text)}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveProfile}
          disabled={isSaving}  
        >
          <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  formContainer: {
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
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
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

export default ProfileScreen;
