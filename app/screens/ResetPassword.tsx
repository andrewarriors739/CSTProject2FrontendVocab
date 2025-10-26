import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import apiClient from "../api/apiClient";

export default function ResetPassword() {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async () => {
    if (!newPassword) {
      Alert.alert("Error", "Password cannot be empty.");
      return;
    }
    try {
      const response = await apiClient.put(`/users/reset-password`, {
        email,
        newPassword,
      });
      if (response.status === 200) {
        Alert.alert("Success", "Your password has been reset.");
        navigation.navigate("HomePage");
      } else {
        Alert.alert("Failed to reset password.");
      }
    } catch (error) {
      Alert.alert("Error resetting password", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter new password"
      />
      <Button title="Complete Reset" onPress={handleResetPassword} color="#FF5733" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#adba95", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
