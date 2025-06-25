import { Stack } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlobalHeader } from '../../components/GlobalHeader';
import { GlobalSidebar } from '../../components/GlobalSidebar';

// Create context for sidebar state
interface SidebarContextType {
  sidebarVisible: boolean;
  setSidebarVisible: (visible: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

export default function TabLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSidebarVisible(false);
  };

  return (
    <SidebarContext.Provider value={{
      sidebarVisible,
      setSidebarVisible,
      selectedCategory,
      setSelectedCategory
    }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        {/* Global Header for all screens */}
        <GlobalHeader 
          onMenuPress={toggleSidebar}
          showLogo={true}
        />
        
        {/* Global Sidebar */}
        <GlobalSidebar
          visible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* Stack Navigator (no bottom tabs) */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="add-news" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="notifications" />
        </Stack>
      </SafeAreaView>
    </SidebarContext.Provider>
  );
} 