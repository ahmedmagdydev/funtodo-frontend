import axios from "axios";
import { RegisterFormData, ApiResponse } from "../types/auth";
// import { hashPassword, generateSalt } from "../utils/crypto";

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

const getToken = (): string | null => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const authService = {
  async register(data: RegisterFormData): Promise<ApiResponse> {
    try {
      // Generate a salt for the password
      // const salt = generateSalt();

      // Hash the password with the salt
      // const hashedPassword = await hashPassword(data.password, salt);

      // Create the payload with hashed password and salt
      const payload = {
        ...data,
        // password: hashedPassword,
        // salt: salt,
        // Remove confirm password as it's not needed in the API
        confirmPassword: undefined,
      };

      const response = await axios.post(`${API_URL}/auth/register`, payload);
      return {
        success: true,
        message: "Registration successful",
        data: response.data,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  },

  async login(data: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<ApiResponse> {
    try {
      // First, get the salt for this user's email
      // const saltResponse = await axios.post(`${API_URL}/auth/salt`, {
      //   email: data.email,
      // });
      // const salt = saltResponse.data.salt;

      // Hash the password with the retrieved salt
      // const hashedPassword = await hashPassword(data.password, salt);

      // Send login request with hashed password
      const response = await axios.post(`${API_URL}/auth/login`, {
        ...data,
      });

      // console.log("🚀 ~ response:", response);
      // Store the token based on remember me preference
      if (response.data.data.token) {
        storeToken(response.data.data.token, data.rememberMe);
      }

      return {
        success: true,
        message: "Login successful",
        data: response.data,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },

  async googleSignIn(
    req: any,
    rememberMe: boolean = false
  ): Promise<ApiResponse> {
    // console.log("🚀 ~ req:", req);
    try {
      const response = await axios.post(`${API_URL}/auth/google`, {
        access_token: req,
      });

      // Store the token based on remember me preference
      if (response.data.token) {
        storeToken(response.data.token, rememberMe);
      }

      return {
        success: true,
        message: "Google sign-in successful",
        data: response.data,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Google sign-in failed",
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
