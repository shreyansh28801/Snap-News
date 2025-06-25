import { NewsCategory } from '../types';

// News Categories Array
export const NEWS_CATEGORIES = [
  { key: NewsCategory.SPORT, label: 'Sport', icon: '⚽' },
  { key: NewsCategory.POLITICS, label: 'Politics', icon: '🏛️' },
  { key: NewsCategory.BUSINESS, label: 'Business', icon: '💼' },
  { key: NewsCategory.TECHNOLOGY, label: 'Technology', icon: '💻' },
  { key: NewsCategory.ENTERTAINMENT, label: 'Entertainment', icon: '🎬' },
  { key: NewsCategory.HEALTH, label: 'Health', icon: '🏥' },
  { key: NewsCategory.GENERAL, label: 'General', icon: '📰' },
  { key: NewsCategory.BREAKING_NEWS, label: 'Breaking News', icon: '🔥' },
  { key: NewsCategory.AUTOMOBILE, label: 'Automobile', icon: '🚗' },
  { key: NewsCategory.SCIENCE, label: 'Science', icon: '🔬' },
  { key: NewsCategory.TRAVEL, label: 'Travel', icon: '🌍' },
  { key: NewsCategory.MISCELLANEOUS, label: 'Miscellaneous', icon: '🔍' },
];

// Color Schemes
export const COLORS = {
  primary: '#1e90ff',
  primaryDark: '#1873cc',
  primaryLight: '#4fa3ff',
  secondary: '#ff6b6b',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  
  // Background colors
  background: '#f5f5f5',
  surface: '#ffffff',
  
  // Text colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#9e9e9e',
  textInverse: '#ffffff',
  
  // Border colors
  border: '#e0e0e0',
  divider: '#bdbdbd',
  
  // Category colors
  categoryColors: {
    [NewsCategory.SPORT]: '#4caf50',
    [NewsCategory.POLITICS]: '#f44336',
    [NewsCategory.BUSINESS]: '#2196f3',
    [NewsCategory.TECHNOLOGY]: '#9c27b0',
    [NewsCategory.ENTERTAINMENT]: '#ff9800',
    [NewsCategory.HEALTH]: '#00bcd4',
    [NewsCategory.GENERAL]: '#607d8b',
    [NewsCategory.BREAKING_NEWS]: '#e91e63',
    [NewsCategory.AUTOMOBILE]: '#795548',
    [NewsCategory.SCIENCE]: '#009688',
    [NewsCategory.TRAVEL]: '#3f51b5',
    [NewsCategory.MISCELLANEOUS]: '#607d8b'
  }
};

// App Configuration
export const APP_CONFIG = {
  appName: 'Snap News',
  appVersion: '1.0.0',
  
  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || '',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 50,
  },
  
  // Form Validation
  validation: {
    minPasswordLength: 6,
    maxPasswordLength: 128,
    minDisplayNameLength: 2,
    maxDisplayNameLength: 50,
    maxTitleLength: 200,
    maxDescriptionLength: 5000,
  },
  
  // Image Configuration
  images: {
    defaultNewsImage: 'https://via.placeholder.com/400x300?text=No+Image',
    defaultUserAvatar: 'https://via.placeholder.com/150?text=User',
    maxImageSize: 5 * 1024 * 1024, // 5MB
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  },
  
  // Storage Keys
  storage: {
    authToken: '@inshorts_auth_token',
    userData: '@inshorts_user_data',
    selectedCategory: '@inshorts_selected_category',
    isDarkMode: '@inshorts_dark_mode',
  },
  
  // Firebase Collections
  collections: {
    users: 'users',
    news: 'news',
    categories: 'categories',
  },
  
  // News Feed Configuration
  newsFeed: {
    refreshInterval: 300000, // 5 minutes
    cacheExpiry: 600000, // 10 minutes
    swipeThreshold: 100, // pixels
  },
};

// Screen Dimensions Helper
export const SCREEN_PADDING = 16;
export const CARD_BORDER_RADIUS = 12;
export const BUTTON_HEIGHT = 48;
export const INPUT_HEIGHT = 48;

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  general: 'Something went wrong. Please try again.',
  network: 'No internet connection. Please check your network.',
  auth: {
    invalidEmail: 'Please enter a valid email address.',
    weakPassword: 'Password must be at least 6 characters.',
    userNotFound: 'No user found with this email.',
    wrongPassword: 'Incorrect password.',
    emailInUse: 'This email is already registered.',
    passwordMismatch: 'Passwords do not match.',
  },
  news: {
    loadFailed: 'Failed to load news. Please try again.',
    addFailed: 'Failed to add news. Please try again.',
    invalidUrl: 'Please enter a valid URL.',
    missingFields: 'Please fill all required fields.',
  },
};

// Success Messages
export const SUCCESS_MESSAGES = {
  auth: {
    loginSuccess: 'Welcome back!',
    registerSuccess: 'Account created successfully!',
    logoutSuccess: 'Logged out successfully.',
  },
  news: {
    addSuccess: 'News article added successfully!',
    updateSuccess: 'News article updated successfully!',
    deleteSuccess: 'News article deleted successfully!',
  },
}; 



// Categories for the sidebar
export const categories = [
  { key: 'ALL', label: 'All News', icon: 'article' },
  { key: NewsCategory.GENERAL, label: 'General', icon: 'public' },
  { key: NewsCategory.BUSINESS, label: 'Business', icon: 'business' },
  { key: NewsCategory.POLITICS, label: 'Politics', icon: 'how-to-vote' },
  { key: NewsCategory.SPORT, label: 'Sports', icon: 'sports' },
  { key: NewsCategory.TECHNOLOGY, label: 'Technology', icon: 'computer' },
  { key: NewsCategory.ENTERTAINMENT, label: 'Entertainment', icon: 'movie' },
  { key: NewsCategory.HEALTH, label: 'Health', icon: 'local-hospital' },
  { key: NewsCategory.BREAKING_NEWS, label: 'Breaking News', icon: 'new-releases' },
  { key: NewsCategory.AUTOMOBILE, label: 'Automobile', icon: 'directions-car' },
  { key: NewsCategory.SCIENCE, label: 'Science', icon: 'science' },
  { key: NewsCategory.TRAVEL, label: 'Travel', icon: 'travel-explore' },
  { key: NewsCategory.MISCELLANEOUS, label: 'Miscellaneous', icon: 'miscellaneous' }
];



export const news_not_found_card =  {
  id: '1',
  title: 'Welcome to Snap News',
  description: 'This is a sample news article. Add news articles using the Add News tab to see them here.',
  image_link: 'https://via.placeholder.com/200x150?text=InShorts+Clone',
  news_source_link: 'https://example.com',
  news_topic: 'General' as any,
  createdBy: 'system',
  createdByUsername: 'System',
  createdAt: new Date(),
  isActive: true,
  viewCount: 0,
  likes: 0
}