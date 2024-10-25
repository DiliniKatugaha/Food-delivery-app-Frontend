import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import PropTypes from 'prop-types';

const MenuList = ({ menu }) => {
  const [cart, setCart] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleIncrement = (item, option) => {
    const itemId = `${item.id}_${option}`; // Unique identifier for each menu item option
    const updatedCart = { ...cart };

    if (updatedCart[itemId]) {
      updatedCart[itemId].quantity += 1;
    } else {
      updatedCart[itemId] = {
        ...item,
        option,
        price: item.prices[option],
        quantity: 1,
      };
    }

    setCart(updatedCart);
    calculateTotal(updatedCart);
  };

  const handleDecrement = (item, option) => {
    const itemId = `${item.id}_${option}`;
    const updatedCart = { ...cart };

    if (updatedCart[itemId] && updatedCart[itemId].quantity > 0) {
      updatedCart[itemId].quantity -= 1;
      if (updatedCart[itemId].quantity === 0) {
        delete updatedCart[itemId];
      }
      setCart(updatedCart);
      calculateTotal(updatedCart);
    }
  };

  const calculateTotal = (cart) => {
    let totalItems = 0;
    let totalPrice = 0;

    Object.values(cart).forEach((item) => {
      totalItems += item.quantity;
      totalPrice += item.quantity * item.price;
    });

    setTotalItems(totalItems);
    setTotalPrice(totalPrice);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.menuList}>
        {menu.length === 0 ? (
          <Text>No menu items available</Text>
        ) : (
          menu.map((item) => (
            <View key={item.id} style={styles.menuItem}>
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.menuItemImage} />
              )}
              <View style={styles.menuItemDetails}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                {Object.keys(item.prices).map((option) => (
                  <View key={option} style={styles.optionRow}>
                    <Text style={styles.optionText}>
                      {option}: Rs.{item.prices[option]}
                    </Text>
                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleDecrement(item, option)}
                      >
                        <Text style={styles.buttonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>
                        {cart[`${item.id}_${option}`]?.quantity || 0}
                      </Text>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleIncrement(item, option)}
                      >
                        <Text style={styles.buttonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.orderSummary}>
        <Text style={styles.orderSummaryText}>My Picks</Text>
        <Text style={styles.orderSummaryItems}>Items: {totalItems}</Text>
        <Text style={styles.orderSummaryTotal}>Total: Rs.{totalPrice}</Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// PropTypes to validate props
MenuList.propTypes = {
  menu: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
      prices: PropTypes.objectOf(PropTypes.number).isRequired,
    })
  ).isRequired,
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuList: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 16,
  },
  menuItemDetails: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  optionText: {
    fontSize: 16,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  orderSummary: {
    padding: 16,
    backgroundColor: '#28a745',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderSummaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderSummaryItems: {
    color: '#fff',
    fontSize: 16,
  },
  orderSummaryTotal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  checkoutButtonText: {
    color: '#28a745',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MenuList;
