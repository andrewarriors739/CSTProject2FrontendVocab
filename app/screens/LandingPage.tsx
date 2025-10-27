import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ImageBackground, Alert } from "react-native";
import wordList from "../../assets/advanced_words.json";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../api/apiClient";


const LandingScreen = ({ route }) => {
  const [dailyWord, setDailyWord] = useState(null);
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { userID } = route.params;

  useEffect(() => {
    fetchDailyWord();
  }, []);

  const fetchDailyWord = async () => {
    setLoading(true);
    try {
      const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
      const API_KEY = "your-dictionary-api-key"; // replace with your key
      const API_URL = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${randomWord}?key=${API_KEY}`;

      const response = await fetch(API_URL);
      const data = await response.json();
      const wordDefinition = data[0]?.shortdef?.[0] || "Definition not available.";

      setDailyWord(randomWord);
      setDefinition(wordDefinition);
    } catch (error) {
      setDailyWord("No word available");
      setDefinition("Definition not available.");
    } finally {
      setLoading(false);
    }
  };

  const saveWordToHistory = async () => {
    if (!dailyWord || !definition) return;

    try {
      const response = await apiClient.post("/vocab/history", {
        userID,
        word: dailyWord,
        definition,
      });

      if (response.status === 201) {
        Alert.alert("Word saved to history!");
      } else {
        Alert.alert("Failed to save word to history.");
      }
    } catch (error) {
      Alert.alert("Error saving word", error.message);
    }
  };

  return (
    <ImageBackground source={require("../../assets/images/LP_background.png")} style={styles.background}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate("HomePage")}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Random Vocabulary Word:</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <View style={styles.textBox}>
            <Text style={styles.dailyWord}>{dailyWord}</Text>
            <Text style={styles.definition}>{definition}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.refreshButton} onPress={fetchDailyWord}>
          <Text style={styles.refreshButtonText}>🔄 Refresh Word</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={saveWordToHistory}>
          <Text style={styles.saveButtonText}>✅ Save Word to History</Text>
        </TouchableOpacity>

{/* Add this new button */}
<TouchableOpacity 
  style={styles.addWordButton} 
  onPress={() => navigation.navigate("AddWords")}
>
  <Text style={styles.addWordButtonText}>📝 Add Your Own Word</Text>
</TouchableOpacity>

        {/* ... Add navigation to lists, creation etc, unchanged here ... */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover", width: "100%", height: "100%" },
  overlay: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)", padding: 20,
  },
  logoutButton: { position: "absolute", top: 40, right: 20, backgroundColor: "#d9534f", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  logoutText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#222", marginBottom: 10 },
  textBox: { backgroundColor: "rgba(255, 255, 255, 0.62)", padding: 15, borderRadius: 10, borderWidth: 2, borderColor: "#FFA500", marginVertical: 10, alignItems: "center" },
  dailyWord: { fontSize: 22, fontWeight: "bold", color: "#4CAF50", marginBottom: 5 },
  definition: { fontSize: 18, fontStyle: "italic", fontWeight: "bold", color: "#222", textAlign: "center", paddingHorizontal: 10 },
  refreshButton: { backgroundColor: "#FFA500", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginTop: 10 },
  refreshButtonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  saveButton: { backgroundColor: "#4CAF50", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginTop: 10 },
  saveButtonText: { fontSize: 16, color: "#fff", fontWeight: "bold"}, 
    addWordButton: { 
      backgroundColor: "#2196F3", 
      paddingVertical: 10, 
      paddingHorizontal: 20, 
      borderRadius: 8, 
      marginTop: 10 
    },
    addWordButtonText: { 
      fontSize: 16, 
      color: "#fff", 
      fontWeight: "bold" 
    },
});

export default LandingScreen;
