import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { fetchUserCredentials } from "../database";


const HomeScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const user = await fetchUserCredentials(username);

      if (user) {
        if (user.password === password) {
          if (user.role === 'owner') {
            // Navigate to OwnerFirstPage
            navigation.navigate('OwnerFirstPage');
          } else if (user.role === 'employee') {
            // Navigate to EmployeeFirstPage
            navigation.navigate('EmployeeFirstPage');
          } else {
            Alert.alert('Error', 'Role not recognized');
          }
        } else {
          Alert.alert('Error', 'Incorrect password');
        }
      } else {
        Alert.alert('Error', 'User not found');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'An error occurred during login');
    }
  };



  return (
    <LinearGradient
      colors={['#252F40', '#3b5998', '#4682b4']}
      style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <TextInput
      style={styles.input}
      placeholder="Username"
      placeholderTextColor="white"
      value={username}
      onChangeText={setUsername}
      />
      <TextInput
      style={styles.input}
      placeholder="Password"
      placeholderTextColor="white"
      value={password}
      onChangeText={setPassword}>
      </TextInput>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttontext}>Login</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: 'coral',
    height: 40,
    width: '60%',
  },
  buttontext: {
    color: 'white',
    fontSize: 20,
  },
  container: {
    alignItems: 'center',
    flex:1,
    justifyContent: 'center',
  },
  input: {
    color: 'white',
    backgroundColor: '#55ACEE',
    borderRadius: 5,
    fontSize: 15,
    height: 40,
    marginBottom: 15,
    paddingLeft: 20,
    justifyContent: 'center',
    width: '80%',
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    paddingBottom: 20,
  }
})

export default HomeScreen;
