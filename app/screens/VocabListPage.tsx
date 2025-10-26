import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../api/apiClient";

export default function VocabListPage({ route }) {
  const navigation = useNavigation();
  const { userID } = route.params;
  const [vocabLists, setVocabLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const loadVocabLists = async () => {
      try {
        const response = await apiClient.get(`/vocabLists?userID=${userID}`);
        setVocabLists(response.data);
      } catch (error) {
        Alert.alert("Error loading vocab lists", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadVocabLists();
  }, [userID]);

  const renderItem = ({ item }) => {
    const backgroundColor = item.listID === selectedId ? "#aed6f1" : "#5dade2";
    const color = item.listID === selectedId ? "black" : "white";

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedId(item.listID);
          navigation.navigate("WordListPage", { userID, listID: item.listID });
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
          onPress={() => navigation.navigate("LandingPage", { userID })}
        >
          <Text style={styles.backButtonText}>‹- Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Your Vocab Lists</Text>
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
  title: { fontSize: 18, fontWeight: "bold" },
  rightContent: { width: 50, alignItems: "flex-end" },
  container: { flex: 1, paddingHorizontal: 16 },
  noListsText: { textAlign: "center", color: "#888", fontSize: 16 },
  item: { padding: 20, marginVertical: 8, marginHorizontal: 5 },
  listName: { fontSize: 25, fontWeight: "bold" },
});
