import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation, RouteProp, NavigationProp } from "@react-navigation/native";
import apiClient from "../api/apiClient";
import { RootStackParamList, Word } from "../navigation/types";

type PickListRoute = RouteProp<RootStackParamList, "PickList">;
type List = { id: number; name: string };

export default function PickList({ route }: { route: PickListRoute }) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { userID, currentWord } = route.params;
  const [loading, setLoading] = useState(true);
  const [vocabLists, setVocabLists] = useState<List[]>([]);
  const [selectedID, setSelectedID] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await apiClient.get<List[]>(`/api/users/${userID}/lists`);
        setVocabLists(data);
      } catch (e) {
        Alert.alert("Error", "Failed to load lists");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userID]);

  const addToList = async (listId: number) => {
  try {
    // Option A
    const res = await apiClient.put(`/api/users/${userID}/lists/${listId}/items/${currentWord.id}`);

    // axios is fine with 204 (no content)
    if (res.status === 201) {
      Alert.alert("Saved!", `Added "${currentWord.term}" to the list.`);
    } else if (res.status === 204) {
      Alert.alert("Already there", `"${currentWord.term}" was already in this list.`);
    } else {
      Alert.alert("Done", "Request completed.");
    }
    navigation.goBack();
  } catch (e: any) {
    Alert.alert("Error", e?.message ?? "Failed to save word to list");
  }
};


  return (
    <SafeAreaProvider>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>&#8249;- Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Select List to Add “{currentWord.term}”</Text>
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
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
              const isSelected = item.id === selectedID;
              return (
                <TouchableOpacity
                  style={[styles.item, { backgroundColor: isSelected ? "#aed6f1" : "#5dade2" }]}
                  onPress={() => {
                    setSelectedID(item.id);
                    addToList(item.id);
                  }}
                >
                  <Text style={[styles.listName, { color: isSelected ? "black" : "white" }]}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, backgroundColor: "white", borderBottomColor: '#ddd', justifyContent: 'space-between' },
  backButton: { padding: 8 }, backButtonText: { color: "blue" },
  titleContainer: { flex: 1, alignItems: 'center' }, title: { textAlign: "center", fontSize: 18, fontWeight: 'bold' },
  rightContent: { width: 50, alignItems: 'flex-end' },
  container: { flex: 1, paddingHorizontal: 16 },
  noListsText: { textAlign: "center", color: "#888", fontSize: 16, marginTop: 16 },
  item: { padding: 20, marginVertical: 8, marginHorizontal: 5 },
  listName: { fontSize: 20, fontWeight: "bold" },
});
