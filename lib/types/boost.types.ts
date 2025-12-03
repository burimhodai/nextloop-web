import { IListing } from "./listing.types";
import { IUser } from "./user.types";

export enum BoostTypes {
  FEATURED = "FEATURED",
  CATEGORY_TOP = "CATEGORY_TOP",
  HOMEPAGE = "HOMEPAGE",
  SEARCH_PRIORITY = "SEARCH_PRIORITY",
}

export enum BoostStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
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
