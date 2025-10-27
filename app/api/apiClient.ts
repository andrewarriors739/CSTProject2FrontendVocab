// app/apiClient.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";

/** Android emulator cannot reach your machine via localhost.
 *  Use 10.0.2.2 for Android; if you test on iOS simulator, you'd use http://localhost:8080.
 *  Since you’re using Android, this keeps dev working. */
const DEV_BASE = "http://10.0.2.2:8080"; // Spring Boot on your laptop
const PROD_BASE = "https://group6-backend-717076585089.herokuapp.com";

const baseURL = PROD_BASE;

const apiClient = axios.create({
  baseURL, // NOTE: no trailing /api unless your backend paths actually start with /api
  headers: { "Content-Type": "application/json" },
});

// Attach JWT if present
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
