// Firebase Initialization Script
// Run this after setting up Firebase project
// Usage: node firebase-init.js

import admin from "firebase-admin";
import { readFileSync } from "fs";

// Read service account key
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);

// Validate service account key
if (!serviceAccount.project_id) {
  console.error("❌ Error: serviceAccountKey.json is missing project_id");
  console.error("Please download the correct service account key from Firebase Console");
  process.exit(1);
}

console.log(`📋 Using Firebase project: ${serviceAccount.project_id}\n`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const db = admin.firestore();
// Ensure we're using the default database
db.settings({
  ignoreUndefinedProperties: true,
});
const auth = admin.auth();

async function initializeFirebase() {
  console.log("🔥 Initializing Firebase for Unit Communication Portal...\n");

  try {
    // 1. Create Users with Authentication
    console.log("👥 Creating users and authentication...\n");

    const users = [
      {
        email: "adjt@unit.mil",
        password: "Adjt@2025",
        profile: {
          name: "Maj. Sharma",
          rank: "Major",
          role: "adjt",
          serviceNumber: "IC-12345",
          unit: "1st Battalion, Regiment",
          isActive: true,
        },
      },
      {
        email: "itjco@unit.mil",
        password: "ItJco@2025",
        profile: {
          name: "Sub. Kumar",
          rank: "Subedar",
          role: "it_jco",
          serviceNumber: "JC-67890",
          unit: "1st Battalion, Regiment",
          isActive: true,
        },
      },
      {
        email: "user@unit.mil",
        password: "User@2025",
        profile: {
          name: "Nk. Singh",
          rank: "Naik",
          role: "user",
          serviceNumber: "NK-11111",
          unit: "1st Battalion, Regiment",
          isActive: true,
        },
      },
    ];

    const createdUsers = [];

    for (const userData of users) {
      try {
        // Create authentication user
        const userRecord = await auth.createUser({
          email: userData.email,
          password: userData.password,
          emailVerified: true,
          displayName: userData.profile.name,
        });

        // Set custom claims for role-based access
        await auth.setCustomUserClaims(userRecord.uid, {
          role: userData.profile.role,
        });

        // Create Firestore user document
        await db
          .collection("users")
          .doc(userRecord.uid)
          .set({
            uuid: userRecord.uid,
            email: userData.email,
            ...userData.profile,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

        // Create user preferences
        await db
          .collection("user_preferences")
          .doc(userRecord.uid)
          .set({
            userId: userRecord.uid,
            theme: "system",
            colorScheme: "blue",
            fontFamily: "inter",
            notificationSettings: {
              messages: true,
              announcements: true,
              events: true,
              email: true,
              push: true,
            },
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

        createdUsers.push({ uid: userRecord.uid, ...userData });
        console.log(`✅ Created: ${userData.email} (${userData.profile.role})`);
      } catch (error) {
        if (error.code === "auth/email-already-exists") {
          console.log(`⚠️  User ${userData.email} already exists, skipping...`);
          // Get existing user
          const existingUser = await auth.getUserByEmail(userData.email);
          createdUsers.push({ uid: existingUser.uid, ...userData });
        } else {
          console.error(`❌ Error creating ${userData.email}:`, error.message);
        }
      }
    }

    // 2. Create Sample Announcements
    console.log("\n📢 Creating sample announcements...\n");

    const announcements = [
      {
        uuid: "ann-001",
        title: "Republic Day Parade 2025",
        content:
          "All personnel are required to attend the Republic Day Parade on 26th January 2025 at 0800 hrs at Parade Ground. Full ceremonial dress with medals.",
        priority: "urgent",
        category: "event",
        isPinned: true,
        authorId:
          createdUsers.find((u) => u.profile.role === "adjt")?.uid || "",
        readBy: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        uuid: "ann-002",
        title: "Weapon Training Schedule - January 2025",
        content:
          "Weapon training will be conducted from 15-20 January 2025. All personnel must report to training area by 0600 hrs. Bring personal weapons and 30 rounds ammunition.",
        priority: "high",
        category: "training",
        isPinned: false,
        authorId:
          createdUsers.find((u) => u.profile.role === "adjt")?.uid || "",
        readBy: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        uuid: "ann-003",
        title: "Leave Roster - Updated",
        content:
          "The leave roster for Q1 2025 has been updated. All pending leave applications have been processed. Check notice board for details.",
        priority: "normal",
        category: "administrative",
        isPinned: false,
        authorId:
          createdUsers.find((u) => u.profile.role === "it_jco")?.uid || "",
        readBy: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    ];

    for (const ann of announcements) {
      await db.collection("announcements").add(ann);
      console.log(`✅ Created: ${ann.title}`);
    }

    // 3. Create Sample Events
    console.log("\n📅 Creating sample events...\n");

    const events = [
      {
        uuid: "evt-001",
        title: "Weekly CO Briefing",
        description:
          "Weekly operational briefing by Commanding Officer. All JCOs and above must attend.",
        startTime: admin.firestore.Timestamp.fromDate(
          new Date("2025-01-20T09:00:00")
        ),
        endTime: admin.firestore.Timestamp.fromDate(
          new Date("2025-01-20T10:00:00")
        ),
        location: "Conference Room, HQ Building",
        category: "meeting",
        organizerId:
          createdUsers.find((u) => u.profile.role === "adjt")?.uid || "",
        attendeeIds: [],
        isMandatory: true,
        isAllDay: false,
        reminderBefore: 60,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        uuid: "evt-002",
        title: "Physical Training Session",
        description: "Unit PT session - 5km run and strength training",
        startTime: admin.firestore.Timestamp.fromDate(
          new Date("2025-01-15T06:00:00")
        ),
        endTime: admin.firestore.Timestamp.fromDate(
          new Date("2025-01-15T07:30:00")
        ),
        location: "Training Ground",
        category: "training",
        organizerId:
          createdUsers.find((u) => u.profile.role === "adjt")?.uid || "",
        attendeeIds: [],
        isMandatory: true,
        isAllDay: false,
        reminderBefore: 30,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        uuid: "evt-003",
        title: "Republic Day Celebration",
        description: "Republic Day parade and celebration",
        startTime: admin.firestore.Timestamp.fromDate(
          new Date("2025-01-26T08:00:00")
        ),
        endTime: admin.firestore.Timestamp.fromDate(
          new Date("2025-01-26T12:00:00")
        ),
        location: "Parade Ground",
        category: "ceremony",
        organizerId:
          createdUsers.find((u) => u.profile.role === "adjt")?.uid || "",
        attendeeIds: [],
        isMandatory: true,
        isAllDay: false,
        reminderBefore: 1440, // 1 day before
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    ];

    for (const event of events) {
      await db.collection("events").add(event);
      console.log(`✅ Created: ${event.title}`);
    }

    // 4. Create Sample Resources
    console.log("\n📁 Creating sample resources...\n");

    const resources = [
      {
        uuid: "res-001",
        title: "Training Manual 2025",
        description:
          "Complete training manual for all personnel - updated for 2025",
        fileName: "training-manual-2025.pdf",
        fileUrl: "", // Will be uploaded separately
        fileSize: 1024 * 1024 * 2, // 2MB placeholder
        fileType: "pdf",
        category: "training",
        uploadedById:
          createdUsers.find((u) => u.profile.role === "adjt")?.uid || "",
        tags: ["training", "manual", "2025"],
        downloads: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        uuid: "res-002",
        title: "Unit SOP Document",
        description: "Standard Operating Procedures for unit operations",
        fileName: "unit-sop.docx",
        fileUrl: "",
        fileSize: 1024 * 500, // 500KB placeholder
        fileType: "document",
        category: "operations",
        uploadedById:
          createdUsers.find((u) => u.profile.role === "it_jco")?.uid || "",
        tags: ["sop", "operations", "procedures"],
        downloads: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    ];

    for (const resource of resources) {
      await db.collection("resources").add(resource);
      console.log(`✅ Created: ${resource.title}`);
    }

    // 5. Create Sample Conversation
    console.log("\n💬 Creating sample conversation...\n");

    const adjt = createdUsers.find((u) => u.profile.role === "adjt");
    const user = createdUsers.find((u) => u.profile.role === "user");

    if (adjt && user) {
      const conversationRef = await db.collection("conversations").add({
        uuid: "conv-001",
        participants: [adjt.uid, user.uid],
        subject: "Leave Application Query",
        lastMessage: {
          content:
            "I would like to apply for leave next month. What is the process?",
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          senderId: user.uid,
        },
        unreadCount: 1,
        isImportant: false,
        isUrgent: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Add message to subcollection
      await conversationRef.collection("messages").add({
        uuid: "msg-001",
        conversationId: conversationRef.id,
        senderId: user.uid,
        content:
          "I would like to apply for leave next month. What is the process?",
        isRead: false,
        readBy: [],
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Created sample conversation`);
    }

    console.log("\n✨ Firebase initialization complete!\n");
    console.log("═══════════════════════════════════════════════════════");
    console.log("📝 Test Credentials:");
    console.log("═══════════════════════════════════════════════════════");
    console.log("Adjutant:  adjt@unit.mil     / Adjt@2025");
    console.log("IT JCO:    itjco@unit.mil    / ItJco@2025");
    console.log("User:      user@unit.mil     / User@2025");
    console.log("═══════════════════════════════════════════════════════\n");
  } catch (error) {
    console.error("\n❌ Fatal Error:", error);
    throw error;
  }
}

// Run initialization
initializeFirebase()
  .then(() => {
    console.log("✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
