// User Types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt?: Date;
  photoURL?: string;
  role?: 'user' | 'admin';
}

// News Category Enum
export enum NewsCategory {
  SPORT = 'Sport',
  POLITICS = 'Politics',
  BUSINESS = 'Business',
  TECHNOLOGY = 'Technology',
  ENTERTAINMENT = 'Entertainment',
  HEALTH = 'Health',
  GENERAL = 'General',
  AUTOMOBILE = 'Automobile',
  SCIENCE = 'Science',
  TRAVEL = 'Travel',
  MISCELLANEOUS = 'Miscellaneous',
  ALL = 'All',
  BREAKING_NEWS = 'Breaking News'
}

// News Article Types
export interface News {
  id: string;
  title: string;
  description: string;
  image_link: string;
  news_source_link: string;
  news_topic: NewsCategory;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
  viewCount?: number;
  likes?: number;
}

// Form Data Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AddNewsFormData {
  title: string;
  description: string;
  image_link: string;
  news_source_link: string;
  news_topic: NewsCategory;
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
  viewCount: number;
  likes: number;
}

// Filter Types
export interface NewsFilter {
  category?: NewsCategory;
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;
}

// Response Types
export interface AuthResponse {
  user: User;
  token?: string;
  error?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading?: boolean;
}

// Navigation Types
export type RootStackParamList = {
  '(auth)': undefined;
  '(tabs)': undefined;
};

export type AuthStackParamList = {
  login: undefined;
  register: undefined;
};

export type TabsParamList = {
  index: undefined;
  'add-news': undefined;
  profile: undefined;
};

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Firebase Timestamp Type (for Firestore)
export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

// Convert Firebase Timestamp to Date
export const timestampToDate = (timestamp: FirebaseTimestamp): Date => {
  return new Date(timestamp.seconds * 1000);
};

// Convert Date to Firebase Timestamp format
export const dateToTimestamp = (date: Date): FirebaseTimestamp => {
  return {
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: 0
  };
};

// Notification Types
export enum NotificationType {
  NEWS_ADDED = 'NEWS_ADDED',
  COMMENT_ADDED = 'COMMENT_ADDED',
  LIKE_RECEIVED = 'LIKE_RECEIVED',
  SYSTEM_MESSAGE = 'SYSTEM_MESSAGE',
  BREAKING_NEWS = 'BREAKING_NEWS'
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedItemId?: string; // ID of the news article or other item this relates to
  createdAt: Date;
  read: boolean;
  recipientId: string; // User ID this notification is for
} 