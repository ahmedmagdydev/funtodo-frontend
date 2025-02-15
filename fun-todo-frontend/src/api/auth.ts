/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { RegisterFormData } from "../features/auth/types/auth";
import { ApiResponse } from "../shared/types/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const storeToken = (token: string, rememberMe: boolean = false) => {
  if (rememberMe) {
    localStorage.setItem("token", token);
  } else {
    sessionStorage.setItem("token", token);
  }
};

const clearToken = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};

export const getToken = (): string | null => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const authService = {
  async register(data: RegisterFormData): Promise<ApiResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        message: error.message || "An error occurred during registration",
      };
    }
  },

  async login(data: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<ApiResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: data.email,
        password: data.password,
      });

      if (response.data.success && response.data.data?.token) {
        storeToken(response.data.data.token, data.rememberMe);
      }

      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        message: error.message || "An error occurred during login",
      };
    }
  },

  async googleSignIn(
    req: any,
    rememberMe: boolean = false
  ): Promise<ApiResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/google`, {
        access_token: req,
      });

      if (response.data.success && response.data.data?.token) {
        storeToken(response.data.data.token, rememberMe);
      }

      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        message: error.message || "An error occurred during Google sign-in",
      };
    }
  },

  logout(): void {
    clearToken();
  },

  isAuthenticated(): boolean {
    return !!getToken();
  },
};
