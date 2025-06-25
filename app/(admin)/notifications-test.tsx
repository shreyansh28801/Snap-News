import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { getCurrentUser } from '../../services/auth';
import {
    createNotification,
    createSystemNotification,
    sendBreakingNewsNotification
} from '../../services/notifications';
import { NotificationType } from '../../types';

export default function NotificationsTestScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState('Test Notification');
  const [message, setMessage] = useState('This is a test notification');
  const [newsId, setNewsId] = useState('test-news-id-123');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.replace('/');
          return;
        }
        
        setUser(currentUser);
      } catch (error) {
        //console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const sendPersonalNotification = async () => {
    try {
      if (!user) return;

      const notification = {
        type: NotificationType.SYSTEM_MESSAGE,
        title,
        message,
        read: false,
        recipientId: user.uid
      };

      await createNotification(notification);
      Alert.alert('Success', 'Personal notification sent');
    } catch (error) {
      //console.error('Error sending personal notification:', error);
      Alert.alert('Error', 'Failed to send personal notification');
    }
  };

  const sendSystemNotification = async () => {
    try {
      await createSystemNotification(title, message);
      Alert.alert('Success', 'System notification sent to all users');
    } catch (error) {
      //console.error('Error sending system notification:', error);
      Alert.alert('Error', 'Failed to send system notification');
    }
  };

  const sendBreakingNewsAlert = async () => {
    try {
      await sendBreakingNewsNotification(newsId, title);
      Alert.alert('Success', 'Breaking news notification sent to all users');
    } catch (error) {
      //console.error('Error sending breaking news notification:', error);
      Alert.alert('Error', 'Failed to send breaking news notification');
    }
  };

  const sendLikeNotification = async () => {
    try {
      if (!user) return;

      const notification = {
        type: NotificationType.LIKE_RECEIVED,
        title: 'New Like',
        message: 'Someone liked your news article',
        read: false,
        recipientId: user.uid,
        relatedItemId: newsId
      };

      await createNotification(notification);
      Alert.alert('Success', 'Like notification sent');
    } catch (error) {
      //console.error('Error sending like notification:', error);
      Alert.alert('Error', 'Failed to send like notification');
    }
  };

  const sendCommentNotification = async () => {
    try {
      if (!user) return;

      const notification = {
        type: NotificationType.COMMENT_ADDED,
        title: 'New Comment',
        message: 'Someone commented on your news article',
        read: false,
        recipientId: user.uid,
        relatedItemId: newsId
      };

      await createNotification(notification);
      Alert.alert('Success', 'Comment notification sent');
    } catch (error) {
      //console.error('Error sending comment notification:', error);
      Alert.alert('Error', 'Failed to send comment notification');
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f7fa' }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#1f2937' }}>
          Notifications Test Panel
        </Text>
        
        <View style={{
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2
        }}>
          {/* Title Input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 6, color: '#374151' }}>
              Notification Title
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 6,
                padding: 12,
                fontSize: 16
              }}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter notification title"
            />
          </View>
          
          {/* Message Input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 6, color: '#374151' }}>
              Notification Message
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 6,
                padding: 12,
                fontSize: 16,
                height: 80,
                textAlignVertical: 'top'
              }}
              value={message}
              onChangeText={setMessage}
              placeholder="Enter notification message"
              multiline
              numberOfLines={3}
            />
          </View>
          
          {/* News ID Input (for related items) */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 6, color: '#374151' }}>
              Related News ID
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 6,
                padding: 12,
                fontSize: 16
              }}
              value={newsId}
              onChangeText={setNewsId}
              placeholder="Enter related news ID"
            />
          </View>
          
          {/* Test Buttons */}
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#1f2937' }}>
              Test Notifications
            </Text>
            
            {/* Personal Notification */}
            <TouchableOpacity
              style={{
                backgroundColor: '#3b82f6',
                borderRadius: 6,
                padding: 14,
                alignItems: 'center',
                marginBottom: 12
              }}
              onPress={sendPersonalNotification}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Send Personal Notification
              </Text>
            </TouchableOpacity>
            
            {/* System Notification */}
            <TouchableOpacity
              style={{
                backgroundColor: '#10b981',
                borderRadius: 6,
                padding: 14,
                alignItems: 'center',
                marginBottom: 12
              }}
              onPress={sendSystemNotification}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Send System Notification (All Users)
              </Text>
            </TouchableOpacity>
            
            {/* Breaking News */}
            <TouchableOpacity
              style={{
                backgroundColor: '#ef4444',
                borderRadius: 6,
                padding: 14,
                alignItems: 'center',
                marginBottom: 12
              }}
              onPress={sendBreakingNewsAlert}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Send Breaking News Alert
              </Text>
            </TouchableOpacity>
            
            {/* Like Notification */}
            <TouchableOpacity
              style={{
                backgroundColor: '#f97316',
                borderRadius: 6,
                padding: 14,
                alignItems: 'center',
                marginBottom: 12
              }}
              onPress={sendLikeNotification}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Send Like Notification
              </Text>
            </TouchableOpacity>
            
            {/* Comment Notification */}
            <TouchableOpacity
              style={{
                backgroundColor: '#8b5cf6',
                borderRadius: 6,
                padding: 14,
                alignItems: 'center'
              }}
              onPress={sendCommentNotification}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Send Comment Notification
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
} 