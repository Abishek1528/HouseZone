import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import loginStyles from '../styles/loginStyles';
import categoryContentStyles from '../styles/categoryContentStyles';

export default function Login() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    // Basic validation
    if (!name || !phone || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const response = await fetch('http://10.86.202.103:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          contact: phone,
          password
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Login successful!", [
          { text: "OK", onPress: () => navigation.navigate("Home") }
        ]);
      } else {
        Alert.alert("Error", result.message || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert("Error", "Failed to connect to server");
    }
  };

  return (
    <View style={loginStyles.container}>
      <View style={categoryContentStyles.formContainer}>
        <Text style={categoryContentStyles.formTitle}>Login</Text>
        <Text style={categoryContentStyles.label}>Name</Text>
        <TextInput
          style={categoryContentStyles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <Text style={categoryContentStyles.label}>Phone Number</Text>
        <TextInput
          style={categoryContentStyles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <Text style={categoryContentStyles.label}>Password</Text>  
        <TextInput
          style={categoryContentStyles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          style={[categoryContentStyles.button, categoryContentStyles.primaryButton]} 
          onPress={handleLogin}
        >
          <Text style={categoryContentStyles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 15, flexDirection: "row", justifyContent: 'center' }}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={{ color: "blue" }}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}