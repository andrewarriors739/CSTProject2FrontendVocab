import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation, RouteProp, NavigationProp } from "@react-navigation/native";
import apiClient from "../api/apiClient";
import { RootStackParamList } from "../navigation/types"; // <-- import shared type

type ListCreationRoute = RouteProp<RootStackParamList, "ListCreation">;

export default function ListCreation({ route }: { route: ListCreationRoute }) {
  const [listName, setListName] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { userID } = route.params;

  const handleListCreation = async () => {
    if (!listName.trim()) {
      Alert.alert("Error", "Please enter a list name.");
      return;
    }

    try {
      // POST /api/users/{userId}/lists
      await apiClient.post(`/api/users/${userID}/lists`, { name: listName });
      Alert.alert("Success", "List created");
      navigation.navigate("LandingPage", { userID });
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to create list");
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("LandingPage", { userID })}>
          <Text style={styles.backButtonText}>&#8249;- Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create a New Vocab List</Text>
        </View>
        <View style={styles.rightContent} />
      </View>

      <SafeAreaView style={styles.container}>
        <View style={{ gap: 20, marginVertical: 20 }}>
          <TextInput
            placeholder="Enter Vocab List Name"
            value={listName}
            onChangeText={setListName}
            style={styles.textInput}
          />
        </View>

        <View style={{ flex: 1, flexDirection: "row", gap: 20 }}>
          <TouchableOpacity onPress={() => navigation.navigate("LandingPage", { userID })} style={[styles.button, { backgroundColor: "red" }]}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleListCreation} style={[styles.button, { backgroundColor: "blue" }]}>
            <Text style={styles.buttonText}>Create List</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, backgroundColor: "white", borderBottomColor: '#ddd', justifyContent: 'space-between' },
  backButton: { padding: 8 }, backButtonText: { color: "blue" },
  titleContainer: { flex: 1, alignItems: 'center' }, title: { fontSize: 18, fontWeight: 'bold' },
  rightContent: { width: 50, alignItems: 'flex-end' },
  container: { flex: 1, alignItems: "center" },
  textInput: { borderWidth: 1, padding: 10, width: 300, borderRadius: 5, borderColor: "slategray" },
  button: { height: 40, width: 120, alignItems: "center", justifyContent: "center", borderRadius: 5 },
  buttonText: { fontWeight: "bold", color: "white" },
});
