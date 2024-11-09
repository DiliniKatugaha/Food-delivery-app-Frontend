import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import axios from 'axios';
import Header from '../../Components/Header';
import FeedbackList from './FeedbackList';

const RestaurantProfileScreen = ({ route }) => {
  const { restaurant } = route.params;
  const [activeTab, setActiveTab] = useState('menu');
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenuData();
  }, [restaurant.id]);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://192.168.8.100:5000/items/menus/${restaurant.id}`);
      setMenuItems(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('Menu data not found for this restaurant.');
      } else {
        setError('Error fetching menu data. Please try again later.');
      }
      console.error('Error fetching menu data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const addItemToCart = (item) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[item.id]) {
        newCart[item.id].quantity += 1;
      } else {
        newCart[item.id] = { ...item, quantity: 1 };
      }
      return newCart;
    });
  };

  const removeItemFromCart = (item) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[item.id] && newCart[item.id].quantity > 1) {
        newCart[item.id].quantity -= 1;
      } else {
        delete newCart[item.id];
      }
      return newCart;
    });
  };

  const calculateTotalPrice = () => {
    return Object.values(cart).reduce((total, item) => total + (item.prices.price || 0) * item.quantity, 0);
  };

  if (!restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Restaurant data is unavailable.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={restaurant.username} type="arrow-left" />
      <View style={styles.restaurantHeader}>
        {restaurant.logo ? (
          <Image source={{ uri: restaurant.logo }} style={styles.restaurantImage} />
        ) : (
          <View style={styles.placeholderLogo} />
        )}
        <View style={styles.restaurantDetails}>
          <Text style={styles.restaurantName}>{restaurant.username}</Text>
          <Text>Delivery Fee: {restaurant.deliveryFee || 'N/A'}</Text>
          <Text>Contact: {restaurant.contact}</Text>
          <Text>Open Hours: {restaurant.openHours}</Text>
          <Text>Address: {restaurant.address}</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'menu' ? styles.activeTab : null]}
          onPress={() => setActiveTab('menu')}
        >
          <Text style={styles.tabText}>All Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'feedback' ? styles.activeTab : null]}
          onPress={() => setActiveTab('feedback')}
        >
          <Text style={styles.tabText}>Feedbacks</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#28a745" style={styles.loadingIndicator} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : activeTab === 'menu' ? (
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.menuItemContainer}>
              <Image source={{ uri: item.image }} style={styles.menuImage} />
              <View style={styles.menuDetails}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuDescription}>{item.details}</Text>
                <Text style={styles.menuPrice}>Rs. {item.prices?.price}</Text>
                <TouchableOpacity onPress={() => addItemToCart(item)}>
                  <Text style={styles.addToCart}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <FeedbackList feedbacks={restaurant.feedbacks || []} />
      )}
    </View>
  );
};

RestaurantProfileScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      restaurant: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  restaurantHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  placeholderLogo: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  restaurantDetails: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#28a745',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  menuItemContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  menuDetails: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  menuName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  listContainer: {
    paddingBottom: 20,
  },
  addToCart: {
    color: '#28a745',
    fontWeight: 'bold',
  },
});

export default RestaurantProfileScreen;
