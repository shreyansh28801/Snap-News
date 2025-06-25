import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants';
import { News } from '../types';

interface NewsCardProps {
  news: News;
  onViewSourcePress?: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.6; // 60% of screen width

export const NewsCard: React.FC<NewsCardProps> = ({ news, onViewSourcePress }) => {
  const handleSourcePress = async () => {
    if (onViewSourcePress) {
      onViewSourcePress();
    }
    
    try {
      await Linking.openURL(news.news_source_link);
    } catch (error) {
      //console.error('Failed to open URL:', error);
    }
  };

  const getCategoryColor = () => {
    return COLORS.categoryColors[news.news_topic as keyof typeof COLORS.categoryColors] || COLORS.primary;
  };

  return (
    <View className="flex-1 bg-white" style={{ 
      width: CARD_WIDTH, 
      height: SCREEN_HEIGHT,
      alignSelf: 'center' // Center the card horizontally
    }}>
      {/* Image Section */}
      <View className="relative" style={{ height: SCREEN_HEIGHT * 0.4 }}>
        <Image
          source={{ uri: news.image_link }}
          className="w-full h-full"
          resizeMode="cover"
        />
        
        {/* Category Badge */}
        <View 
          className="absolute top-4 left-4 px-3 py-1 rounded-full"
          style={{ backgroundColor: getCategoryColor() }}
        >
          <Text className="text-white text-sm font-semibold">{news.news_topic}</Text>
        </View>
      </View>

      {/* Content Section */}
      <View className="flex-1 p-4">
        {/* Title */}
        <Text className="text-2xl font-bold text-gray-900 mb-3">
          {news.title}
        </Text>

        {/* Description */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Text className="text-base text-gray-700 leading-6">
            {news.description}
          </Text>
        </ScrollView>

        {/* Footer */}
        <View className="mt-4">
          {/* Source Button */}
          <TouchableOpacity
            onPress={handleSourcePress}
            className="bg-blue-600 rounded-lg py-3 px-4 flex-row items-center justify-center mb-3"
          >
            <MaterialIcons name="open-in-new" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Read Full Story</Text>
          </TouchableOpacity>

          {/* Stats */}
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-500">
              {new Date(news.createdAt).toLocaleDateString()}
            </Text>
            <View className="flex-row items-center space-x-4">
              <View className="flex-row items-center">
                <MaterialIcons name="visibility" size={16} color="#666" />
                <Text className="text-sm text-gray-600 ml-1">{news.viewCount || 0}</Text>
              </View>
              <View className="flex-row items-center">
                <MaterialIcons name="favorite-border" size={16} color="#666" />
                <Text className="text-sm text-gray-600 ml-1">{news.likes || 0}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Swipe Hint */}
      <View className="absolute bottom-8 left-0 right-0 items-center">
        <View className="bg-black/20 px-4 py-2 rounded-full">
          <Text className="text-white text-xs">Swipe up for next</Text>
        </View>
      </View>
    </View>
  );
}; 