import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface FirebaseStats {
  totalUsers: number;
  activeUsers: number;
  totalAnnouncements: number;
  totalConversations: number;
  totalResources: number;
  totalEvents: number;
  loading: boolean;
}

export const useFirebaseStats = (): FirebaseStats => {
  const [stats, setStats] = useState<FirebaseStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalAnnouncements: 0,
    totalConversations: 0,
    totalResources: 0,
    totalEvents: 0,
    loading: true,
  });

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // Users
    const usersUnsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const total = snapshot.size;
      const active = snapshot.docs.filter((doc) => doc.data().isActive === true).length;
      setStats((prev) => ({ ...prev, totalUsers: total, activeUsers: active }));
    });
    unsubscribers.push(usersUnsub);

    // Announcements
    const announcementsUnsub = onSnapshot(collection(db, 'announcements'), (snapshot) => {
      setStats((prev) => ({ ...prev, totalAnnouncements: snapshot.size }));
    });
    unsubscribers.push(announcementsUnsub);

    // Conversations
    const conversationsUnsub = onSnapshot(collection(db, 'conversations'), (snapshot) => {
      setStats((prev) => ({ ...prev, totalConversations: snapshot.size }));
    });
    unsubscribers.push(conversationsUnsub);

    // Resources
    const resourcesUnsub = onSnapshot(collection(db, 'resources'), (snapshot) => {
      setStats((prev) => ({ ...prev, totalResources: snapshot.size }));
    });
    unsubscribers.push(resourcesUnsub);

    // Events
    const eventsUnsub = onSnapshot(collection(db, 'events'), (snapshot) => {
      setStats((prev) => ({ ...prev, totalEvents: snapshot.size, loading: false }));
    });
    unsubscribers.push(eventsUnsub);

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, []);

  return stats;
};
