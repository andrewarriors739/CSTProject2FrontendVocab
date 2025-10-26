import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../apiClient";

export default function CreateAccount() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");

  const handleSignUp = async () => {
    if (!email || !password || !securityQuestion || !securityAnswer) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await apiClient.post("/users", {
        email,
        password,
        securityQuestion,
        securityAnswer,
      });
      if (response.status === 201) {
        Alert.alert("Success", "Account created. Please log in.");
        navigation.navigate("LoginPage");
      } else {
        Alert.alert("Error", "Sign up failed.");
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Unknown error.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Security Question"
        value={securityQuestion}
        onChangeText={setSecurityQuestion}
      />
      <TextInput
        style={styles.input}
        placeholder="Security Answer"
        value={securityAnswer}
        onChangeText={setSecurityAnswer}
      />
      <Button title="Sign Up" onPress={handleSignUp} color="#2196F3" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
