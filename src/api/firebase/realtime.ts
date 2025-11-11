import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type {
  Announcement,
  Conversation,
  Message,
  CalendarEvent,
} from './firestore';

// ============================================
// ANNOUNCEMENTS LISTENER
// ============================================

export type AnnouncementsCallback = (announcements: Announcement[]) => void;

export const subscribeToAnnouncements = (
  callback: AnnouncementsCallback,
  filters?: {
    category?: string;
    priority?: string;
    limit?: number;
  }
): Unsubscribe => {
  try {
    const constraints: QueryConstraint[] = [];

    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }

    if (filters?.priority) {
      constraints.push(where('priority', '==', filters.priority));
    }

    constraints.push(orderBy('isPinned', 'desc'));
    constraints.push(orderBy('createdAt', 'desc'));

    if (filters?.limit) {
      constraints.push(limit(filters.limit));
    }

    const q = query(collection(db, 'announcements'), ...constraints);

    return onSnapshot(
      q,
      (snapshot) => {
        const announcements = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Announcement[];

        callback(announcements);
      },
      (error) => {
        console.error('Announcements listener error:', error);
      }
    );
  } catch (error) {
    console.error('Subscribe to announcements error:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

// ============================================
// CONVERSATIONS LISTENER
// ============================================

export type ConversationsCallback = (conversations: Conversation[]) => void;

export const subscribeToConversations = (
  userId: string,
  callback: ConversationsCallback
): Unsubscribe => {
  try {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const conversations = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          lastMessage: {
            ...doc.data().lastMessage,
            timestamp: doc.data().lastMessage.timestamp?.toDate(),
          },
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Conversation[];

        callback(conversations);
      },
      (error) => {
        console.error('Conversations listener error:', error);
      }
    );
  } catch (error) {
    console.error('Subscribe to conversations error:', error);
    return () => {};
  }
};

// ============================================
// MESSAGES LISTENER
// ============================================

export type MessagesCallback = (messages: Message[]) => void;

export const subscribeToMessages = (
  conversationId: string,
  callback: MessagesCallback
): Unsubscribe => {
  try {
    const q = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
        })) as Message[];

        callback(messages);
      },
      (error) => {
        console.error('Messages listener error:', error);
      }
    );
  } catch (error) {
    console.error('Subscribe to messages error:', error);
    return () => {};
  }
};

// ============================================
// EVENTS LISTENER
// ============================================

export type EventsCallback = (events: CalendarEvent[]) => void;

export const subscribeToEvents = (
  callback: EventsCallback,
  filters?: {
    startDate?: Date;
    endDate?: Date;
    category?: string;
  }
): Unsubscribe => {
  try {
    const constraints: QueryConstraint[] = [];

    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }

    constraints.push(orderBy('startTime', 'asc'));

    const q = query(collection(db, 'events'), ...constraints);

    return onSnapshot(
      q,
      (snapshot) => {
        let events = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          startTime: doc.data().startTime?.toDate(),
          endTime: doc.data().endTime?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as CalendarEvent[];

        // Client-side date filtering
        if (filters?.startDate) {
          events = events.filter((event) => event.startTime >= filters.startDate!);
        }

        if (filters?.endDate) {
          events = events.filter((event) => event.startTime <= filters.endDate!);
        }

        callback(events);
      },
      (error) => {
        console.error('Events listener error:', error);
      }
    );
  } catch (error) {
    console.error('Subscribe to events error:', error);
    return () => {};
  }
};

// ============================================
// NOTIFICATIONS LISTENER
// ============================================

export interface Notification {
  id?: string;
  uuid: string;
  userId: string;
  type: 'message' | 'announcement' | 'event_reminder' | 'system';
  title: string;
  content: string;
  relatedEntityId?: string;
  relatedEntityType?: 'message' | 'announcement' | 'resource' | 'event';
  isRead: boolean;
  createdAt: Date;
}

export type NotificationsCallback = (notifications: Notification[]) => void;

export const subscribeToNotifications = (
  userId: string,
  callback: NotificationsCallback
): Unsubscribe => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('isRead', '==', false),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const notifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as Notification[];

        callback(notifications);

        // Show browser notification for new notifications
        if (notifications.length > 0 && 'Notification' in window) {
          notifications.forEach((notification) => {
            if (Notification.permission === 'granted') {
              new Notification(notification.title, {
                body: notification.content,
                icon: '/logo.png', // Add your app logo
                tag: notification.id,
              });
            }
          });
        }
      },
      (error) => {
        console.error('Notifications listener error:', error);
      }
    );
  } catch (error) {
    console.error('Subscribe to notifications error:', error);
    return () => {};
  }
};

// ============================================
// USER STATUS LISTENER (Online/Offline)
// ============================================

export interface UserStatus {
  userId: string;
  isOnline: boolean;
  lastSeen: Date;
}

export type UserStatusCallback = (status: UserStatus) => void;

export const subscribeToUserStatus = (
  userId: string,
  callback: UserStatusCallback
): Unsubscribe => {
  try {
    const docRef = doc(db, 'users', userId);

    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          callback({
            userId: snapshot.id,
            isOnline: data.isOnline || false,
            lastSeen: data.lastSeen?.toDate() || new Date(),
          });
        }
      },
      (error) => {
        console.error('User status listener error:', error);
      }
    );
  } catch (error) {
    console.error('Subscribe to user status error:', error);
    return () => {};
  }
};

// ============================================
// REQUEST BROWSER NOTIFICATION PERMISSION
// ============================================

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
};

// ============================================
// SHOW BROWSER NOTIFICATION
// ============================================

export const showBrowserNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return null;
  }

  if (Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/logo.png',
      badge: '/logo.png',
      ...options,
    });
  }

  return null;
};

// ============================================
// UNSUBSCRIBE ALL LISTENERS
// ============================================

export class RealtimeManager {
  private unsubscribers: Unsubscribe[] = [];

  addSubscription(unsubscribe: Unsubscribe) {
    this.unsubscribers.push(unsubscribe);
  }

  unsubscribeAll() {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.unsubscribers = [];
  }
}
