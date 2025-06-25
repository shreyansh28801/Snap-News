import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getCurrentUser } from '../../services/auth';
import {
    createTestNotification,
    getNotificationsForUser,
    markAllNotificationsAsRead,
    markNotificationAsRead
} from '../../services/notifications';
import { Notification, NotificationType } from '../../types';

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadNotifications();
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setUserId(user.uid);
      } else {
        // Handle not logged in
        router.replace('/');
      }
    } catch (error) {
      //console.error('Error loading user:', error);
    }
  };

  const loadNotifications = async () => {
    if (!userId) {
      //console.log('No user ID available, cannot load notifications');
      return;
    }
    
    try {
      setIsLoading(true);
      //console.log(`Loading notifications for user: ${userId}`);
      
    //   // Create a test notification to verify functionality
    //   if (notifications.length === 0) {
    //     //console.log('No notifications found, creating a test notification');
    //     try {
    //       await createTestNotification(userId);
    //       //console.log('Test notification created');
    //     } catch (testError) {
    //       //console.error('Error creating test notification:', testError);
    //     }
    //   }
      
      const userNotifications = await getNotificationsForUser(userId);
      //console.log(`Loaded ${userNotifications.length} notifications:`, JSON.stringify(userNotifications, null, 2));
      setNotifications(userNotifications);
    } catch (error) {
      //console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleNotificationPress = async (notification: Notification) => {
    try {
      // Mark as read
      await markNotificationAsRead(notification.id);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        )
      );

      // Navigate based on notification type
      if (notification.relatedItemId) {
        // For now, just navigate to the home tab with a query parameter
        router.navigate({
          pathname: "/(tabs)",
          params: { newsId: notification.relatedItemId }
        });
      }
    } catch (error) {
      //console.error('Error handling notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    
    try {
      await markAllNotificationsAsRead(userId);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      //console.error('Error marking all as read:', error);
    }
  };

  const handleCreateTestNotification = async () => {
    if (!userId) return;
    
    try {
      await createTestNotification(userId);
      // Refresh the list
      loadNotifications();
    } catch (error) {
      //console.error('Error creating test notification:', error);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.NEWS_ADDED:
        return <MaterialIcons name="article" size={24} color="#3b82f6" />;
      case NotificationType.COMMENT_ADDED:
        return <MaterialIcons name="comment" size={24} color="#8b5cf6" />;
      case NotificationType.LIKE_RECEIVED:
        return <MaterialIcons name="favorite" size={24} color="#ef4444" />;
      case NotificationType.SYSTEM_MESSAGE:
        return <MaterialIcons name="info" size={24} color="#10b981" />;
      case NotificationType.BREAKING_NEWS:
        return <MaterialIcons name="priority-high" size={24} color="#f59e0b" />;
      default:
        return <MaterialIcons name="notifications" size={24} color="#6b7280" />;
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text className="mt-4 text-gray-600">Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Mark All as Read */}
      <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-900">Notifications</Text>
        
        <View className="flex-row">
          {/* Test Button */}
          <TouchableOpacity
            onPress={handleCreateTestNotification}
            className="py-1 px-2 bg-green-50 rounded-md mr-2"
          >
            <Text className="text-green-600 text-sm font-medium">Test</Text>
          </TouchableOpacity>
          
          {/* Mark All as Read Button */}
          {notifications.some(n => !n.read) && (
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              className="py-1 px-2 bg-blue-50 rounded-md"
            >
              <Text className="text-blue-600 text-sm font-medium">Mark all as read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleNotificationPress(item)}
            className={`bg-white p-4 border-b border-gray-100 ${!item.read ? 'bg-blue-50' : ''}`}
          >
            <View className="flex-row">
              {/* Icon */}
              <View className="mr-3 mt-1">
                {getNotificationIcon(item.type)}
              </View>
              
              {/* Content */}
              <View className="flex-1">
                <Text className={`font-bold text-gray-900 mb-1 ${!item.read ? 'font-extrabold' : ''}`}>
                  {item.title}
                </Text>
                <Text className="text-gray-600 text-sm mb-2">
                  {item.message}
                </Text>
                <Text className="text-gray-400 text-xs">
                  {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
                </Text>
              </View>
              
              {/* Unread Indicator */}
              {!item.read && (
                <View className="w-3 h-3 rounded-full bg-blue-500 mt-2" />
              )}
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-16">
            <MaterialIcons name="notifications-none" size={64} color="#9ca3af" />
            <Text className="text-gray-400 text-lg mt-4">No notifications yet</Text>
          </View>
        }
      />
    </View>
  );
} 