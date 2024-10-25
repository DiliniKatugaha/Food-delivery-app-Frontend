import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

function CustomerSignUp() {
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    status: "",
    contact: "",
    hostel: "",
    address: "",
    password: ""
  });

  const navigation = useNavigation(); // Moved to the top

  const handleValues = (name, value) => {
    setSignupData((prev) => ({ ...prev, [name]: value }));
    console.log(signupData);
  };

  const handleSignUp = () => {
    axios.post('http://192.168.8.100:5000/user/customer/CustomerData', signupData)
      .then(() => {
        setSignupData({
          username: "",
          email: "",
          status: "",
          contact: "",
          hostel: "",
          address: "",
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
      <Text style={styles.title}>Sign Up as Customer</Text>

      <TextInput
        style={styles.input}
        onChangeText={text => handleValues('username', text)}
        placeholder="Name"
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
        onChangeText={text => handleValues('status', text)}
        placeholder="University Student, University Staff, Other"
        placeholderTextColor="#999"
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
        onChangeText={text => handleValues('hostel', text)}
        placeholder="Hostel Name (If university student)"
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        onChangeText={text => handleValues('address', text)}
        placeholder="Address"
        placeholderTextColor="#999"
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
        <Text style={styles.link}>Already Registered? Sign In</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#4CAF50',
  },
  input: {
    backgroundColor: '#F9F9F9',
    paddingVertical: 8,
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

export default CustomerSignUp;
