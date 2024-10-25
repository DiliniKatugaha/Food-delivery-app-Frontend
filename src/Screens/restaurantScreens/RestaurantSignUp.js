import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

function RestaurantSignUp() {
  const [signupData, setSignupData] = useState({
    username: "",
    ownername: "",
    email: "",
    contact: "",
    password: ""
  });

  const handleValues = (name, value) => {
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const navigation = useNavigation();

  const handleSignUp = () => {
    axios.post('http://192.168.8.100:5000/user/restaurant/RestaurantData', signupData)
      .then(() => {
        setSignupData({
          username: "",
          ownername: "",
          email: "",
          contact: "",
          password: ""
        });
        alert('You have signed up successfully! Now enter your email address and password for Sign in!');
        navigation.navigate('SignIn');
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the form. Please try again later.');
      });
  };

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
          <View style={styles.container}>

              <Text style={styles.title}>Sign Up as Restaurateur</Text>

              <TextInput
                style={styles.input}
                onChangeText={text => handleValues('username', text)}
                placeholder="Restaurant Name"
                placeholderTextColor="#999"
              />

              <TextInput
                style={styles.input}
                onChangeText={text => handleValues('ownername', text)}
                placeholder="Owner's Name"
                placeholderTextColor="#999"
              />

              <TextInput
                style={styles.input}
                onChangeText={text => handleValues('email', text)}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
              />

              <TextInput
                style={styles.input}
                onChangeText={text => handleValues('contact', text)}
                placeholder="Phone Number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />

              <TextInput
                style={styles.input}
                onChangeText={text => handleValues('password', text)}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry
              />

              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.link}> Already Registered? Sign In</Text>
              </TouchableOpacity>
</View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#4CAF50',
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
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default RestaurantSignUp;
