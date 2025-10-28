// app/screens/LandingPage.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Alert,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import apiClient from "../api/apiClient";
import { RootStackParamList } from "../navigation/types";

type Word = { id: number; term: string; definition: string };

export default function LandingScreen({ route }: { route: any }) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { userID } = route.params;

  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRandomFromBackend();
  }, []);

  const fetchRandomFromBackend = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get<Word>("/api/words/random");
      setCurrentWord(data);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to load random word");
      setCurrentWord(null);
    } finally {
      setLoading(false);
    }
  };

  const saveWordToHistory = async () => {
    if (!currentWord) return;
    try {
      const res = await apiClient.post("/vocab/history", {
        userID,
        word: currentWord.term,
        definition: currentWord.definition,
      });
      if (res.status === 201) Alert.alert("Saved to history!");
      else Alert.alert("Failed to save to history.");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to save word");
    }
  };

  const goPickList = () => {
    if (!currentWord) return;
    navigation.navigate("PickList", { userID, currentWord });
  };

  return (
    <ImageBackground
      source={require("../../assets/images/LP_background.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate("HomePage")}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Random Vocabulary Word:</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : currentWord ? (
          <View style={styles.textBox}>
            <Text style={styles.dailyWord}>{currentWord.term}</Text>
            <Text style={styles.definition}>{currentWord.definition}</Text>
          </View>
        ) : (
          <View style={styles.textBox}>
            <Text style={styles.dailyWord}>No word available</Text>
            <Text style={styles.definition}>Definition not available.</Text>
          </View>
        )}

        <TouchableOpacity style={styles.refreshButton} onPress={fetchRandomFromBackend}>
          <Text style={styles.refreshButtonText}>🔄 Refresh Word</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={saveWordToHistory}>
          <Text style={styles.saveButtonText}>✅ Save Word to History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={goPickList}>
          <Text style={styles.saveButtonText}>📚 Save to Existing Vocab List</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addWordButton}
          onPress={() => navigation.navigate("AddWords")}
        >
          <Text style={styles.addWordButtonText}>📝 Add Your Own Word</Text>
        </TouchableOpacity>

        {/* NEW: View lists */}
        <TouchableOpacity
          style={[styles.addWordButton, { backgroundColor: "#FFA500" }]}
          onPress={() => navigation.navigate("VocabListPage", { userID })}
        >
          <Text style={styles.addWordButtonText}>📁 View Your Vocab Lists</Text>
        </TouchableOpacity>

        {/* NEW: Create list */}
        <TouchableOpacity
          style={[styles.addWordButton, { backgroundColor: "#77afdd" }]}
          onPress={() => navigation.navigate("ListCreation", { userID })}
        >
          <Text style={styles.addWordButtonText}>✨ Create New List</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover", width: "100%", height: "100%" },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 20,
  },
  logoutButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#d9534f",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#222", marginBottom: 10 },
  textBox: {
    backgroundColor: "rgba(255, 255, 255, 0.62)",
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFA500",
    marginVertical: 10,
    alignItems: "center",
  },
  dailyWord: { fontSize: 22, fontWeight: "bold", color: "#4CAF50", marginBottom: 5 },
  definition: { fontSize: 18, fontStyle: "italic", fontWeight: "bold", color: "#222", textAlign: "center", paddingHorizontal: 10 },
  refreshButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  refreshButtonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  addWordButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  addWordButtonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
});
