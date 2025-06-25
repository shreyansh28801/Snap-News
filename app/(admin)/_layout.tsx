import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlobalHeader } from '../../components/GlobalHeader';
import { GlobalSidebar } from '../../components/GlobalSidebar';
import { getCurrentUser } from '../../services/auth';

// Create a simple admin provider component for auth checking
function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        // If not logged in, redirect to login
        if (!currentUser) {
          router.replace('/');
        }
      } catch (error) {
        //console.error('Error checking auth state:', error);
        router.replace('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [router, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={{ marginTop: 10 }}>Loading admin panel...</Text>
      </View>
    );
  }

  if (!user) {
    return null; // Will redirect to login via the useEffect hook
  }

  return <>{children}</>;
}

// Admin panel specific sidebar state
export default function AdminLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <AdminProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        <GlobalHeader 
          onMenuPress={() => setSidebarVisible(true)}
          title="Admin Panel"
          showLogo={false}
        />
        
        <GlobalSidebar
          visible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
          adminLinks={[
            { label: 'Dashboard', path: '/(admin)/', icon: 'dashboard' },
            { label: 'Manage News', path: '/(admin)/news/manage', icon: 'article' },
            { label: 'Create News', path: '/(admin)/news/create', icon: 'add-circle' },
            { label: 'Test Notifications', path: '/(admin)/notifications-test', icon: 'notifications' }
          ]}
        />
        
        <Stack screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right' 
        }} />
      </SafeAreaView>
    </AdminProvider>
  );
} 