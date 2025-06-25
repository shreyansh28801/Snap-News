import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getCurrentUser } from '../../services/auth';
import { fetchAllNews } from '../../services/news';

export default function AdminDashboard() {
  const [newsCount, setNewsCount] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Get user data
        const user = await getCurrentUser();
        setUserData(user);
        
        // Get all news
        const news = await fetchAllNews(100); // Get up to 100 news articles
        setNewsCount(news.length);
        
        // Calculate category counts
        const counts: Record<string, number> = {};
        news.forEach(item => {
          counts[item.news_topic] = (counts[item.news_topic] || 0) + 1;
        });
        setCategoryCounts(counts);
      } catch (error) {
        //console.error('Error loading admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={{ marginTop: 10 }}>Loading dashboard data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f7fa' }}>
      <View style={{ padding: 16 }}>
        {/* Welcome Section */}
        <View style={{ 
          backgroundColor: 'white', 
          borderRadius: 8, 
          padding: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2
        }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>
            Welcome, {userData?.displayName || 'Admin'}
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
            Manage your news articles and content
          </Text>
        </View>
        
        {/* Stats Section */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 12 }}>
          Overview
        </Text>
        
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginBottom: 24,
          gap: 12
        }}>
          {/* Total News Stat */}
          <View style={{
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 16,
            width: '48%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="article" size={24} color="#3b82f6" />
              <Text style={{ marginLeft: 8, fontSize: 14, color: '#6b7280' }}>
                Total Articles
              </Text>
            </View>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginTop: 4 }}>
              {newsCount}
            </Text>
          </View>
          
          {/* Categories Stat */}
          <View style={{
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 16,
            width: '48%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="category" size={24} color="#10b981" />
              <Text style={{ marginLeft: 8, fontSize: 14, color: '#6b7280' }}>
                Categories
              </Text>
            </View>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginTop: 4 }}>
              {Object.keys(categoryCounts).length}
            </Text>
          </View>
        </View>
        
        {/* Quick Actions */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 12 }}>
          Quick Actions
        </Text>
        
        <View style={{ marginBottom: 24 }}>
          <Link href="/(admin)/news/create" asChild>
            <TouchableOpacity style={{
              backgroundColor: 'white',
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2
            }}>
              <View style={{
                backgroundColor: '#3b82f6',
                borderRadius: 8,
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16
              }}>
                <MaterialIcons name="add" size={24} color="white" />
              </View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>
                  Add New Article
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>
                  Create a new news article
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </Link>
          
          <Link href="/(admin)/news/manage" asChild>
            <TouchableOpacity style={{
              backgroundColor: 'white',
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2
            }}>
              <View style={{
                backgroundColor: '#10b981',
                borderRadius: 8,
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16
              }}>
                <MaterialIcons name="edit" size={24} color="white" />
              </View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>
                  Manage Articles
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>
                  Edit or delete existing articles
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </Link>
        </View>
        
        {/* Category Distribution */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 12 }}>
          Category Distribution
        </Text>
        
        <View style={{
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2
        }}>
          {Object.entries(categoryCounts).length > 0 ? (
            Object.entries(categoryCounts).map(([category, count]) => (
              <View key={category} style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: '#f3f4f6'
              }}>
                <Text style={{ fontSize: 14, color: '#4b5563' }}>{category}</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1f2937' }}>{count} articles</Text>
              </View>
            ))
          ) : (
            <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', padding: 16 }}>
              No articles found
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
} 