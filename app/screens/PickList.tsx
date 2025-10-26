import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../api/apiClient";

export default function PickList({ route }) {
  const navigation = useNavigation();
  const { userID, vocabHistoryID, dailyWord, definition } = route.params;
  const [vocabLists, setVocabLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedID, setSelectedID] = useState<number | null>(null);

  useEffect(() => {
    const loadVocabLists = async () => {
      try {
        const response = await apiClient.get(`/vocabLists?userID=${userID}`);
        // filter out vocabHistoryID locally
        const filteredLists = response.data.filter(
          (list) => list.listID !== vocabHistoryID
        );
        setVocabLists(filteredLists);
      } catch (error) {
        Alert.alert("Error loading vocab lists", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadVocabLists();
  }, [userID, vocabHistoryID]);

  const saveWordToList = async (chosenID) => {
    try {
      const responseCheck = await apiClient.get(
        `/wordInList/check?userID=${userID}&listID=${chosenID}&word=${dailyWord}`
      );
      if (responseCheck.data.exists) {
        Alert.alert(`This word is already in the list!`);
        return;
      }
      const response = await apiClient.post(`/wordInList`, {
        userID,
        listID: chosenID,
        word: dailyWord,
        definition,
      });

      if (response.status === 201) {
        Alert.alert(`Word saved to list!`);
      } else {
        Alert.alert("Failed to save word.");
      }
    } catch (error) {
      Alert.alert("Error saving word:", error.message);
    }
  };

  const renderItem = ({ item }) => {
    const backgroundColor = item.listID === selectedID ? "#aed6f1" : "#5dade2";
    const color = item.listID === selectedID ? "black" : "white";

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedID(item.listID);
          saveWordToList(item.listID);
          navigation.goBack();
        }}
        style={[styles.item, { backgroundColor }]}
      >
        <Text style={[styles.listName, { color }]}>{item.listName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹- Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Select List to Add "{dailyWord}"</Text>
        </View>
        <View style={styles.rightContent} />
      </View>

      <SafeAreaView style={styles.container}>
        {loading ? (
          <Text>Loading Vocab Lists...</Text>
        ) : vocabLists.length === 0 ? (
          <Text style={styles.noListsText}>No Created Vocab Lists Found</Text>
        ) : (
          <FlatList
            data={vocabLists}
            renderItem={renderItem}
            keyExtractor={(item) => item.listID.toString()}
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
  title: { textAlign: "center", fontSize: 18, fontWeight: "bold" },
  rightContent: { width: 50, alignItems: "flex-end" },
  container: { flex: 1, paddingHorizontal: 16 },
  noListsText: { textAlign: "center", color: "#888", fontSize: 16 },
  item: { padding: 20, marginVertical: 8, marginHorizontal: 5 },
  listName: { fontSize: 25, fontWeight: "bold" },
});
