import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { APP_CONFIG, ERROR_MESSAGES } from '../constants';
import { AddNewsFormData, News, NewsCategory } from '../types';

type DocumentData = { [key: string]: any };
const convertDocToNews = (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot): News => {
  const data = doc.data() as DocumentData;
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    image_link: data.image_link,
    news_source_link: data.news_source_link,
    news_topic: data.news_topic,
    createdBy: data.createdBy,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate(),
    isActive: data.isActive ?? true,
    viewCount: data.viewCount || 0,
    likes: data.likes || 0
  };
};


  // Convert Firestore document to News type


// Create news document
export const createNews = async (
  newsData: AddNewsFormData,
  userId: string
): Promise<News> => {
  //console.log('createNews called with:', { newsData, userId });
  
  try {
    // Create the document without serverTimestamp first
    const newsDoc = {
      title: newsData.title,
      description: newsData.description,
      image_link: newsData.image_link,
      news_source_link: newsData.news_source_link,
      news_topic: newsData.news_topic,
      createdBy: userId,
      createdAt: new Date(), // Use regular Date for now
      isActive: true,
      viewCount: 0,
      likes: 0
    };

    //console.log('Attempting to add document to Firestore:', newsDoc);
    //console.log('Collection path:', APP_CONFIG.collections.news);

    const docRef = await firestore()
      .collection(APP_CONFIG.collections.news)
      .add(newsDoc);


    //console.log('Document created with ID:', docRef.id);

    // Return the created news object
    return {
      id: docRef.id,
      ...newsData,
      createdBy: userId,
      createdAt: new Date(),
      isActive: true,
      viewCount: 0,
      likes: 0
    };
  } catch (error) {
    //console.error('Error creating news - Full error:', error);
    if (error instanceof Error) {
      //console.error('Error message:', error.message);
      //console.error('Error stack:', error.stack);
    }
    throw new Error(ERROR_MESSAGES.news.addFailed);
  }
};

// Fetch all news (with optional limit)
export const fetchAllNews = async (limitCount: number = 50): Promise<News[]> => {
  try {
    //console.log('Fetching all news with limit:', limitCount);
    const querySnapshot = await firestore()
      .collection(APP_CONFIG.collections.news)
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
      .get();

  
    const news: News[] = [];

    querySnapshot.forEach((doc) => {
      news.push(convertDocToNews(doc));
    });

    //console.log('Fetched news:', news);

    return news;
  } catch (error) {
    //console.error('Error fetching news:', error);
    throw new Error(ERROR_MESSAGES.news.loadFailed);
  }
};

// Fetch news by category
export const fetchNewsByCategory = async (
  category: NewsCategory,
  limitCount: number = 50
): Promise<News[]> => {
  try {

    const querySnapshot = await firestore()
      .collection(APP_CONFIG.collections.news)
      .where('isActive', '==', true)
      .where('news_topic', '==', category)
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
      .get();

    const news: News[] = [];

    querySnapshot.forEach((doc) => {
      news.push(convertDocToNews(doc));
    });

    return news;
  } catch (error) {
    //console.error('Error fetching news by category:', error);
    throw new Error(ERROR_MESSAGES.news.loadFailed);
  }
};

// Fetch news by user
export const fetchNewsByUser = async (userId: string): Promise<News[]> => {
  try {
    const querySnapshot = await firestore()
      .collection(APP_CONFIG.collections.news)
      .where('createdBy', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const news: News[] = [];

    querySnapshot.forEach((doc) => {
      news.push(convertDocToNews(doc));
    });

    return news;
  } catch (error) {
    //console.error('Error fetching user news:', error);
    throw new Error(ERROR_MESSAGES.news.loadFailed);
  }
};

// Update news document
export const updateNews = async (
  newsId: string,
  updates: Partial<News>
): Promise<void> => {
  try {
    // Remove fields that shouldn't be updated
    const { id, createdAt, createdBy, ...updateData } = updates;
    
    const newsRef = firestore()
    .collection(APP_CONFIG.collections.news)
    .doc(newsId);
  
    await newsRef.update({
      ...updateData,
      updatedAt: firestore.FieldValue.serverTimestamp()
    });
  
  } catch (error) {
    //console.error('Error updating news:', error);
    throw new Error('Failed to update news article');
  }
};

// Delete news (actually delete the document)
export const deleteNews = async (newsId: string): Promise<void> => {
  //console.log(`Deleting news with ID: ${newsId}`);
  try {
    //console.log(`Deleting news with ID: ${newsId}`);
    
    // First check if the document exists
    const newsRef = firestore()
    .collection(APP_CONFIG.collections.news)
    .doc(newsId);
    const newsDoc = await newsRef.get();
    
    if (!newsDoc.exists()) {
      //console.error(`News with ID ${newsId} does not exist`);
      throw new Error(`News article not found with ID: ${newsId}`);
    }
    
    // Hard delete the document
    await newsRef.delete();
    //console.log(`News with ID ${newsId} deleted successfully`);
  } catch (error) {
    //console.error('Error deleting news:', error);
    // Provide more specific error message if possible
    if (error instanceof Error) {
      if (error.message.includes('permission-denied')) {
        throw new Error('You do not have permission to delete this article');
      } else if (error.message.includes('not-found')) {
        throw new Error('Article not found or already deleted');
      } else {
        //console.error('Error stack:', error.stack);
        throw new Error('Failed to delete news article: ' + error.message);
      }
    } else {
      throw new Error('Failed to delete news article');
    }
  }
};

// Increment view count
export const incrementViewCount = async (newsId: string): Promise<void> => {
  try {
    const newsRef = firestore()
      .collection(APP_CONFIG.collections.news)
      .doc(newsId);

    const newsDoc = await newsRef.get();

    
    if (newsDoc.exists()) {
      const currentViews = newsDoc.data()?.viewCount || 0;
      await newsRef.update({
        viewCount: currentViews + 1
      });

    }
  } catch (error) {
    //console.error('Error incrementing view count:', error);
    // Don't throw error for view count updates
  }
};

// Get single news article
export const getNewsById = async (newsId: string): Promise<News | null> => {
  try {
    const newsRef = firestore()
      .collection(APP_CONFIG.collections.news)
      .doc(newsId);

    const newsDoc = await newsRef.get();
    
    if (newsDoc.exists()) {
      return convertDocToNews(newsDoc as unknown as FirebaseFirestoreTypes.QueryDocumentSnapshot);
    }

    return null;
  } catch (error) {
    //console.error('Error fetching news by ID:', error);
    return null;
  }
}; 