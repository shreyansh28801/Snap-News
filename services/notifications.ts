import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Notification, NotificationType } from '../types';

const convertDocToNotification = (
  docSnapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot
): Notification => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    type: data.type,
    title: data.title,
    message: data.message,
    relatedItemId: data.relatedItemId,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    read: data.read || false,
    recipientId: data.recipientId
  };
};



export const getNotificationsForUser = async (
  userId: string,
  limitCount: number = 20
): Promise<Notification[]> => {
  try {
    const notifications: Notification[] = [];

    const querySnapshot = await firestore()
      .collection('notifications')
      .where('recipientId', 'in', [userId, 'all_users'])
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
      .get();

    querySnapshot.forEach(doc => {
      notifications.push(convertDocToNotification(doc));
    });

    //console.log(`Fetched ${notifications.length} notifications for user ${userId}`);
    return notifications;
  } catch (error) {
    //console.error('Error fetching notifications:', error);
    return [];
  }
};

export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  try {
    const userUnreadPromise = firestore()
      .collection('notifications')
      .where('recipientId', '==', userId)
      .where('read', '==', false)
      .get();

    const allUsersUnreadPromise = firestore()
      .collection('notifications')
      .where('recipientId', '==', 'all_users')
      .where('read', '==', false)
      .get();

    const [userSnapshot, allUsersSnapshot] = await Promise.all([
      userUnreadPromise,
      allUsersUnreadPromise
    ]);

    const totalCount = userSnapshot.size + allUsersSnapshot.size;
    //console.log(`Unread notifications count for user ${userId}: ${totalCount}`);
    return totalCount;
  } catch (error) {
    //console.error('Error fetching unread notification count:', error);
    return 0;
  }
};

export const createNotification = async (
  notification: Omit<Notification, 'id' | 'createdAt'>
): Promise<string> => {
  try {
    //console.log('Creating notification:', JSON.stringify(notification));

    const notificationData = {
      ...notification,
      createdAt: firestore.FieldValue.serverTimestamp()
    };

    const docRef = await firestore()
      .collection('notifications')
      .add(notificationData);

    // //console.log(`Notification created successfully with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    //console.error('Error creating notification:', error);
    throw new Error('Failed to create notification');
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await firestore()
      .collection('notifications')
      .doc(notificationId)
      .update({
        read: true,
        updatedAt: firestore.FieldValue.serverTimestamp()
      });
  } catch (error) {
    //console.error('Error marking notification as read:', error);
    throw new Error('Failed to update notification');
  }
};

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    const userUnreadQuery = firestore()
      .collection('notifications')
      .where('recipientId', '==', userId)
      .where('read', '==', false)
      .get();

    const allUsersUnreadQuery = firestore()
      .collection('notifications')
      .where('recipientId', '==', 'all_users')
      .where('read', '==', false)
      .get();

    const [userQuerySnapshot, allUsersQuerySnapshot] = await Promise.all([
      userUnreadQuery,
      allUsersUnreadQuery
    ]);

    const allDocsToUpdate = [...userQuerySnapshot.docs, ...allUsersQuerySnapshot.docs];

    //console.log(`Marking ${allDocsToUpdate.length} notifications as read for user ${userId}`);

    const updatePromises = allDocsToUpdate.map(docSnapshot =>
      firestore()
        .collection('notifications')
        .doc(docSnapshot.id)
        .update({
          read: true,
          updatedAt: firestore.FieldValue.serverTimestamp()
        })
    );

    await Promise.all(updatePromises);
  } catch (error) {
    //console.error('Error marking all notifications as read:', error);
    throw new Error('Failed to update notifications');
  }
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await firestore()
      .collection('notifications')
      .doc(notificationId)
      .delete();
  } catch (error) {
    //console.error('Error deleting notification:', error);
    throw new Error('Failed to delete notification');
  }
};

export const createSystemNotification = async (title: string, message: string): Promise<void> => {
  try {
    const notification = {
      type: NotificationType.SYSTEM_MESSAGE,
      title,
      message,
      read: false,
      recipientId: 'all_users'
    };

    await createNotification(notification);
  } catch (error) {
    //console.error('Error creating system notification:', error);
    throw new Error('Failed to create system notification');
  }
};


export const sendBreakingNewsNotification = async (
  newsId: string,
  newsTitle: string
): Promise<void> => {
  try {
    const notification = {
      type: NotificationType.BREAKING_NEWS,
      title: 'Breaking News',
      message: newsTitle,
      relatedItemId: newsId,
      read: false,
      recipientId: 'all_users'
    };

    await createNotification(notification);
  } catch (error) {
    //console.error('Error sending breaking news notification:', error);
    throw new Error('Failed to send breaking news notification');
  }
};

export const createTestNotification = async (userId: string): Promise<string> => {
  try {
    const timestamp = new Date().toISOString();
    const notification = {
      type: NotificationType.SYSTEM_MESSAGE,
      title: 'Test Notification',
      message: `This is a test notification created at ${timestamp}`,
      read: false,
      recipientId: userId
    };

    const notificationId = await createNotification(notification);
    //console.log(`Created test notification with ID: ${notificationId}`);
    return notificationId;
  } catch (error) {
    //console.error('Error creating test notification:', error);
    throw new Error('Failed to create test notification');
  }
};
