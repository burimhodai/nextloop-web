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
// Enums
export enum ListingConditions {
  NEW = "new",
  LIKE_NEW = "like_new",
  VERY_GOOD = "very_good",
  GOOD = "good",
  ACCEPTABLE = "acceptable",
}

export enum ListingStatus {
  PENDING = "pending",
  ACTIVE = "active",
  SOLD = "sold",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

export enum ListingTypes {
  AUCTION = "auction",
  DIRECT_BUY = "direct_buy",
  BOTH = "both",
}

export enum ImageTypes {
  MAIN = "main",
  GALLERY = "gallery",
  THUMBNAIL = "thumbnail",
}

export enum BoostTypes {
  FEATURED = "featured",
  HIGHLIGHTED = "highlighted",
  TOP_LISTING = "top_listing",
  URGENT = "urgent",
}

export enum BoostStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

// Interfaces
export interface IAddress {
  street?: string;
  city?: string;
  canton?: string;
  postalCode?: string;
  country?: string;
}

export interface IIdVerification {
  name?: string;
  expiryDate?: string;
  documentNumber?: string;
  success?: boolean;
  state?: "NOT_SUBMITTED" | "APPROVED" | "REJECTED" | "IN_REVIEW";
  rejection_reason?: string; // Make it optional with ?
}

export interface IUser {
  _id: string;
  username?: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: IAddress;
  stripe_customer_id?: string;
  rating?: number;
  totalRatings?: number;
  emailVerified?: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  isSeller?: boolean;
  balance?: number;
  preferredLanguage?: "de" | "fr" | "it" | "en";
  vatNumber?: string;
  businessName?: string;
  role?: "user" | "seller" | "admin";
  idVerification?: IIdVerification;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentCategory?: string | ICategory;
  isActive?: boolean;
  productCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBoost {
  _id: string;
  name?: string;
  type: BoostTypes;
  duration?: number;
  cost?: number;
  startTime?: Date;
  endTime?: Date;
  status?: BoostStatus;
  listing?: string | IListing;
  user?: string | IUser;
  impressions?: number;
  clicks?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IImage {
  url: string;
  alt?: string;
  type?: ImageTypes;
}

export interface IBid {
  bidder: string | IUser;
  amount: number;
  timestamp?: Date;
}

export interface IShippingOption {
  method: string;
  cost: number;
  estimatedDays?: number;
}

export interface IListing {
  _id: string;
  name?: string;
  description: string;
  category?: string | ICategory;
  seller?: string | IUser;
  startingPrice?: number;
  currentPrice?: number;
  buyNowPrice?: number;
  bidIncrement?: number;
  startTime?: Date;
  endTime?: Date;
  condition: ListingConditions;
  images?: IImage[];
  status?: ListingStatus;
  bids?: IBid[];
  highestBidder?: string | IUser;
  totalBids?: number;
  views?: number;
  shippingCost?: number;
  shippingOptions?: IShippingOption[];
  boost?: string[] | IBoost[];
  type: ListingTypes;
  cancellationReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response types
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  error?: string;
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
    user: IUser;
  };
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}
