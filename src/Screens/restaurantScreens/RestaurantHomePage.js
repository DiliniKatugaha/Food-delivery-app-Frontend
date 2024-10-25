import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../Components/Header';

// Example home screen for the restaurateur
function RestaurantHomePage() {
  const navigation = useNavigation();

  // Assuming you pass the restaurant logo as a prop or fetch it from a profile API
  // const restaurantLogo = require('../assets/restaurant-logo.png'); // Replace with dynamic image

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleAddMenuPress = () => {
    navigation.navigate('AddMenu');
  };

  const handleViewOrdersPress = () => {
    navigation.navigate('OrderItems');
  };

  const handleViewMenuPress = () => {
    navigation.navigate('ViewMenu');
  };

  const handleViewFeedbacksPress = () => {
    navigation.navigate('FeedbackScreen');
  };

  return (
    <View style = {styles.home}>
              <Header title="My Account" type="arrow-left" />

            <View style={styles.container}>
                {/* Display the restaurant logo */}
                {/* <Image source={restaurantLogo} style={styles.logo} /> */}

                {/* Render the buttons */}
                <TouchableOpacity style={styles.button} onPress={handleProfilePress}>
                    <Text style={styles.buttonText}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleAddMenuPress}>
                    <Text style={styles.buttonText}>Add Menu</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleViewOrdersPress}>
                    <Text style={styles.buttonText}>View Orders</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleViewMenuPress}>
                    <Text style={styles.buttonText}>View Menu</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleViewFeedbacksPress}>
                    <Text style={styles.buttonText}>View Feedbacks</Text>
                </TouchableOpacity>
            </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  home: {
    flex: 1,
    backgroundColor: '#fff',
  },

  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
    resizeMode: 'contain', // Ensure the logo maintains its aspect ratio
  },
  button: {
    backgroundColor: '#4CAF50', // Green color for the buttons
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default RestaurantHomePage;
