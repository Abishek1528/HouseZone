import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import signupStyles from '../styles/signupStyles';
import categoryContentStyles from '../styles/categoryContentStyles';

export default function Signup() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSignup = async () => {
    // Basic validation
    if (!name || !age || !contact || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const response = await fetch('http://10.86.202.103:3000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          age: parseInt(age),
          contact,
          email,
          password
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "User registered successfully!", [
          { text: "OK", onPress: () => navigation.navigate("Home") }
        ]);
      } else {
        Alert.alert("Error", result.message || "Signup failed");
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert("Error", "Failed to connect to server");
    }
  };

  return (
    <View style={signupStyles.container}>
      <View style={categoryContentStyles.formContainer}>
        <Text style={categoryContentStyles.formTitle}>Signup</Text>
        <Text style={categoryContentStyles.label}>Name</Text>
        <TextInput
          style={categoryContentStyles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <Text style={categoryContentStyles.label}>Age</Text>
        <TextInput
          style={categoryContentStyles.input}
          placeholder="Age"
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
        />
        <Text style={categoryContentStyles.label}>Contact Number</Text>
        <TextInput
          style={categoryContentStyles.input}
          placeholder="Contact Number"
          keyboardType="phone-pad"
          value={contact}
          onChangeText={setContact}
        />
        <Text style={categoryContentStyles.label}>Email</Text>
        <TextInput
          style={categoryContentStyles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
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
          onPress={handleSignup}
        >
          <Text style={categoryContentStyles.buttonText}>Signup</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 15, flexDirection: "row", justifyContent: 'center' }}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: "blue" }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}