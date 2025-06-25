import { MaterialIcons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { NewsCategory } from '../types';

interface AdminLink {
  label: string;
  path: string;
  icon: string;
}

interface GlobalSidebarProps {
  visible: boolean;
  onClose: () => void;
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
  adminLinks?: AdminLink[];
}

const { width: screenWidth } = Dimensions.get('window');

export const GlobalSidebar: React.FC<GlobalSidebarProps> = ({
  visible,
  onClose,
  selectedCategory = 'ALL',
  onCategorySelect,
  adminLinks
}) => {
  // Get current path for highlighting active navigation item
  const currentPath = usePathname();
  
  const handleCategorySelect = (categoryKey: string) => {
    // Always update the selected category through the context if available
    if (onCategorySelect) {
      onCategorySelect(categoryKey);
    }
    
    // Always navigate to home page when a category is selected
    router.push("/(tabs)/" as any);
    
    onClose();
  };

  // Renders admin links if provided
  const renderAdminLinks = () => {
    if (!adminLinks || adminLinks.length === 0) {
      return (
        <TouchableOpacity
          onPress={() => {
            onClose();
            router.push("/(admin)/" as any);
          }}
          style={{
            backgroundColor: currentPath.includes('/(admin)') ? '#4a5568' : 'transparent',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 4,
            marginBottom: 8,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <MaterialIcons name="admin-panel-settings" size={18} color="white" />
          <Text style={{
            color: 'white',
            fontSize: 14,
            fontWeight: '500',
            marginLeft: 8
          }}>
            Admin Panel
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <>
        {adminLinks.map((link, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              onClose();
              router.push(link.path as any);
            }}
            style={{
              backgroundColor: currentPath === link.path ? '#4a5568' : 'transparent',
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 4,
              marginBottom: 8,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <MaterialIcons name={link.icon as any} size={18} color="white" />
            <Text style={{
              color: 'white',
              fontSize: 14,
              fontWeight: '500',
              marginLeft: 8
            }}>
              {link.label}
            </Text>
          </TouchableOpacity>
        ))}
      </>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={{ 
          width: screenWidth * 0.62, 
          height: '100%',
          backgroundColor: '#1a202c', 
          paddingTop: 20,
          paddingHorizontal: 0
        }}>
          {/* Main Navigation */}
          <View style={{
            paddingHorizontal: 16,
            marginBottom: 24
          }}>
            <TouchableOpacity
              onPress={() => {
                onClose();
                router.push("/(tabs)/" as any);
              }}
              style={{
                backgroundColor: currentPath === '/(tabs)/index' || currentPath === '/(tabs)/' ? '#4a5568' : 'transparent',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 4,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <MaterialIcons name="home" size={18} color="white" />
              <Text style={{
                color: 'white',
                fontSize: 14,
                fontWeight: '500',
                marginLeft: 8
              }}>
                Home
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => {
                onClose();
                router.push("/(tabs)/profile" as any);
              }}
              style={{
                backgroundColor: currentPath === '/(tabs)/profile' ? '#4a5568' : 'transparent',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 4,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <MaterialIcons name="person" size={18} color="white" />
              <Text style={{
                color: 'white',
                fontSize: 14,
                fontWeight: '500',
                marginLeft: 8
              }}>
                Profile
              </Text>
            </TouchableOpacity>
            
            {renderAdminLinks()}
          </View>
          
          {/* Language Toggle */}
          <View style={{ 
            flexDirection: 'row', 
            paddingHorizontal: 16,
            marginBottom: 20
          }}>
            <TouchableOpacity style={{
              backgroundColor: '#4a5568',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              marginRight: 4
            }}>
              <Text style={{ color: 'white', fontSize: 10 }}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              backgroundColor: 'transparent',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4
            }}>
              <Text style={{ color: '#a0aec0', fontSize: 10 }}>हिंदी</Text>
            </TouchableOpacity>
          </View>

          {/* Categories Header */}
          <Text style={{ 
            color: '#a0aec0', 
            fontSize: 12, 
            fontWeight: 'normal', 
            marginBottom: 16,
            paddingHorizontal: 16
          }}>
            Categories
          </Text>
          
          <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 16 }}>
            {[
              { key: 'ALL', label: 'All' },
              { key: NewsCategory.BUSINESS, label: 'Business' },
              { key: NewsCategory.POLITICS, label: 'Politics' },
              { key: NewsCategory.SPORT, label: 'Sports' },
              { key: NewsCategory.TECHNOLOGY, label: 'Technology' },
              { key: NewsCategory.ENTERTAINMENT, label: 'Entertainment' },
              { key: NewsCategory.HEALTH, label: 'Health' },
              { key: NewsCategory.GENERAL, label: 'General' },
              { key: NewsCategory.AUTOMOBILE, label: 'Automobile' },
              { key: NewsCategory.SCIENCE, label: 'Science' },
              { key: NewsCategory.TRAVEL, label: 'Travel' },
              { key: NewsCategory.MISCELLANEOUS, label: 'Miscellaneous' }
            ].map((category) => (
              <TouchableOpacity
                key={category.key}
                onPress={() => handleCategorySelect(category.key)}
                style={{
                  backgroundColor: selectedCategory === category.key ? '#4a5568' : 'transparent',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  marginBottom: 4,
                  borderRadius: 4
                }}
              >
                <Text style={{
                  color: selectedCategory === category.key ? 'white' : '#a0aec0',
                  fontSize: 14,
                  fontWeight: selectedCategory === category.key ? '500' : '400'
                }}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}; 