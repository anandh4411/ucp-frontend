import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryConstraint,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { UserProfile } from './auth';

// ============================================
// USERS
// ============================================

export const getUsers = async (filters?: {
  role?: string;
  isActive?: boolean;
  searchTerm?: string;
}): Promise<UserProfile[]> => {
  try {
    const constraints: QueryConstraint[] = [];

    if (filters?.role) {
      constraints.push(where('role', '==', filters.role));
    }

    if (filters?.isActive !== undefined) {
      constraints.push(where('isActive', '==', filters.isActive));
    }

    // Only add orderBy if no where clauses (to avoid index requirement)
    // We'll sort client-side instead
    if (constraints.length === 0) {
      constraints.push(orderBy('createdAt', 'desc'));
    }

    const q = query(collection(db, 'users'), ...constraints);
    const snapshot = await getDocs(q);

    let users = snapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as UserProfile[];

    // Client-side sorting when we have filters
    if (constraints.length > 0) {
      users.sort((a, b) => {
        const timeA = a.createdAt?.getTime() || 0;
        const timeB = b.createdAt?.getTime() || 0;
        return timeB - timeA; // desc order
      });
    }

    // Client-side search filter (Firestore doesn't support full-text search)
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      users = users.filter(
        user =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.serviceNumber.toLowerCase().includes(searchLower)
      );
    }

    return users;
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
    } as UserProfile;
  } catch (error) {
    console.error('Get user by ID error:', error);
    throw error;
  }
};

export const createUser = async (
  user: Omit<UserProfile, 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

export const updateUser = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    const docRef = doc(db, 'users', userId);

    // Filter out undefined values (Firestore doesn't accept undefined)
    const filteredUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    await updateDoc(docRef, {
      ...filteredUpdates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'users', userId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

// ============================================
// ANNOUNCEMENTS
// ============================================

export interface Announcement {
  id?: string;
  uuid: string;
  title: string;
  content: string;
  priority: 'normal' | 'high' | 'urgent';
  category: 'event' | 'training' | 'administrative' | 'technical' | 'general';
  isPinned: boolean;
  authorId: string;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const getAnnouncements = async (filters?: {
  category?: string;
  priority?: string;
  limit?: number;
}): Promise<Announcement[]> => {
  try {
    const constraints: QueryConstraint[] = [];

    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }

    if (filters?.priority) {
      constraints.push(where('priority', '==', filters.priority));
    }

    // Pinned first, then by creation date
    constraints.push(orderBy('isPinned', 'desc'));
    constraints.push(orderBy('createdAt', 'desc'));

    if (filters?.limit) {
      constraints.push(limit(filters.limit));
    }

    const q = query(collection(db, 'announcements'), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Announcement[];
  } catch (error) {
    console.error('Get announcements error:', error);
    throw error;
  }
};

export const getAnnouncementById = async (
  announcementId: string
): Promise<Announcement | null> => {
  try {
    const docRef = doc(db, 'announcements', announcementId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
    } as Announcement;
  } catch (error) {
    console.error('Get announcement by ID error:', error);
    throw error;
  }
};

export const createAnnouncement = async (
  announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'announcements'), {
      ...announcement,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Create announcement error:', error);
    throw error;
  }
};

export const updateAnnouncement = async (
  announcementId: string,
  updates: Partial<Announcement>
): Promise<void> => {
  try {
    const docRef = doc(db, 'announcements', announcementId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    throw error;
  }
};

export const markAnnouncementAsRead = async (
  announcementId: string,
  userId: string
): Promise<void> => {
  try {
    const docRef = doc(db, 'announcements', announcementId);
    await updateDoc(docRef, {
      readBy: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Mark announcement as read error:', error);
    throw error;
  }
};

export const incrementAnnouncementView = async (
  announcementId: string
): Promise<void> => {
  try {
    const docRef = doc(db, 'announcements', announcementId);
    await updateDoc(docRef, {
      viewCount: increment(1),
    });
  } catch (error) {
    console.error('Increment announcement view error:', error);
    throw error;
  }
};

export const deleteAnnouncement = async (announcementId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'announcements', announcementId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Delete announcement error:', error);
    throw error;
  }
};

// ============================================
// MESSAGES & CONVERSATIONS
// ============================================

export interface Message {
  id?: string;
  uuid: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  readBy: string[];
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  timestamp: Date;
}

export interface Conversation {
  id?: string;
  uuid: string;
  participants: string[];
  subject: string;
  lastMessage: {
    content: string;
    timestamp: Date;
    senderId: string;
  };
  unreadCount: number;
  isImportant: boolean;
  isUrgent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const getConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastMessage: {
        ...doc.data().lastMessage,
        timestamp: doc.data().lastMessage.timestamp?.toDate(),
      },
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Conversation[];
  } catch (error) {
    console.error('Get conversations error:', error);
    throw error;
  }
};

export const getConversationMessages = async (
  conversationId: string
): Promise<Message[]> => {
  try {
    const q = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    })) as Message[];
  } catch (error) {
    console.error('Get conversation messages error:', error);
    throw error;
  }
};

export const sendMessage = async (
  conversationId: string,
  message: Omit<Message, 'id' | 'timestamp'>
): Promise<string> => {
  try {
    // Add message to subcollection
    const messageRef = await addDoc(
      collection(db, 'conversations', conversationId, 'messages'),
      {
        ...message,
        timestamp: serverTimestamp(),
      }
    );

    // Update conversation's last message
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      lastMessage: {
        content: message.content,
        timestamp: serverTimestamp(),
        senderId: message.senderId,
      },
      updatedAt: serverTimestamp(),
    });

    return messageRef.id;
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
};

