import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { getCurrentUser } from '../services/auth';
import { getUnreadNotificationCount } from '../services/notifications';

interface GlobalHeaderProps {
  onMenuPress: () => void;
  title?: string;
  showLogo?: boolean;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  onMenuPress,
  title,
  showLogo = true
}) => {
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const user = await getCurrentUser();
        
        if (user) {
          //console.log('Checking for notifications...');
          const count = await getUnreadNotificationCount(user.uid);
          //console.log(`Found ${count} unread notifications`);
          setNotificationCount(count);
        }
      } catch (error) {
        //console.error('Error loading notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Load notifications immediately
    loadNotifications();
    
    // Set up frequent refresh interval
    const notificationRefreshInterval = setInterval(() => {
      loadNotifications();
    }, 10000); // Refresh every 10 seconds for testing purposes
    
    return () => {
      clearInterval(notificationRefreshInterval);
    };
  }, []);
  
  const handleNotificationPress = () => {
    // Navigate to notifications screen - path must match the file location
    router.push({
      pathname: '/(tabs)/notifications'
    });
  };

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2
    }}>
      {/* Hamburger Menu Button */}
      <TouchableOpacity
        onPress={onMenuPress}
        style={{
          padding: 8,
          marginRight: 12
        }}
      >
        <MaterialIcons name="menu" size={24} color="#374151" />
      </TouchableOpacity>

      {/* Logo/Title */}
      <View style={{ flex: 1, alignItems: 'center' }}>
        {showLogo ? (
          <>
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              color: '#dc2626' 
            }}>
              Snap-News
            </Text>
            <Text style={{ 
              fontSize: 10, 
              color: '#6b7280',
              marginTop: -2
            }}>
              stay informed
            </Text>
          </>
        ) : (
          <Text style={{ 
            fontSize: 18, 
            fontWeight: 'bold', 
            color: '#374151' 
          }}>
            {title}
          </Text>
        )}
      </View>

      {/* Notification Bell */}
      <TouchableOpacity 
        style={{ padding: 8, marginRight: 8 }}
        onPress={handleNotificationPress}
      >
        <MaterialIcons name="notifications" size={24} color="#374151" />
        {notificationCount > 0 && (
          <View style={{
            position: 'absolute',
            right: 3,
            top: 3,
            backgroundColor: '#ef4444',
            borderRadius: 10,
            width: 18,
            height: 18,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: 'white'
          }}>
            <Text style={{
              color: 'white',
              fontSize: 10,
              fontWeight: 'bold'
            }}>
              {notificationCount > 9 ? '9+' : notificationCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Language Toggle (placeholder) */}
      <TouchableOpacity style={{ padding: 8 }}>
        <Text style={{ color: '#6b7280', fontSize: 12 }}>English</Text>
      </TouchableOpacity>
    </View>
  );
}; 