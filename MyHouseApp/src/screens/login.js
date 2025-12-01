import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import loginStyles from '../styles/loginStyles';

export default function Login() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  return (
    <View style={loginStyles.container}>
      <Text style={loginStyles.title}>Login</Text>
      <Text style={loginStyles.label}>Name</Text>
      <TextInput
        style={loginStyles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <Text style={loginStyles.label}>Phone Number</Text>
      <TextInput
        style={loginStyles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <Text style={loginStyles.label}>Password</Text>  
      <TextInput
        style={loginStyles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={() => navigation.navigate("Home")} />

      <View style={{ marginTop: 15, flexDirection: "row" }}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={{ color: "blue" }}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}