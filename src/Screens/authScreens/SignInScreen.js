import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { colors } from "../../global/Styles";
import Header from "../../Components/Header";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

function SignInScreen() {
  const [signinData, setSigninData] = useState({
    email: '',
    password: ''
  });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation();

  const handleValues = (name, value) => {
    setSigninData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://192.168.8.100:5000/user/signin/signinDetails', signinData);
      const { token, role } = response.data;
  
      // Store JWT token in AsyncStorage
      await AsyncStorage.setItem('userToken', token);
  
      // Check the role and navigate accordingly
      if (role === 'Customer') {
        navigation.navigate("CustomerHomePage");
      } else if (role === 'Restaurateur') {
        navigation.navigate("RestaurantHomePage");
      } else {
        Alert.alert('Error', 'Unknown role!');
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
        console.error('Error Response Headers:', error.response.headers);
      } else if (error.request) {
        // Request was made but no response received
        console.error('Error Request:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Error Message:', error.message);
      }
      Alert.alert('Error', 'Email or Password is incorrect. Please try again!');
    }
  };
  

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.signIn}>
      <Header title="Easy Eats" type="arrow-left" />
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Sign In</Text>
        </View>
        <View>
          <Text style={styles.text1}>Please enter your email and password!</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={signinData.email}
          onChangeText={(value) => handleValues('email', value)}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            secureTextEntry={secureTextEntry}
            value={signinData.password}
            onChangeText={(value) => handleValues('password', value)}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon
              name={secureTextEntry ? 'eye-off' : 'eye'}
              type="feather"
              color="#4CAF50"
              size={22}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUpSelection')}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  signIn: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text1: {
    color: colors.grey3,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#4CAF50', 
  },
  input: {
    height: 40,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F8F8F8', 
  },
  button: {
    backgroundColor: '#4CAF50', 
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    height: 40,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  iconStyle: {
    marginLeft: 220,
    marginTop: 8,
  },
});

export default SignInScreen;
