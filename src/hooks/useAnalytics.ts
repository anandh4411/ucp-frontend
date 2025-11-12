import { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";

// User Engagement Analytics
export function useUserEngagement() {
  const [data, setData] = useState({
    totalUsers: 0,
    activeUsers7Days: 0,
    activeUsers30Days: 0,
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    const fetchUserEngagement = async () => {
      try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        let active7Days = 0;
        let active30Days = 0;

        usersSnapshot.docs.forEach((doc) => {
          const userData = doc.data();
          const lastLoginAt = userData.lastLoginAt?.toDate?.();

          if (lastLoginAt) {
            if (lastLoginAt >= sevenDaysAgo) active7Days++;
            if (lastLoginAt >= thirtyDaysAgo) active30Days++;
          }
        });

        setData({
          totalUsers: usersSnapshot.size,
          activeUsers7Days: active7Days,
          activeUsers30Days: active30Days,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        console.error("Error fetching user engagement:", error);
        setData({
          totalUsers: 0,
          activeUsers7Days: 0,
          activeUsers30Days: 0,
          loading: false,
          error: error.message || "Failed to fetch user engagement data",
        });
      }
    };

    fetchUserEngagement();
  }, []);

  return data;
}

// Announcement Analytics
export function useAnnouncementAnalytics() {
  const [data, setData] = useState({
    byCategory: {} as Record<string, number>,
    totalViews: 0,
    avgViewsPerAnnouncement: 0,
    avgReadRate: 0,
    topAnnouncements: [] as Array<{
      id: string;
      title: string;
      views: number;
      category: string;
    }>,
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    const fetchAnnouncementAnalytics = async () => {
      try {
        const announcementsRef = collection(db, "announcements");
        const announcementsSnapshot = await getDocs(announcementsRef);

        const categoryCount: Record<string, number> = {};
        let totalViews = 0;
        let totalReadBy = 0;
        const announcements: Array<{
          id: string;
          title: string;
          views: number;
          category: string;
        }> = [];

        // Get total users for read rate calculation
        const usersSnapshot = await getDocs(collection(db, "users"));
        const totalUsers = usersSnapshot.size;

        announcementsSnapshot.docs.forEach((doc) => {
          const announcement = doc.data();
          const category = announcement.category || "Uncategorized";
          const views = announcement.viewCount || 0;
          const readByCount = announcement.readBy?.length || 0;

          // Count by category
          categoryCount[category] = (categoryCount[category] || 0) + 1;

          // Sum views
          totalViews += views;

          // Sum read by
          totalReadBy += readByCount;

          // Collect for top announcements
          announcements.push({
            id: doc.id,
            title: announcement.title || "Untitled",
            views,
            category,
          });
        });

        // Sort by views and get top 5
        const topAnnouncements = announcements
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);

        const totalAnnouncements = announcementsSnapshot.size;
        const avgViewsPerAnnouncement =
          totalAnnouncements > 0 ? totalViews / totalAnnouncements : 0;
        const avgReadRate =
          totalAnnouncements > 0 && totalUsers > 0
            ? (totalReadBy / (totalAnnouncements * totalUsers)) * 100
            : 0;

        setData({
          byCategory: categoryCount,
          totalViews,
          avgViewsPerAnnouncement,
          avgReadRate,
          topAnnouncements,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        console.error("Error fetching announcement analytics:", error);
        setData({
          byCategory: {},
          totalViews: 0,
          avgViewsPerAnnouncement: 0,
          avgReadRate: 0,
          topAnnouncements: [],
          loading: false,
          error: error.message || "Failed to fetch announcement analytics",
        });
      }
    };

    fetchAnnouncementAnalytics();
  }, []);

  return data;
}

// Resource Analytics
export function useResourceAnalytics() {
  const [data, setData] = useState({
    byType: {} as Record<string, { count: number; size: number }>,
    totalStorage: 0,
    mostDownloaded: [] as Array<{
      id: string;
      name: string;
      downloads: number;
      type: string;
    }>,
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    const fetchResourceAnalytics = async () => {
      try {
        const resourcesRef = collection(db, "resources");
        const resourcesSnapshot = await getDocs(resourcesRef);

        const typeStats: Record<string, { count: number; size: number }> = {};
        let totalStorage = 0;
        const resources: Array<{
          id: string;
          name: string;
          downloads: number;
          type: string;
        }> = [];

        resourcesSnapshot.docs.forEach((doc) => {
          const resource = doc.data();
          const fileType = resource.fileType || "Other";
          const fileSize = resource.fileSize || 0;
          const downloads = resource.downloads || 0;

          // Aggregate by type
          if (!typeStats[fileType]) {
            typeStats[fileType] = { count: 0, size: 0 };
          }
          typeStats[fileType].count++;
          typeStats[fileType].size += fileSize;

          // Sum total storage
          totalStorage += fileSize;

          // Collect for most downloaded
          resources.push({
            id: doc.id,
            name: resource.name || "Untitled",
            downloads,
            type: fileType,
          });
        });

        // Sort by downloads and get top 5
        const mostDownloaded = resources
          .sort((a, b) => b.downloads - a.downloads)
          .slice(0, 5);

        setData({
          byType: typeStats,
          totalStorage,
          mostDownloaded,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        console.error("Error fetching resource analytics:", error);
        setData({
          byType: {},
          totalStorage: 0,
          mostDownloaded: [],
          loading: false,
          error: error.message || "Failed to fetch resource analytics",
        });
      }
    };

    fetchResourceAnalytics();
  }, []);

  return data;
}

// Message Analytics (Simplified)
export function useMessageAnalytics() {
  const [data, setData] = useState({
    totalConversations: 0,
    individualChats: 0,
    groupChats: 0,
    urgentConversations: 0,
    importantConversations: 0,
    normalConversations: 0,
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    const fetchMessageAnalytics = async () => {
      try {
        const conversationsRef = collection(db, "conversations");
        const conversationsSnapshot = await getDocs(conversationsRef);

        let individualChats = 0;
        let groupChats = 0;
        let urgentConversations = 0;
        let importantConversations = 0;
        let normalConversations = 0;

        conversationsSnapshot.docs.forEach((doc) => {
          const conversation = doc.data();
          const participantCount = conversation.participants?.length || 0;
          const isUrgent = conversation.isUrgent || false;
          const isImportant = conversation.isImportant || false;

          // Type: Individual vs Group
          if (participantCount === 2) {
            individualChats++;
          } else if (participantCount > 2) {
            groupChats++;
          }

          // Priority
          if (isUrgent) {
            urgentConversations++;
          } else if (isImportant) {
            importantConversations++;
          } else {
            normalConversations++;
          }
        });

        setData({
          totalConversations: conversationsSnapshot.size,
          individualChats,
          groupChats,
          urgentConversations,
          importantConversations,
          normalConversations,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        console.error("Error fetching message analytics:", error);
        setData({
          totalConversations: 0,
          individualChats: 0,
          groupChats: 0,
          urgentConversations: 0,
          importantConversations: 0,
          normalConversations: 0,
          loading: false,
          error: error.message || "Failed to fetch message analytics",
        });
      }
    };

    fetchMessageAnalytics();
  }, []);

  return data;
}
