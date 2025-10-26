import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../apiClient";

export default function LoginPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      if (response.status === 200) {
        const { token, userID } = response.data;
        // Store token securely, e.g. AsyncStorage (not shown here)
        navigation.navigate("LandingPage", { userID });
      } else {
        Alert.alert("Login Failed", "Invalid credentials.");
      }
    } catch (error) {
      Alert.alert("Login Failed", error.response?.data?.message || error.message || "Unknown error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Log In" onPress={handleLogin} color="#FF5733" />
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={{color: "blue", marginTop: 10}}>Forgot/Reset Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#adba95", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "80%", height: 40, borderColor: "#ccc", borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 10 },
});
