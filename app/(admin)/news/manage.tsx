import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { getCurrentUser } from '../../../services/auth';
import { deleteNews, fetchAllNews } from '../../../services/news';
import { News } from '../../../types';

// Helper function to format time ago
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};

export default function ManageNews() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

  const loadUser = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        //console.log('Current user ID:', user.uid);
        setCurrentUserId(user.uid);
      } else {
        //console.warn('No authenticated user found');
      }
    } catch (error) {
      //console.error('Error loading user:', error);
    }
  };

  const loadNews = async () => {
    try {
      setIsLoading(true);
      const newsData = await fetchAllNews(100); // Get up to 100 news articles
      setNews(newsData);
    } catch (error) {
      //console.error('Error loading news:', error);
      Alert.alert('Error', 'Failed to load news articles');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUser();
    loadNews();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadNews();
  };

  const handleDeleteNews = async (newsId: string, title: string, createdBy: string) => {
    //console.log(`Delete button clicked for news: ${newsId} - ${title}`);
    
    // Check if the user is authorized to delete this news
    if (currentUserId !== createdBy) {
      //console.error('Unauthorized delete attempt:', { newsId, currentUserId, createdBy });
      Alert.alert('Permission Denied', 'You can only delete news articles that you created.');
      return;
    }
    
  
    try {
      //console.log(`Confirming delete for news: ${newsId}`);
      await deleteNews(newsId);
      //console.log('Delete operation completed');
      
      // Remove from local state
      setNews(prevNews => {
        //console.log(`Removing news ${newsId} from state. Before: ${prevNews.length} items`);
        const updatedNews = prevNews.filter(item => item.id !== newsId);
        //console.log(`After removal: ${updatedNews.length} items`);
        return updatedNews;
      });
      
      Alert.alert('Success', 'Article deleted successfully');
    } catch (error) {
      //console.error('Error deleting news:', error);
      Alert.alert('Error', 'Failed to delete article');
    }
  
  };

  // Filter and search news
  const filteredNews = news.filter(item => {
    const matchesSearch = 
      !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = !filter || item.news_topic === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Get unique categories for filter
  const categories = [...new Set(news.map(item => item.news_topic))];

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={{ marginTop: 10 }}>Loading articles...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f7fa' }}>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
      }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937' }}>
          Manage Articles
        </Text>
        
        <Link href="/(admin)/news/create" asChild>
          <TouchableOpacity style={{
            backgroundColor: '#3b82f6',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 6,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <MaterialIcons name="add" size={18} color="white" />
            <Text style={{ color: 'white', marginLeft: 4, fontWeight: '500' }}>
              Add New
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      
      {/* Search and Filter */}
      <View style={{ 
        padding: 16, 
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#f3f4f6',
          borderRadius: 8,
          paddingHorizontal: 12,
          marginBottom: 12
        }}>
          <MaterialIcons name="search" size={20} color="#6b7280" />
          <TextInput
            style={{ 
              flex: 1, 
              paddingVertical: 10, 
              paddingHorizontal: 8,
              color: '#4b5563'
            }}
            placeholder="Search articles..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="clear" size={20} color="#6b7280" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={{
              backgroundColor: filter === null ? '#3b82f6' : '#e5e7eb',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              marginRight: 8
            }}
            onPress={() => setFilter(null)}
          >
            <Text style={{ 
              color: filter === null ? 'white' : '#4b5563',
              fontWeight: '500'
            }}>
              All
            </Text>
          </TouchableOpacity>
          
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={{
                backgroundColor: filter === category ? '#3b82f6' : '#e5e7eb',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                marginRight: 8
              }}
              onPress={() => setFilter(category)}
            >
              <Text style={{ 
                color: filter === category ? 'white' : '#4b5563',
                fontWeight: '500'
              }}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ padding: 16 }}>
          {filteredNews.length === 0 ? (
            <View style={{
              backgroundColor: 'white',
              borderRadius: 8,
              padding: 24,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2
            }}>
              <MaterialIcons name="search-off" size={48} color="#9ca3af" />
              <Text style={{ 
                fontSize: 18, 
                color: '#374151', 
                textAlign: 'center', 
                marginTop: 16 
              }}>
                No articles found
              </Text>
              <Text style={{ 
                color: '#6b7280', 
                textAlign: 'center', 
                marginTop: 8 
              }}>
                Try changing your search or filter criteria
              </Text>
            </View>
          ) : (
            filteredNews.map(item => (
              <View key={item.id} style={{
                backgroundColor: 'white',
                borderRadius: 8,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
                overflow: 'hidden'
              }}>
                <View style={{
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f3f4f6'
                }}>
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    marginBottom: 4
                  }}>
                    <Text style={{ 
                      fontSize: 16, 
                      fontWeight: 'bold', 
                      color: '#1f2937',
                      flex: 1,
                      marginRight: 8
                    }}>
                      {item.title}
                    </Text>
                    <View style={{
                      backgroundColor: '#f3f4f6',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 4
                    }}>
                      <Text style={{ fontSize: 12, color: '#4b5563' }}>
                        {item.news_topic}
                      </Text>
                    </View>
                  </View>
                  
                  <Text 
                    style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons name="schedule" size={14} color="#9ca3af" />
                    <Text style={{ fontSize: 12, color: '#9ca3af', marginLeft: 4 }}>
                      {formatTimeAgo(new Date(item.createdAt))}
                    </Text>
                    
                    <MaterialIcons name="visibility" size={14} color="#9ca3af" style={{ marginLeft: 12 }} />
                    <Text style={{ fontSize: 12, color: '#9ca3af', marginLeft: 4 }}>
                      {item.viewCount} views
                    </Text>
                  </View>
                </View>
                
                <View style={{
                  flexDirection: 'row',
                  borderTopWidth: 1,
                  borderTopColor: '#f3f4f6'
                }}>
                  <TouchableOpacity 
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRightWidth: 1,
                      borderRightColor: '#f3f4f6'
                    }}
                    onPress={() => router.push(`/(admin)/news/edit/${item.id}`)}
                  >
                    <MaterialIcons name="edit" size={16} color="#3b82f6" />
                    <Text style={{ color: '#3b82f6', marginLeft: 4, fontWeight: '500' }}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    onPress={() => handleDeleteNews(item.id, item.title, item.createdBy)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="delete" size={16} color="#ef4444" />
                    <Text style={{ color: '#ef4444', marginLeft: 4, fontWeight: '500' }}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
} 