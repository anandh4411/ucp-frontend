import { useState, useEffect } from "react";
import { subscribeToAnnouncements, subscribeToConversations } from "@/api/firebase/realtime";
import type { Announcement, Conversation } from "@/api/firebase/firestore";

export interface Notification {
  id: string;
  type: "announcement" | "message";
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  link?: string;
}

const NOTIFICATION_STORAGE_KEY = "read_notifications";

// Get read notification IDs from localStorage
function getReadNotifications(): Set<string> {
  const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
  return stored ? new Set(JSON.parse(stored)) : new Set();
}

// Save read notification IDs to localStorage
function saveReadNotifications(ids: Set<string>) {
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(Array.from(ids)));
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState<Set<string>>(() => getReadNotifications());

  useEffect(() => {
    const allNotifications: Notification[] = [];
    let announcementCount = 0;
    let conversationCount = 0;
    const expectedSubscriptions = userId ? 2 : 1;

    const checkComplete = () => {
      announcementCount++;
      if (userId) conversationCount++;

      if (announcementCount + conversationCount >= expectedSubscriptions) {
        // Sort by timestamp descending
        allNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        // Mark as read if in localStorage
        const updated = allNotifications.map(notif => ({
          ...notif,
          read: readIds.has(notif.id),
        }));

        setNotifications(updated);
        setLoading(false);
      }
    };

    // Subscribe to announcements
    const unsubscribeAnnouncements = subscribeToAnnouncements(
      (announcements: Announcement[]) => {
        // Get recent announcements (last 24 hours)
        const oneDayAgo = new Date();
        oneDayAgo.setHours(oneDayAgo.getHours() - 24);

        const announcementNotifications = announcements
          .filter(a => new Date(a.createdAt) > oneDayAgo)
          .map(a => ({
            id: `announcement-${a.id || a.uuid}`,
            type: "announcement" as const,
            title: a.title,
            description: `New ${a.priority} priority announcement`,
            timestamp: new Date(a.createdAt),
            read: readIds.has(`announcement-${a.id || a.uuid}`),
            link: "/dashboard/announcements",
          }));

        // Replace announcement notifications
        const filtered = allNotifications.filter(n => n.type !== "announcement");
        allNotifications.length = 0;
        allNotifications.push(...filtered, ...announcementNotifications);

        checkComplete();
      },
      {}
    );

    // Subscribe to conversations (only if userId provided)
    let unsubscribeConversations: (() => void) | undefined;
    if (userId) {
      unsubscribeConversations = subscribeToConversations(
        userId,
        (conversations: Conversation[]) => {
          // Get conversations updated in last 24 hours
          const oneDayAgo = new Date();
          oneDayAgo.setHours(oneDayAgo.getHours() - 24);

          const messageNotifications = conversations
            .filter(c => {
              const updatedAt = new Date(c.updatedAt || c.createdAt);
              return updatedAt > oneDayAgo;
            })
            .map(c => ({
              id: `message-${c.id || c.uuid}`,
              type: "message" as const,
              title: "New Message",
              description: typeof c.lastMessage === 'string' ? c.lastMessage : c.lastMessage?.content || "You have a new message",
              timestamp: new Date(c.updatedAt || c.createdAt),
              read: readIds.has(`message-${c.id || c.uuid}`),
              link: "/dashboard/messages",
            }));

          // Replace message notifications
          const filtered = allNotifications.filter(n => n.type !== "message");
          allNotifications.length = 0;
          allNotifications.push(...filtered, ...messageNotifications);

          checkComplete();
        }
      );
    } else {
      // If no userId, we only expect announcements
      conversationCount = 1;
    }

    return () => {
      unsubscribeAnnouncements();
      unsubscribeConversations?.();
    };
  }, [userId, readIds]);

  const markAsRead = (id: string) => {
    const newReadIds = new Set(readIds);
    newReadIds.add(id);
    setReadIds(newReadIds);
    saveReadNotifications(newReadIds);

    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    const allIds = new Set([...readIds, ...notifications.map(n => n.id)]);
    setReadIds(allIds);
    saveReadNotifications(allIds);

    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}
