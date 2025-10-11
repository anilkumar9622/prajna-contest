// lib/axios.ts
import axios from "axios";
import { getSession } from "next-auth/react";
import { startLoading, stopLoading } from "@/lib/auth//loader";

const apiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api",
  withCredentials: true,
  timeout: 6000, // ⏱️ Terminate requests after 6 seconds
});

// --- Request Interceptor ---
apiService.interceptors.request.use(
  async (config) => {
    startLoading();
    const session: any = await getSession();
    console.log({session})
    const token = session?.jwt;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    stopLoading();
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
apiService.interceptors.response.use(
  (response) => {
    stopLoading();
    return response;
  },
  (error) => {
    stopLoading();

    // Handle timeout errors clearly
    if (error.code === "ECONNABORTED") {
      console.error("⏰ Request timed out after 6 seconds");
      return Promise.reject(new Error("Request timed out. Please try again."));
    }

    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error?.response?.data);
  }
);

export default apiService;