export const createConversation = async (
  conversation: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'conversations'), {
      ...conversation,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Create conversation error:', error);
    throw error;
  }
};

export const updateMessage = async (
  conversationId: string,
  messageId: string,
  content: string
): Promise<void> => {
  try {
    const messageRef = doc(db, 'conversations', conversationId, 'messages', messageId);
    await updateDoc(messageRef, {
      content,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Update message error:', error);
    throw error;
  }
};

export const deleteMessage = async (
  conversationId: string,
  messageId: string
): Promise<void> => {
  try {
    const messageRef = doc(db, 'conversations', conversationId, 'messages', messageId);
    await deleteDoc(messageRef);
  } catch (error) {
    console.error('Delete message error:', error);
    throw error;
  }
};

export const deleteConversation = async (conversationId: string): Promise<void> => {
  try {
    const conversationRef = doc(db, 'conversations', conversationId);
    await deleteDoc(conversationRef);
  } catch (error) {
    console.error('Delete conversation error:', error);
    throw error;
  }
};

export const markMessageAsRead = async (
  conversationId: string,
  messageId: string,
  userId: string
): Promise<void> => {
  try {
    const messageRef = doc(db, 'conversations', conversationId, 'messages', messageId);
    await updateDoc(messageRef, {
      isRead: true,
      readBy: arrayUnion(userId),
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    throw error;
  }
};

// ============================================
// EVENTS
// ============================================

export interface CalendarEvent {
  id?: string;
  uuid: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  category: 'training' | 'ceremony' | 'meeting' | 'inspection' | 'administrative' | 'maintenance';
  organizerId: string;
  attendeeIds: string[];
  isMandatory: boolean;
  isAllDay: boolean;
  reminderBefore: number; // minutes
  createdAt: Date;
  updatedAt: Date;
}

export const getEvents = async (filters?: {
  startDate?: Date;
  endDate?: Date;
  category?: string;
}): Promise<CalendarEvent[]> => {
  try {
    const constraints: QueryConstraint[] = [];

    if (filters?.startDate) {
      constraints.push(where('startTime', '>=', Timestamp.fromDate(filters.startDate)));
    }

    if (filters?.endDate) {
      constraints.push(where('startTime', '<=', Timestamp.fromDate(filters.endDate)));
    }

    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }

    constraints.push(orderBy('startTime', 'asc'));

    const q = query(collection(db, 'events'), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime?.toDate(),
      endTime: doc.data().endTime?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as CalendarEvent[];
  } catch (error) {
    console.error('Get events error:', error);
    throw error;
  }
};

export const createEvent = async (
  event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'events'), {
      ...event,
      startTime: Timestamp.fromDate(event.startTime),
      endTime: Timestamp.fromDate(event.endTime),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Create event error:', error);
    throw error;
  }
};

export const updateEvent = async (
  eventId: string,
  updates: Partial<CalendarEvent>
): Promise<void> => {
  try {
    const docRef = doc(db, 'events', eventId);
    const updateData: any = { ...updates, updatedAt: serverTimestamp() };

    if (updates.startTime) {
      updateData.startTime = Timestamp.fromDate(updates.startTime);
    }

    if (updates.endTime) {
      updateData.endTime = Timestamp.fromDate(updates.endTime);
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Update event error:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'events', eventId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Delete event error:', error);
    throw error;
  }
};

// ============================================
// RESOURCES
// ============================================

export interface Resource {
  id?: string;
  uuid: string;
  title: string;
  description: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: 'pdf' | 'document' | 'spreadsheet' | 'image' | 'video' | 'archive';
  category: 'training' | 'schedules' | 'forms' | 'operations' | 'documentation';
  uploadedById: string;
  tags: string[];
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

export const getResources = async (filters?: {
  category?: string;
  searchTerm?: string;
}): Promise<Resource[]> => {
  try {
    const constraints: QueryConstraint[] = [];

    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(collection(db, 'resources'), ...constraints);
    const snapshot = await getDocs(q);

    let resources = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Resource[];

    // Client-side search
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      resources = resources.filter(
        resource =>
          resource.title.toLowerCase().includes(searchLower) ||
          resource.description.toLowerCase().includes(searchLower) ||
          resource.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return resources;
  } catch (error) {
    console.error('Get resources error:', error);
    throw error;
  }
};

export const createResource = async (
  resource: Omit<Resource, 'id' | 'downloads' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'resources'), {
      ...resource,
      downloads: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Create resource error:', error);
    throw error;
  }
};

export const updateResource = async (
  resourceId: string,
  updates: Partial<Resource>
): Promise<void> => {
  try {
    const docRef = doc(db, 'resources', resourceId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Update resource error:', error);
    throw error;
  }
};

export const incrementResourceDownloads = async (resourceId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'resources', resourceId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        downloads: (docSnap.data().downloads || 0) + 1,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Increment downloads error:', error);
    throw error;
  }
};

export const deleteResource = async (resourceId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'resources', resourceId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Delete resource error:', error);
    throw error;
  }
};
