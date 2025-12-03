import { ICategory, IUser } from "./user.types";
import { IBoost } from "./boost.types";

export enum ListingConditions {
  NEW = "NEW",
  LIKE_NEW = "LIKE_NEW",
  GOOD = "GOOD",
  VERY_GOOD = "VERY_GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
}

export enum ListingTypes {
  DIRECT_BUY = "DIRECT_BUY",
  AUCTION = "AUCTION",
}

export enum ImageTypes {
  MAIN = "MAIN",
  FRONT = "FRONT",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  BACK = "BACK",
  DEFECTS = "DEFECTS",
  DETAILS = "DETAILS",
  BRAND = "BRAND",
}

export enum ListingStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  SOLD = "SOLD",
  CANCELLED = "CANCELLED",
  PENDING = "PENDING",
}

export enum TransactionTypes {
  BOOST = "BOOST",
  PURCHASE = "PURCHASE",
}

export interface IImage {
  url: string;
  alt?: string;
  type: ImageTypes;
  _id?: string;
}

export interface IBid {
  _id?: string;
  bidder: string | IUser;
  amount: number;
  timestamp?: Date;
}

export interface IShippingOption {
  method: string;
  cost: number;
  estimatedDays?: number;
  _id?: string;
}

export interface IListing {
  _id: string;
  name?: string;
  description: string;
  category?: string | ICategory;
  seller?: string | IUser;

  // Price fields
  startingPrice?: number;
  currentPrice?: number;
  buyNowPrice?: number;
  bidIncrement?: number;

  startTime?: Date;
  endTime?: Date;
  condition: ListingConditions;
  images: IImage[];
  status: ListingStatus;
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
