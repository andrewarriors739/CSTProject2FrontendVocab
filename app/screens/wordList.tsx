import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../api/apiClient";

export default function WordListPage({ route }) {
  const navigation = useNavigation();
  const { userID, listID } = route.params;
  const [wordList, setWordList] = useState([]);
  const [listName, setListName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWordList = async () => {
      try {
        const listResp = await apiClient.get(`/vocabLists/${listID}`);
        setListName(listResp.data.listName);

        const wordsResp = await apiClient.get(`/wordInList?userID=${userID}&listID=${listID}`);
        setWordList(wordsResp.data);
      } catch (error) {
        Alert.alert("Error loading words", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadWordList();
  }, [userID, listID]);

  return (
    <SafeAreaProvider>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("VocabListPage", { userID })}>
          <Text style={styles.backButtonText}>‹- Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{listName}</Text>
        </View>
        <View style={styles.rightContent} />
      </View>

      <SafeAreaView style={styles.container}>
        {loading ? (
          <Text>Loading words...</Text>
        ) : wordList.length === 0 ? (
          <Text style={styles.noWordsText}>No words added yet</Text>
        ) : (
          <FlatList
            data={wordList}
            renderItem={({ item }) => (
              <View style={styles.wordItem}>
                <Text style={styles.word}>{item.word}</Text>
                <Text style={styles.definition}>{item.definition}</Text>
              </View>
            )}
            keyExtractor={(item) => item.wordID.toString()}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    backgroundColor: "white",
    borderBottomColor: "#ddd",
    justifyContent: "space-between",
  },
  backButton: { padding: 8 },
  backButtonText: { color: "blue" },
  titleContainer: { flex: 1, alignItems: "center" },
  title: { fontSize: 18, fontWeight: "bold" },
  rightContent: { width: 50, alignItems: "flex-end" },
  container: { flex: 1, paddingHorizontal: 16 },
  noWordsText: { textAlign: "center", color: "#888", fontSize: 16 },
  wordItem: { padding: 10, marginVertical: 5, backgroundColor: "#e8e8e8", borderRadius: 5 },
  word: { fontSize: 18, fontWeight: "bold" },
  definition: { fontSize: 16, fontStyle: "italic" },
});

