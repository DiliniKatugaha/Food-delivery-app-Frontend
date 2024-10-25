// src/Screens/restaurantScreens/ViewMenu.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewMenu = () => {
    const [menus, setMenus] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get('http://192.168.8.100:5000/items/menu', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMenus(response.data);
        } catch (error) {
            console.error('Error fetching menus:', error);
            Alert.alert('Error', 'Failed to fetch menus.');
        }
    };

    const handleEditMenu = (menu) => {
        navigation.navigate('AddMenu', { menu });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Menus</Text>
            <FlatList
                data={menus}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.menuItem}>
                        <Text style={styles.menuName}>{item.name}</Text>
                        <TouchableOpacity onPress={() => handleEditMenu(item)}>
                            <Text style={styles.editButton}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    menuItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    menuName: {
        fontSize: 18,
    },
    editButton: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
});

export default ViewMenu;
