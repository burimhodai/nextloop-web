// types/user.types.ts

export interface Address {
  street?: string;
  city?: string;
  canton?: string;
  postalCode?: string;
  country?: string;
}

export type UserRole = "user" | "seller" | "admin";
export type PreferredLanguage = "de" | "fr" | "it" | "en";

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: Address;
  stripe_customer_id?: string;
  rating: number;
  totalRatings: number;
  emailVerified: boolean;
  idVerified: boolean;
  isSeller: boolean;
  balance: number;
  preferredLanguage: PreferredLanguage;
  vatNumber?: string;
  businessName?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  idVerification: {
    documentNumber: string;
    expiryDate: string;
    success: boolean;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  address?: Address;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}
