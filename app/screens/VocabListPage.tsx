import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation, RouteProp, NavigationProp } from "@react-navigation/native";
import apiClient from "../api/apiClient";
import { RootStackParamList } from "../navigation/types";

type VocabListRoute = RouteProp<RootStackParamList, "VocabListPage">;
type List = { id: number; name: string };

export default function VocabListPage({ route }: { route: VocabListRoute }) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { userID } = route.params;
  const [loading, setLoading] = useState(true);
  const [vocabLists, setVocabLists] = useState<List[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await apiClient.get<List[]>(`/api/users/${userID}/lists`);
        setVocabLists(data);
      } catch {
        Alert.alert("Error", "Failed to load lists");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userID]);

  return (
    <SafeAreaProvider>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("LandingPage", { userID })}>
          <Text style={styles.backButtonText}>&#8249;- Back</Text>
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
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.item, { backgroundColor: item.id === selectedId ? "#aed6f1" : "#5dade2" }]}
                onPress={() => {
                  setSelectedId(item.id);
                  navigation.navigate("WordListPage", { userID, listID: item.id });
                }}
              >
                <Text style={[styles.listName, { color: item.id === selectedId ? "black" : "white" }]}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, backgroundColor: "white", borderBottomColor: '#ddd', justifyContent: 'space-between' },
  backButton: { padding: 8 }, backButtonText: { color: "blue" },
  titleContainer: { flex: 1, alignItems: 'center' }, title: { fontSize: 18, fontWeight: 'bold' },
  rightContent: { width: 50, alignItems: 'flex-end' },
  container: { flex: 1, paddingHorizontal: 16 },
  noListsText: { textAlign: "center", color: "#888", fontSize: 16 },
  item: { padding: 20, marginVertical: 8, marginHorizontal: 5 },
  listName: { fontSize: 25, fontWeight: "bold" },
});
