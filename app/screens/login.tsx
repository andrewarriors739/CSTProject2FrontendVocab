// app/screens/login.tsx
import React, { useState } from "react";
import {
  View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import apiClient from "../api/apiClient";

export default function LoginPage() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // ---- Email / Password via backend (keep teammate's flow) ----
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      // expect { token, userID } or { token, user:{...} } depending on your API
      const { token, userID, user } = res.data;
      if (token) await SecureStore.setItemAsync("jwt", token);
      navigation.navigate("LandingPage", { userID: userID ?? user?.id });
    } catch (error: any) {
      Alert.alert("Login Failed", error.response?.data?.message || error.message || "Unknown error");
    }
  };

  // ---- Google OAuth via backend (your addition) ----
  const handleGoogle = async () => {
    try {
      setBusy(true);

      // 1) Ask backend to start the flow (returns Google URL + sets WAITING state)
      const start = await apiClient.get("/auth/google/start", { params: { deviceId: "dev1" } });
      const authUrl: string = start.data.url;

      // 2) Open system browser
      const result = await WebBrowser.openBrowserAsync(authUrl);

      // 3) Poll /status until SUCCESS or ERROR
      const poll = async (): Promise<any> => {
        const r = await apiClient.get("/auth/google/status", { params: { deviceId: "dev1" } });
        if (r.data.status === "SUCCESS") return r.data;
        if (r.data.status === "ERROR") throw new Error(r.data.error || "OAuth failed");
        // still waiting
        await new Promise(res => setTimeout(res, 1200));
        return poll();
      };

      const done = await poll();

      // 4) Store token and navigate
      if (done.jwt) await SecureStore.setItemAsync("jwt", done.jwt);
      // Optional: persist a little user profile too
      // await SecureStore.setItemAsync("user", JSON.stringify(done.user));
      try { WebBrowser.dismissBrowser(); } catch {} // best-effort close
      Alert.alert("Welcome", done?.user?.email || "Signed in");
      navigation.reset({ index: 0, routes: [{ name: "LandingPage", params: { userID: done?.user?.id } }] });
    } catch (e: any) {
      Alert.alert("Google Sign-In", e?.message ?? "Network request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

      {/* teammate's email/password fields */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Log In" onPress={handleLogin} color="#FF5733" />

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword" as never)}>
        <Text style={{ color: "blue", marginTop: 10 }}>Forgot/Reset Password?</Text>
      </TouchableOpacity>

      <View style={{ height: 24 }} />

      {/* Your Google button */}
      <Button
        title={busy ? "Signing in…" : "Continue with Google"}
        onPress={handleGoogle}
        color="#4285F4"
        disabled={busy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#adba95", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "80%", height: 40, borderColor: "#ccc", borderWidth: 1, borderRadius: 5,
    paddingHorizontal: 10, marginBottom: 10, backgroundColor: "white",
  },
});

