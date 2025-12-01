import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import signupStyles from '../styles/signupStyles';

export default function Signup() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  return (
    <View style={signupStyles.container}>
      <Text style={signupStyles.title}>Signup</Text>
      <Text style={signupStyles.label}>Name</Text>
      <TextInput
        style={signupStyles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <Text style={signupStyles.label}>Age</Text>
      <TextInput
        style={signupStyles.input}
        placeholder="Age"
        keyboardType="number-pad"
        value={age}
        onChangeText={setAge}
      />
      <Text style={signupStyles.label}>Contact Number</Text>
      <TextInput
        style={signupStyles.input}
        placeholder="Contact Number"
        keyboardType="phone-pad"
        value={contact}
        onChangeText={setContact}
      />
      <Text style={signupStyles.label}>Email</Text>
      <TextInput
        style={signupStyles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={signupStyles.label}>Password</Text>
      <TextInput
        style={signupStyles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Signup" onPress={() => navigation.navigate("Home")} />

      <View style={{ marginTop: 15, flexDirection: "row" }}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={{ color: "blue" }}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}