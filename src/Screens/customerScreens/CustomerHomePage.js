import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons'; // For bottom icons
import axios from 'axios'; // To fetch data
import ProfileScreen from './ProfileScreen';

const CustomerHomeScreen = ({ navigation }) => { // Add navigation prop
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchRestaurantDetails();
  }, []);

  // Fetch restaurant details from server
  const fetchRestaurantDetails = async () => {
    try {
      const response = await axios.get('http://192.168.8.100:5000/restaurateur/restaurateurDetails/getDetails');
      const restaurateurData = response.data;
      if (Array.isArray(restaurateurData)) {
        setRestaurants(restaurateurData);
        setFilteredRestaurants(restaurateurData); // Set filtered list as well
      } else {
        console.error('Received data is not an array:', restaurateurData);
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      Alert.alert('Error', 'Failed to load restaurant data. Please try again later.');
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = restaurants.filter((item) =>
        item.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants(restaurants);
    }
  };

  // Render each restaurant item
  const renderRestaurant = ({ item }) => (
    <TouchableOpacity 
      style={styles.restaurantContainer} 
      onPress={() => navigation.navigate('RestaurantProfile', { restaurant: item })} // Pass restaurant data to profile
    >
      <Image source={{ uri: item.logo }} style={styles.restaurantImage} />
      <View style={styles.restaurantDetails}>
        <Text style={styles.restaurantName}>{item.username}</Text>
        <Text style={styles.restaurantType}>{item.type}</Text>
        <Text style={styles.restaurantTime}>{item.openHours}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? ( // Show loading indicator
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <>
          <TextInput
            style={styles.searchBar}
            placeholder="Search Restaurants"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <FlatList
            data={filteredRestaurants}
            keyExtractor={(item) => item.res_id.toString()}
            renderItem={renderRestaurant}
            ListEmptyComponent={<Text>No Restaurants Found</Text>}
          />
        </>
      )}
    </View>
  );
};

// Bottom Tab Navigation
const Tab = createBottomTabNavigator();

export default function CustomerHomePage() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={CustomerHomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  restaurantContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  restaurantDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantType: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  restaurantTime: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
