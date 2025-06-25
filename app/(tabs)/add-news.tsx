import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { APP_CONFIG, NEWS_CATEGORIES } from '../../constants';
import { getCurrentUser } from '../../services/auth';
import { createNews } from '../../services/news';
import { NewsCategory } from '../../types';



export default function AddNewsScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [sourceLink, setSourceLink] = useState('');
  const [category, setCategory] = useState<NewsCategory>(NewsCategory.GENERAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const validateForm = (): boolean => {
    if (!title.trim()) {
      //console.log('Title is empty');
      Alert.alert('Error', 'Please enter a title');
      return false;
    }

    if (title.length > APP_CONFIG.validation.maxTitleLength) {
      //console.log('Title is too long');
      Alert.alert('Error', `Title must be less than ${APP_CONFIG.validation.maxTitleLength} characters`);
      return false;
    }

    if (!description.trim()) {
      //console.log('Description is empty');
      Alert.alert('Error', 'Please enter a description');
      return false;
    }

    if (description.length > APP_CONFIG.validation.maxDescriptionLength) {
      //console.log('Description is too long');
      Alert.alert('Error', `Description must be less than ${APP_CONFIG.validation.maxDescriptionLength} characters`);
      return false;
    }

    if (!imageLink.trim()) {
      //console.log('Image URL is empty');
      Alert.alert('Error', 'Please enter an image URL');
      return false;
    }

    if (!sourceLink.trim()) {
      //console.log('Source URL is empty');
      Alert.alert('Error', 'Please enter a source URL');
      return false;
    }

    // Basic URL validation
    const urlPattern = /^https?:\/\/.+/;

    if (!urlPattern.test(sourceLink)) {
      //console.log('Source URL is invalid');
      Alert.alert('Error', 'Please enter a valid source URL starting with http:// or https://');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    //console.log('Submit button pressed');
    
    if (!validateForm()) {
      //console.log('Form validation failed');
      return;
    }

    setIsSubmitting(true);
    //console.log('Form validated, starting submission...');

    try {
      // Get current user
      //console.log('Getting current user...');
      const user = await getCurrentUser();
      //console.log('Current user:', user);
      
      if (!user) {
        //console.log('No user found, redirecting to login');
        Alert.alert('Error', 'You must be logged in to add news');
        router.replace('/');
        return;
      }

      const newsDoc = {
        title: title.trim(),
        description: description.trim(),
        image_link: imageLink.trim(),
        news_source_link: sourceLink.trim(),
        news_topic: category, // This will be the enum value like 'General'
        createdBy: user.uid,
        createdAt: new Date(),
        isActive: true,
        viewCount: 0,
        likes: 0
      };

      //console.log('Submitting news document:', newsDoc);

      const createdNews = await createNews(newsDoc, user.uid);
      //console.log('News created:', createdNews);
      Alert.alert('Success', 'News article created successfully');
      router.push('/(tabs)');
    } catch (error) {
      //console.error('Error creating news:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Error', `Failed to save news: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-gray-100" keyboardShouldPersistTaps="handled">
        <View className="p-4">
          <View className="bg-white rounded-lg p-4 shadow">
            <Text className="text-xl font-bold mb-4">Add News Article</Text>
            
            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 mb-1">Title *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter news title"
                  value={title}
                  onChangeText={setTitle}
                  maxLength={APP_CONFIG.validation.maxTitleLength}
                  editable={!isSubmitting}
                />
                <Text className="text-xs text-gray-500 mt-1">
                  {title.length}/{APP_CONFIG.validation.maxTitleLength}
                </Text>
              </View>
              
              <View>
                <Text className="text-gray-700 mb-1">Description *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter news description"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={APP_CONFIG.validation.maxDescriptionLength}
                  editable={!isSubmitting}
                />
                <Text className="text-xs text-gray-500 mt-1">
                  {description.length}/{APP_CONFIG.validation.maxDescriptionLength}
                </Text>
              </View>
              
              <View>
                <Text className="text-gray-700 mb-1">Image URL *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://example.com/image.jpg"
                  value={imageLink}
                  onChangeText={(text) => {
                    setImageLink(text);
                    setImageError(false);
                  }}
                  keyboardType="url"
                  autoCapitalize="none"
                  editable={!isSubmitting}
                />
                
                {/* Image Preview */}
                {imageLink && !imageError && (
                  <View className="mt-2">
                    <Image
                      source={{ uri: imageLink }}
                      className="w-full h-40 rounded-lg"
                      resizeMode="cover"
                      onError={() => setImageError(true)}
                    />
                  </View>
                )}
                
                {imageError && (
                  <Text className="text-red-600 text-sm mt-1">
                    Failed to load image. Please check the URL.
                  </Text>
                )}
              </View>
              
              <View>
                <Text className="text-gray-700 mb-1">Source Link *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://example.com/article"
                  value={sourceLink}
                  onChangeText={setSourceLink}
                  keyboardType="url"
                  autoCapitalize="none"
                  editable={!isSubmitting}
                />
              </View>
              
              <View>
                <Text className="text-gray-700 mb-1">Category *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row space-x-2">
                    {NEWS_CATEGORIES.map((cat) => (
                      <TouchableOpacity
                        key={cat.key}
                        className={`px-4 py-2 rounded-full ${
                          category === cat.key ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                        onPress={() => setCategory(cat.key)}
                        disabled={isSubmitting}
                      >
                        <Text className={`${category === cat.key ? 'text-white' : 'text-gray-700'} font-medium`}>
                          {cat.icon} {cat.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
              
              <TouchableOpacity
                className={`rounded-lg py-3 mt-4 ${
                  isSubmitting ? 'bg-gray-400' : 'bg-blue-600'
                }`}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold text-lg">
                    Submit News
                  </Text>
                )}
              </TouchableOpacity>

              {/* Test News Collection Button */}
              <TouchableOpacity
                className="bg-purple-600 rounded-lg py-3 mt-2"
                onPress={async () => {
                  try {
                    const user = await getCurrentUser();
                    
                    if (!user) {
                      Alert.alert('Error', 'Not logged in');
                      return;
                    }
                  } catch (error) {
                    //console.error('News collection test error:', error);
                    Alert.alert('News Collection Error', error instanceof Error ? error.message : 'Unknown error');
                  }
                }}
              >
                <Text className="text-white text-center font-semibold">Test News Collection</Text>
              </TouchableOpacity>

              {/* Debug Category Button */}
              <TouchableOpacity
                className="bg-orange-600 rounded-lg py-3 mt-2"
                onPress={() => {
                  //console.log('Current category value:', category);
                  //console.log('Category type:', typeof category);
                  //console.log('NewsCategory.GENERAL:', NewsCategory.GENERAL);
                  Alert.alert('Debug Info', `Category: ${category}\nType: ${typeof category}\nNewsCategory.GENERAL: ${NewsCategory.GENERAL}`);
                }}
              >
                <Text className="text-white text-center font-semibold">Debug Category Value</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 