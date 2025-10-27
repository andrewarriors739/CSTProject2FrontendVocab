import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";


const BASE_URL = 'https://group6-backend-717076585089.herokuapp.com';
// For local testing on emulator: use 'http://10.0.2.2:8080'
export default function AddWords() {
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const navigation = useNavigation();
  const addWord = async () => {
    if (!term.trim() || !definition.trim()) {
      Alert.alert("Missing Fields", "Please fill in both term and definition.");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term, definition }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Request failed: ${res.status}`);
      }
      const saved = await res.json();
      Alert.alert("Success", `Added "${saved.term}" successfully!`);
      setTerm("");
      setDefinition("");
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to add word.");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Word</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a word"
        value={term}
        onChangeText={setTerm}
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Enter its definition"
        value={definition}
        multiline
        onChangeText={setDefinition}
      />
      <TouchableOpacity style={styles.button} onPress={addWord}>
        <Text style={styles.buttonText}>➕ Add Word</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#777" }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>⬅️ Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  textarea: { height: 120, textAlignVertical: "top" },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
});