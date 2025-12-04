import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import loginStyles from '../styles/loginStyles';
import categoryContentStyles from '../styles/categoryContentStyles';

export default function Login() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

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
          onPress={() => navigation.navigate("Home")}
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