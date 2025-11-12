import { useState, useEffect } from "react";
import { subscribeToAnnouncements } from "@/api/firebase/realtime";
import { subscribeToConversations } from "@/api/firebase/realtime";
import { subscribeToEvents } from "@/api/firebase/realtime";
import { subscribeToResources } from "@/api/firebase/realtime";
import type { Announcement, Conversation, CalendarEvent } from "@/api/firebase/firestore";

export interface ActivityItem {
  id: string;
  type: "message" | "announcement" | "resource" | "user" | "system";
  title: string;
  description: string;
  timestamp: Date;
  priority?: "high" | "medium" | "low";
  user?: string;
}

export interface RecentAnnouncement {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  createdAt: Date;
}


/**
 * Hook for fetching recent activity across the system
 * Combines announcements, messages, and other activities
 */
export function useRecentActivity(limit: number = 5) {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribeAnnouncements: (() => void) | undefined;
    let unsubscribeConversations: (() => void) | undefined;

    const fetchActivity = async () => {
      try {
        setLoading(true);
        const activities: ActivityItem[] = [];

        // Subscribe to announcements
        unsubscribeAnnouncements = subscribeToAnnouncements(
          (announcements: Announcement[]) => {
            const announcementActivities = announcements
              .slice(0, 3)
              .map((a) => ({
                id: a.id || a.uuid,
                type: "announcement" as const,
                title: a.title,
                description: `New announcement: ${a.title}`,
                timestamp: new Date(a.createdAt),
                priority: a.priority as "high" | "medium" | "low",
              }));

            activities.push(...announcementActivities);
            setActivity(activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit));
            setLoading(false);
          },
          {}
        );

        // Note: subscribeToConversations requires userId, skipping for now
        // or you can pass userId if available in this context
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchActivity();

    return () => {
      unsubscribeAnnouncements?.();
      unsubscribeConversations?.();
    };
  }, [limit]);

  return { activity, loading, error };
}

/**
 * Hook for fetching recent announcements
 * Returns latest announcements ordered by creation date
 */
export function useRecentAnnouncements(limit: number = 5) {
  const [announcements, setAnnouncements] = useState<RecentAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAnnouncements(
      (allAnnouncements: Announcement[]) => {
        const recent = allAnnouncements
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit)
          .map(a => ({
            id: a.id || a.uuid,
            title: a.title,
            priority: a.priority as "high" | "medium" | "low",
            createdAt: new Date(a.createdAt),
          }));

        setAnnouncements(recent);
        setLoading(false);
      },
      {}
    );

    return () => unsubscribe();
  }, [limit]);

  return { announcements, loading, error };
}


/**
 * Hook for recent messages (User dashboard)
 * Returns user's recent conversations
 */
export function useRecentMessages(userId: string, limit: number = 5) {
  const [messages, setMessages] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToConversations(
      userId,
      (conversations: Conversation[]) => {
        // Conversations are already filtered by userId in the subscription
        const userConversations = conversations
          .sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.createdAt).getTime();
            const dateB = new Date(b.updatedAt || b.createdAt).getTime();
            return dateB - dateA;
          })
          .slice(0, limit);

        setMessages(userConversations);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, limit]);

  return { messages, loading, error };
}

/**
 * Hook for upcoming events (User dashboard)
 * Returns user's upcoming calendar events
 */
export function useUpcomingEvents(limit: number = 3) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToEvents(
      (allEvents: CalendarEvent[]) => {
        const now = new Date();
        const upcomingEvents = allEvents
          .filter(e => new Date(e.startTime) > now)
          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
          .slice(0, limit);

        setEvents(upcomingEvents);
        setLoading(false);
      },
      {}
    );

    return () => unsubscribe();
  }, [limit]);

  return { events, loading, error };
}
