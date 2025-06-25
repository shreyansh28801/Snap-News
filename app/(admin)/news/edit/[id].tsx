import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { APP_CONFIG, NEWS_CATEGORIES } from '../../../../constants';
import { getNewsById, updateNews } from '../../../../services/news';
import { NewsCategory } from '../../../../types';

export default function EditNewsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [sourceLink, setSourceLink] = useState('');
  const [category, setCategory] = useState<NewsCategory>(NewsCategory.GENERAL);
  const [isActive, setIsActive] = useState(true);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!id) {
      Alert.alert('Error', 'News ID is required');
      router.back();
      return;
    }
    
    const loadNews = async () => {
      try {
        setIsLoading(true);
        const news = await getNewsById(id);
        
        if (!news) {
          Alert.alert('Error', 'News article not found');
          router.back();
          return;
        }
        
        // Populate form fields
        setTitle(news.title);
        setDescription(news.description);
        setImageLink(news.image_link);
        setSourceLink(news.news_source_link);
        setCategory(news.news_topic as NewsCategory);
        setIsActive(news.isActive);
      } catch (error) {
        //console.error('Error loading news:', error);
        Alert.alert('Error', 'Failed to load news article');
        router.back();
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNews();
  }, [id, router]);

  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return false;
    }

    if (title.length > APP_CONFIG.validation.maxTitleLength) {
      Alert.alert('Error', `Title must be less than ${APP_CONFIG.validation.maxTitleLength} characters`);
      return false;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return false;
    }

    if (description.length > APP_CONFIG.validation.maxDescriptionLength) {
      Alert.alert('Error', `Description must be less than ${APP_CONFIG.validation.maxDescriptionLength} characters`);
      return false;
    }

    if (!imageLink.trim()) {
      Alert.alert('Error', 'Please enter an image URL');
      return false;
    }

    if (!sourceLink.trim()) {
      Alert.alert('Error', 'Please enter a source URL');
      return false;
    }

    // Basic URL validation
    const urlPattern = /^https?:\/\/.+/;

    if (!urlPattern.test(sourceLink)) {
      Alert.alert('Error', 'Please enter a valid source URL starting with http:// or https://');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateNews(id, {
        title: title.trim(),
        description: description.trim(),
        image_link: imageLink.trim(),
        news_source_link: sourceLink.trim(),
        news_topic: category,
        isActive
      });
      
      Alert.alert('Success', 'News article updated successfully');
      router.push('/(admin)/news/manage');
    } catch (error) {
      //console.error('Error updating news:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Error', `Failed to update news: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 12 }}>Loading article...</Text>
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
          Edit Article
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
                  setImageError(false);
                }}
                keyboardType="url"
                autoCapitalize="none"
                editable={!isSubmitting}
              />
              
              {/* Image Preview */}
              {imageLink && !imageError && (
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
                    onError={() => setImageError(true)}
                  />
                </View>
              )}
              
              {imageError && (
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
            
            <View style={{ marginBottom: 16 }}>
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
            
            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: '#4b5563', marginBottom: 8, fontWeight: '500' }}>
                Status
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: isActive ? '#10b981' : '#f3f4f6',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 16,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                  onPress={() => setIsActive(true)}
                  disabled={isSubmitting}
                >
                  <MaterialIcons name="check-circle" size={16} color={isActive ? 'white' : '#4b5563'} />
                  <Text style={{ 
                    color: isActive ? 'white' : '#4b5563',
                    fontWeight: '500',
                    marginLeft: 4
                  }}>
                    Active
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={{
                    backgroundColor: !isActive ? '#ef4444' : '#f3f4f6',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 16,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                  onPress={() => setIsActive(false)}
                  disabled={isSubmitting}
                >
                  <MaterialIcons name="cancel" size={16} color={!isActive ? 'white' : '#4b5563'} />
                  <Text style={{ 
                    color: !isActive ? 'white' : '#4b5563',
                    fontWeight: '500',
                    marginLeft: 4
                  }}>
                    Inactive
                  </Text>
                </TouchableOpacity>
              </View>
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
                  <MaterialIcons name="save" size={20} color="white" />
                  <Text style={{ 
                    color: 'white', 
                    fontWeight: 'bold', 
                    marginLeft: 8,
                    fontSize: 16
                  }}>
                    Save Changes
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