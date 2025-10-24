import type { LucideIcon } from "lucide-react";
import type { Timestamp } from "firebase/firestore";
import type { FieldValue } from "firebase/firestore";

export type Product = {
  id: string;
  name: string;
  price: number;
  shopName: string;
  imageUrl: string;
  imageHint: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  criteria_points?: number; 
};

export type UserBadge = {
  id: string;
  badgeId: string;
  dateEarned: Timestamp;
};


export type UserProfile = {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  badges?: string[];
  createdAt: Timestamp; // Changed to Timestamp
  points?: number;
};

export type GeoPoint = {
    latitude: number;
    longitude: number;
}

export type PriceRecord = {
  id: string;
  productName: string;
  shopName:string;
  price: number;
  userId: string;
  timestamp: Timestamp | FieldValue;
  imageUrl?: string;
  barcode?: string;
  upvotes: number;
  downvotes: number;
  upvotedBy?: string[];
  downvotedBy?: string[];
  location?: GeoPoint;
  locationAddress?: string;
};

export type Comment = {
  id: string;
  text: string;
  userId: string;
  username: string;
  userAvatar?: string; // Renamed from userProfilePictureUrl
  priceRecordId: string;
  timestamp: Timestamp;
};
