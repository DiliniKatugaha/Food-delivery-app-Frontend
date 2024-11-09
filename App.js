import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from "./src/Screens/authScreens/SignInScreen";
import { colors } from "./src/global/Styles";
import RestaurantSignUp from "./src/Screens/restaurantScreens/RestaurantSignUp";
import SignUpSelection from "./src/Screens/authScreens/SignUpSelection";
import CustomerSignUp from "./src/Screens/customerScreens/CustomerSignUp";
import RestaurantHomePage from "./src/Screens/restaurantScreens/RestaurantHomePage";
import CustomerHomePage from "./src/Screens/customerScreens/CustomerHomePage";
import RestaurantProfileScreen from "./src/Screens/customerScreens/RestaurantProfile";
import ProfileScreen from "./src/Screens/customerScreens/ProfileScreen";
import MenuList from "./src/Screens/customerScreens/MenuList";
import FeedbackList from "./src/Screens/customerScreens/FeedbackList";
import Profile from "./src/Screens/restaurantScreens/Profile";
import AddMenu from "./src/Screens/restaurantScreens/AddMenu";
import ViewMenu from "./src/Screens/restaurantScreens/ViewMenu";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={colors.statusbar} />
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RestaurantSignUp" component={RestaurantSignUp} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpSelection" component={SignUpSelection} options={{ headerShown: false }} />
        <Stack.Screen name="CustomerSignUp" component={CustomerSignUp} options={{ headerShown: false }} /> 
        <Stack.Screen name="RestaurantHomePage" component={RestaurantHomePage} options={{ headerShown: false }} />
        <Stack.Screen name="CustomerHomePage" component={CustomerHomePage} options={{ headerShown: false }} />
        <Stack.Screen name="RestaurantProfile" component={RestaurantProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MenuList" component={MenuList} options={{ headerShown: false }} />
        <Stack.Screen name="FedbackList" component={FeedbackList} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="AddMenu" component={AddMenu} options={{ headerShown: false }} />
        <Stack.Screen name="ViewMenu" component={ViewMenu} options={{ headerShown: false }} />



      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;
