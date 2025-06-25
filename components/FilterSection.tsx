import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { NewsCategory } from '../types';
import { NEWS_CATEGORIES, COLORS } from '../constants';

interface FilterSectionProps {
  selectedCategory: NewsCategory | null;
  onSelectCategory: (category: NewsCategory | null) => void;
  onClose: () => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  onClose,
}) => {
  return (
    <View className="absolute top-24 left-4 right-4 bg-white rounded-xl p-4 shadow-lg">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold">Filter by Category</Text>
        <TouchableOpacity onPress={onClose}>
          <Text className="text-gray-500">✕</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => {
            onSelectCategory(null);
            onClose();
          }}
          className={`px-4 py-2 rounded-full mr-2 ${
            !selectedCategory ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <Text className={`font-semibold ${!selectedCategory ? 'text-white' : 'text-gray-700'}`}>
            All News
          </Text>
        </TouchableOpacity>
        
        {NEWS_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            onPress={() => {
              onSelectCategory(cat.key);
              onClose();
            }}
            className={`px-4 py-2 rounded-full mr-2 ${
              selectedCategory === cat.key ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <Text
              className={`font-semibold ${
                selectedCategory === cat.key ? 'text-white' : 'text-gray-700'
              }`}
            >
              {cat.icon} {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}; 