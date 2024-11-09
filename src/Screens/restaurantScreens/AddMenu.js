
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Header from '../../Components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddMenu = ({ navigation, route }) => {
  const { menu } = route.params || {};
  
  // Initialize state
  const [name, setName] = useState(menu ? menu.name : '');
  const [image, setImage] = useState(menu ? menu.image : null);
  const [details, setDetails] = useState(menu ? menu.details : '');
  const [categories, setCategories] = useState(menu && menu.categories ? menu.categories : [{ name: '', price: '' }]);
  const [deliveryFee, setDeliveryFee] = useState(menu ? menu.deliveryFee : '');

  useEffect(() => {
    if (menu) {
      setName(menu.name);
      setImage(menu.image);
      setDetails(menu.details);
      setDeliveryFee(menu.deliveryFee);
      setCategories(Array.isArray(menu.categories) && menu.categories.length > 0 ? menu.categories : [{ name: '', price: '' }]);
    }
  }, [menu]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.cancelled) {
      console.log("Image selection was canceled");
      return;
    }

    console.log("Image selected:", result);

    if (result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri; 
        setImage(selectedImageUri);
        console.log("Updated image state:", selectedImageUri); 
    } else {
        console.error("No image assets found");
    }
  };

  const handleCategoryChange = (index, field, value) => {
    const newCategories = [...categories];
    newCategories[index][field] = value;
    setCategories(newCategories);
  };

  const addCategory = () => {
    setCategories([...categories, { name: '', price: '' }]);
  };

  const removeCategory = (index) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
  };

  const handleSubmit = async () => {
    const menuData = {
      name,
      image,
      details,
      categories,
      deliveryFee,
    };

    console.log("Submitting menu data:", menuData);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const url = menu ? `http://192.168.8.100:5000/items/menu/${menu.id}` : 'http://192.168.8.100:5000/items/menu';
      const method = menu ? 'PUT' : 'POST';

      await axios({
        method,
        url,
        data: menuData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Menu saved successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error adding/updating menu: ' + error.message);
    }
  };

  return (
    <ScrollView>
      <Header title="Add Menu" />
      <View style={styles.container}>
        <Text>Name of the food</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter food name"
          value={name}
          onChangeText={setName}
        />

        <Text>Add Picture</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text>Select Image</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text>Add details</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter details"
          value={details}
          onChangeText={setDetails}
        />

        <Text style={styles.subTitle}>Category names</Text>
        {categories.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <TextInput
              style={[styles.input, styles.categoryInput]}
              placeholder={`Category ${index + 1}`}
              value={category.name} 
              onChangeText={(text) => handleCategoryChange(index, 'name', text)}
            />
            <TextInput
              style={[styles.input, styles.categoryInput]}
              placeholder={`Price`}
              keyboardType="numeric"
              value={category.price} 
              onChangeText={(text) => handleCategoryChange(index, 'price', text)}
            />
            <TouchableOpacity onPress={() => removeCategory(index)} style={styles.removeButton}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity onPress={addCategory} style={styles.addButton}>
          <Text style={styles.addText}>+ Add Category</Text>
        </TouchableOpacity>

        <Text>Delivery Fee</Text>
        <TextInput
          style={styles.input}
          placeholder="Rs. 0.00"
          keyboardType="numeric"
          value={deliveryFee}
          onChangeText={setDeliveryFee}
        />

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitText}>Add Menu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  imagePicker: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryInput: {
    flex: 1,
    marginRight: 10,
  },
  removeButton: {
    backgroundColor: '#f00',
    padding: 5,
    borderRadius: 8,
  },
  removeText: {
    color: '#fff',
  },
  addButton: {
    marginBottom: 20,
  },
  addText: {
    color: '#00f',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default AddMenu;
