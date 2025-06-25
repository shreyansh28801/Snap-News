import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { APP_CONFIG, NEWS_CATEGORIES } from '../../../constants';
import { getCurrentUser } from '../../../services/auth';
import { createNews } from '../../../services/news';
import { sendBreakingNewsNotification } from '../../../services/notifications';
import { AddNewsFormData, NewsCategory } from '../../../types';

export default function CreateNewsScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [sourceLink, setSourceLink] = useState('');
  const [category, setCategory] = useState<NewsCategory>(NewsCategory.GENERAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isBreakingNews, setIsBreakingNews] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          // If not logged in, redirect to login
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

  const handleSubmit = async () => {
    // Form validation
    if (!title || !description || !imageLink || !sourceLink) {
      Alert.alert('Missing Fields', 'Please fill in all fields');
      return;
    }

    if (title.length > APP_CONFIG.validation.maxTitleLength) {
      Alert.alert('Title Too Long', `Title must be less than ${APP_CONFIG.validation.maxTitleLength} characters`);
      return;
    }

    if (description.length > APP_CONFIG.validation.maxDescriptionLength) {
      Alert.alert('Description Too Long', `Description must be less than ${APP_CONFIG.validation.maxDescriptionLength} characters`);
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create news document
      const newsDoc: AddNewsFormData = {
        title,
        description,
        image_link: imageLink,
        news_source_link: sourceLink,
        news_topic: isBreakingNews ? NewsCategory.BREAKING_NEWS : category,
        createdBy: user.uid,
        createdAt: new Date(),
        isActive: true,
        viewCount: 0,
        likes: 0
      };
      
      const createdNews = await createNews(newsDoc, user.uid);
      Alert.alert('Success', 'News article created successfully');

      // Send notification for breaking news (if it's marked as breaking news)
      if (isBreakingNews) {
        try {
          //console.log(`Sending breaking news notification for news ID: ${createdNews.id}`);
          await sendBreakingNewsNotification(createdNews.id, title);
          //console.log('Breaking news notification sent successfully');
        } catch (error) {
          //console.error('Error sending breaking news notification:', error);
          // Don't fail the submission if notification fails
        }
      }

      router.push('/(admin)/news/manage');
    } catch (error) {
      //console.error('Error creating news:', error);
      Alert.alert('Error', 'Failed to create news article');
    } finally {
      setIsSubmitting(false);
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
    <View style={{ flex: 1, backgroundColor: '#f5f7fa' }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
      }}>
        <TouchableOpacity 
          style={{ marginRight: 16 }}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#4b5563" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937' }}>
          Create New Article
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={{ flex: 1 }} 
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16 }}
        >
          <View style={{
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
            marginBottom: 24
          }}>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#4b5563', marginBottom: 6, fontWeight: '500' }}>
                Title *
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: '#1f2937'
                }}
                placeholder="Enter news title"
                value={title}
                onChangeText={setTitle}
                maxLength={APP_CONFIG.validation.maxTitleLength}
                editable={!isSubmitting}
              />
              <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                {title.length}/{APP_CONFIG.validation.maxTitleLength}
              </Text>
            </View>
            
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#4b5563', marginBottom: 6, fontWeight: '500' }}>
                Description *
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: '#1f2937',
                  height: 100,
                  textAlignVertical: 'top'
                }}
                placeholder="Enter news description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                maxLength={APP_CONFIG.validation.maxDescriptionLength}
                editable={!isSubmitting}
              />
              <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                {description.length}/{APP_CONFIG.validation.maxDescriptionLength}
              </Text>
            </View>
            
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#4b5563', marginBottom: 6, fontWeight: '500' }}>
                Image URL *
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: '#1f2937'
                }}
                placeholder="https://example.com/image.jpg"
                value={imageLink}
                onChangeText={(text) => {
                  setImageLink(text);
                  setImagePreviewError(false);
                }}
                keyboardType="url"
                autoCapitalize="none"
                editable={!isSubmitting}
              />
              
              {/* Image Preview */}
              {imageLink && !imagePreviewError && (
                <View style={{ marginTop: 8 }}>
                  <Image
                    source={{ uri: imageLink }}
                    style={{ 
                      width: '100%', 
                      height: 160, 
                      borderRadius: 6,
                      backgroundColor: '#f3f4f6'
                    }}
                    resizeMode="cover"
                    onError={() => setImagePreviewError(true)}
                  />
                </View>
              )}
              
              {imagePreviewError && (
                <Text style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>
                  Failed to load image. Please check the URL.
                </Text>
              )}
            </View>
            
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#4b5563', marginBottom: 6, fontWeight: '500' }}>
                Source Link *
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: '#1f2937'
                }}
                placeholder="https://example.com/article"
                value={sourceLink}
                onChangeText={setSourceLink}
                keyboardType="url"
                autoCapitalize="none"
                editable={!isSubmitting}
              />
            </View>
            
            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: '#4b5563', marginBottom: 8, fontWeight: '500' }}>
                Category *
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {NEWS_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat.key}
                      style={{
                        backgroundColor: category === cat.key ? '#3b82f6' : '#f3f4f6',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 16,
                      }}
                      onPress={() => setCategory(cat.key)}
                      disabled={isSubmitting}
                    >
                      <Text style={{ 
                        color: category === cat.key ? 'white' : '#4b5563',
                        fontWeight: '500'
                      }}>
                        {cat.icon} {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
            
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: 20,
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: '#fee2e2',
              borderRadius: 6
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="priority-high" size={24} color="#ef4444" />
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: '500', 
                  marginLeft: 8,
                  color: '#b91c1c'
                }}>
                  Breaking News
                </Text>
              </View>
              <Switch
                value={isBreakingNews}
                onValueChange={setIsBreakingNews}
                trackColor={{ false: '#d1d5db', true: '#fca5a5' }}
                thumbColor={isBreakingNews ? '#ef4444' : '#f4f4f5'}
              />
            </View>
            
            <TouchableOpacity
              style={{
                backgroundColor: isSubmitting ? '#9ca3af' : '#3b82f6',
                borderRadius: 6,
                paddingVertical: 12,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="check" size={20} color="white" />
                  <Text style={{ 
                    color: 'white', 
                    fontWeight: 'bold', 
                    marginLeft: 8,
                    fontSize: 16
                  }}>
                    Create Article
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
} 