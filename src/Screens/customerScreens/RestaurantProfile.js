import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import Header from '../../Components/Header';
import MenuList from './MenuList';
import FeedbackList from './FeedbackList';

const RestaurantProfileScreen = ({ route }) => {
  const { restaurant } = route.params; // Get restaurant data from route params
  const [activeTab, setActiveTab] = useState('menu');
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch and format menu and price data
  const fetchMenuData = async () => {
    try {
      setLoading(true);

      // Fetch menu items and prices
      const menuData = await fetchMenuItems(restaurant.id);
      const categoryPrices = await fetchCategoryPrices(restaurant.id);

      // Merge prices with menu items
      const formattedMenu = menuData.map(item => {
        const itemPrices = categoryPrices.find(cat => cat.menuId === item.id)?.prices || {};
        return {
          ...item,
          prices: itemPrices,
        };
      });

      setMenu(formattedMenu);
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchMenuData();
  }, []);

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
      <ScrollView>
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
        ) : activeTab === 'menu' ? (
          <MenuList menu={menu} />
        ) : (
          <FeedbackList feedbacks={restaurant.feedbacks || []} />
        )}
      </ScrollView>
    </View>
  );
};

RestaurantProfileScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      restaurant: PropTypes.shape({
        id: PropTypes.number.isRequired,
        username: PropTypes.string.isRequired,
        logo: PropTypes.string,
        deliveryFee: PropTypes.string.isRequired,
        contact: PropTypes.string.isRequired,
        openHours: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        feedbacks: PropTypes.array.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  restaurantHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 16,
  },
  placeholderLogo: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#ddd', // Placeholder color
    marginRight: 16,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  tabButton: {
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#28a745',
  },
  tabText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default RestaurantProfileScreen;
