// app/screens/wordList.tsx
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation, RouteProp, NavigationProp } from "@react-navigation/native";
import apiClient from "../api/apiClient";
import { RootStackParamList } from "../navigation/types";

type WordListRoute = RouteProp<RootStackParamList, "WordListPage">;

type Item = { id: number; term: string; definition: string };

export default function WordListPage({ route }: { route: WordListRoute }) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { userID, listID } = route.params;

  const [loading, setLoading] = useState(true);
  const [listName, setListName] = useState<string>("");
  const [wordList, setWordList] = useState<Item[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        // 1) Load list meta (name)
        const meta = await apiClient.get<{ id: number; name: string }>(
          `/api/users/${userID}/lists/${listID}`,
          { validateStatus: () => true }
        );
        if (meta.status === 200) {
          setListName(meta.data?.name ?? "Words");
        } else if (meta.status === 204) {
          setListName("Words");
        } else {
          return Alert.alert("Error", `Failed to load list (${meta.status})`);
        }

        // 2) Load items (try /items first, then fallback to /words)
        const tryLoad = async (path: string) => {
          const res = await apiClient.get<Item[]>(
            `/api/users/${userID}/lists/${listID}/${path}`,
            { validateStatus: () => true }
          );
          return res;
        };

        let res = await tryLoad("items");

        // If your backend uses /words instead, fallback on 404/405
        if (res.status === 404 || res.status === 405) {
          res = await tryLoad("words");
        }

        if (res.status === 200) {
          setWordList(Array.isArray(res.data) ? res.data : []);
        } else if (res.status === 204) {
          setWordList([]); // No Content -> empty list
        } else {
          const msg = typeof res.data === "string" ? res.data : JSON.stringify(res.data ?? {});
          Alert.alert("Error", `Failed to load words (${res.status}): ${msg}`);
        }
      } catch (e: any) {
        Alert.alert("Error", e?.message ?? "Failed to load words");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userID, listID]);

  return (
    <SafeAreaProvider>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("VocabListPage", { userID })}
        >
          <Text style={styles.backButtonText}>&#8249;- Back</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{listName || "Words"}</Text>
        </View>

        <View style={styles.rightContent} />
      </View>

      <SafeAreaView style={styles.container}>
        {loading ? (
          <Text>Loading...</Text>
        ) : wordList.length === 0 ? (
          <Text style={styles.noWordsText}>No words added yet</Text>
        ) : (
          <FlatList
            data={wordList}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.wordItem}>
                <Text style={styles.word}>{item.term}</Text>
                <Text style={styles.definition}>{item.definition}</Text>
              </View>
            )}
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
  noWordsText: { textAlign: "center", color: "#888", fontSize: 16, marginTop: 12 },
  wordItem: { padding: 10, marginVertical: 5, backgroundColor: "#e8e8e8", borderRadius: 5 },
  word: { fontSize: 18, fontWeight: "bold" },
  definition: { fontSize: 16, fontStyle: "italic" },
});


