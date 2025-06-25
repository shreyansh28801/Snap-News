import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { news_not_found_card } from '../../constants/index';
import { getUserById } from '../../services/firebase';
import { fetchAllNews, fetchNewsByCategory } from '../../services/news';
import { News, NewsCategory } from '../../types';
import { useSidebar } from './_layout';

interface NewsWithUsername extends News {
  createdByUsername?: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.88; // 88% of screen height

export default function NewsFeedScreen() {
  const [news, setNews] = useState<NewsWithUsername[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});
  
  // Animation value
  const translateY = useSharedValue(0);
  
  // Use global sidebar context
  const { selectedCategory } = useSidebar();

  useEffect(() => {
    loadNews();
  }, [selectedCategory]);

  // Reset current index when news array changes
  useEffect(() => {
    setCurrentIndex(0);
    translateY.value = 0;
    setExpandedDescriptions({});
  }, [news]);

  const loadNews = async () => {
    try {
      console.log('Loading news for category:', selectedCategory);
      setIsLoading(true);
      
      let newsData: News[];
      if (selectedCategory === 'ALL') {
        newsData = await fetchAllNews(10);
      } else {
        newsData = await fetchNewsByCategory(selectedCategory as NewsCategory, 10);
      }
      
      // Check if we got any news data
      if (!newsData || newsData.length === 0) {
        console.log('No news data found for category:', selectedCategory);
        setNews([news_not_found_card]);
        setIsLoading(false);
        setRefreshing(false);
        return;
      }
      
      // Fetch usernames for each news item
      const newsWithUsernames = await Promise.all(
        newsData.map(async (item) => {
          const user = await getUserById(item.createdBy);
          return {
            ...item,
            createdByUsername: user?.displayName || 'Unknown User'
          };
        })
      );
      
      setNews(newsWithUsernames);
    } catch (error) {
      console.error('Error loading news:', error);
      setNews([news_not_found_card]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNews();
  };

  const handleImageError = (itemId: string) => {
    console.log('Image failed to load for item:', itemId);
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const handleSourcePress = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  const toggleDescription = (newsId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [newsId]: !prev[newsId]
    }));
  };

  const handleSwipeUp = () => {
    if (transitioning) return;
    
    setTransitioning(true);
    
    // Move to next card with delay to allow animation to complete
    setTimeout(() => {
      if (currentIndex < news.length - 1) {
        setCurrentIndex(currentIndex + 1);
        translateY.value = 0;
      } else {
        // We've reached the end, refresh if needed
        onRefresh();
      }
      setTransitioning(false);
    }, 300);
  };

  const handleSwipeDown = () => {
    if (transitioning) return;
    
    setTransitioning(true);
    
    // Move to previous card with delay to allow animation to complete
    setTimeout(() => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        translateY.value = 0;
      }
      setTransitioning(false);
    }, 300);
  };

  // Configure gesture
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow swiping if there's more than one news item
      if (news.length > 1) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      // If there's only one news item, don't allow swiping
      if (news.length <= 1) {
        translateY.value = withSpring(0);
        return;
      }
      
      if (event.translationY < -100) {
        // Swiped up - only if not at the end
        if (currentIndex < news.length - 1) {
          translateY.value = withSpring(-SCREEN_HEIGHT);
          runOnJS(handleSwipeUp)();
        } else {
          // Bounce back if at the end
          translateY.value = withSpring(0);
        }
      } else if (event.translationY > 100) {
        // Swiped down - only if not at the beginning
        if (currentIndex > 0) {
          translateY.value = withSpring(SCREEN_HEIGHT);
          runOnJS(handleSwipeDown)();
        } else {
          // Bounce back if at the beginning
          translateY.value = withSpring(0);
        }
      } else {
        // Return to original position
        translateY.value = withSpring(0);
      }
    });

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading news...</Text>
      </View>
    );
  }

  if (news.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="article" size={48} color="#9ca3af" />
        <Text style={styles.emptyText}>
          No news available in this category
        </Text>
        <Text style={styles.emptySubText}>
          Try selecting a different category or add news articles using the "Add News" tab.
        </Text>
      </View>
    );
  }

  // Ensure currentIndex is valid
  const safeIndex = Math.min(Math.max(0, currentIndex), news.length - 1);
  const currentNews = news[safeIndex];
  
  // Safety check - if somehow currentNews is still undefined, show an error state
  if (!currentNews) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="error" size={48} color="#ef4444" />
        <Text style={styles.emptyText}>
          Error loading news
        </Text>
        <Text style={styles.emptySubText}>
          Please try again later
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Swipable Card */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          
          {/* Image Section */}
          <View style={styles.imageContainer}>
            {currentNews.image_link && !imageErrors[currentNews.id] ? (
              <Image
                source={{ uri: currentNews.image_link }}
                style={styles.image}
                resizeMode="contain"
                onError={() => handleImageError(currentNews.id)}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialIcons name="image" size={32} color="#9ca3af" />
              </View>
            )}
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            {/* Title */}
            <Text style={styles.title}>
              {currentNews.title}
            </Text>

            {/* Description */}
            {expandedDescriptions[currentNews.id] ? (
              <View style={styles.descriptionWrapper}>
                <ScrollView 
                  style={styles.descriptionContainerExpanded} 
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  <Text style={styles.description}>
                    {currentNews.description}
                  </Text>
                </ScrollView>
                <TouchableOpacity 
                  style={styles.readMoreButton}
                  onPress={() => toggleDescription(currentNews.id)}
                >
                  <Text style={styles.readMoreText}>Read Less</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.descriptionContainer}>
                <Text style={styles.description} numberOfLines={10}>
                  {currentNews.description}
                </Text>
                {currentNews.description.length > 200 && (
                  <TouchableOpacity 
                    style={styles.readMoreButton}
                    onPress={() => toggleDescription(currentNews.id)}
                  >
                    <Text style={styles.readMoreText}>Read More</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.timeText}>
                {new Date(currentNews.createdAt).toLocaleDateString()} | {currentNews.createdByUsername || 'Staff Reporter'} | {currentNews.news_source_link.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
              </Text>
            </View>
          </View>

          {/* Bottom Actions */}
          <View style={styles.actionsContainer}>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.bookmarkButton}>
                <MaterialIcons name="bookmark-border" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.sourceButton}
                onPress={() => handleSourcePress(currentNews.news_source_link)}
              >
                <MaterialIcons name="open-in-new" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <MaterialIcons name="share" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            {news.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.progressDot, 
                  index === currentIndex && styles.progressDotActive
                ]} 
              />
            ))}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfoText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubText: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
  },
  logoContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f43142',
  },
  imageContainer: {
    height: SCREEN_HEIGHT * 0.3,
    backgroundColor: '#000000'
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
  },
  contentContainer: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    lineHeight: 28,
  },
  descriptionContainer: {
    flex: 1,
  },
  descriptionWrapper: {
    flex: 1,
    marginBottom: 8,
  },
  descriptionContainerExpanded: {
    height: SCREEN_HEIGHT * 0.2,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  bookmarkButton: {
    padding: 8,
  },
  sourceButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(107, 114, 128, 0.3)',
  },
  progressDotActive: {
    backgroundColor: '#f43142',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  positionIndicator: {
    fontSize: 14,
    color: '#6b7280',
  },
  readMoreButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f43142',
  },
}); 