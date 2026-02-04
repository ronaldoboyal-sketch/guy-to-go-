
export enum UserRole {
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export enum SubscriptionStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED' // For one-time purchases
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  avatarUrl?: string;
  joinedAt?: string;
  password?: string;
  purchasedProductIds: string[]; // Track owned products
}

export type ProductResourceType = 'LINK' | 'IMAGE' | 'PDF';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  fileUrl?: string; // Mock file link
  resourceType?: ProductResourceType;
}

export interface CartItem extends Product {
  quantity: number;
}

export type PaymentType = 'SUBSCRIPTION' | 'ORDER';

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: PaymentType;
  transactionId: string;
  mmgSenderName: string;
  mmgSenderPhone: string;
  dateSubmitted: string;
  status: SubscriptionStatus;
  amount: number;
  // Specific to Orders
  items?: CartItem[];
}

export interface LessonPlanRequest {
  subject: string;
  grade: string;
  topic: string;
  duration: string;
}

export interface LessonPlanHistoryItem {
  id: string;
  userId: string;
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  dateGenerated: string;
  content: string; // The raw HTML
}

export interface LessonPlanResponse {
  markdown: string;
}
