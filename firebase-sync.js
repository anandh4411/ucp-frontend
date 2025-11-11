// Firebase Sync Script - Ensures Auth and Firestore are in sync
// Run this if firebase-init.js said "user exists" but Firestore collections are empty
// Usage: node firebase-sync.js

import admin from "firebase-admin";
import { readFileSync } from "fs";

// Read service account key
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);

if (!serviceAccount.project_id) {
  console.error("❌ Error: serviceAccountKey.json is missing project_id");
  process.exit(1);
}

console.log(`📋 Using Firebase project: ${serviceAccount.project_id}\n`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

async function syncFirebase() {
  console.log("🔄 Syncing Firebase Auth with Firestore...\n");

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
      let userRecord;

      // Try to get existing user
      try {
        userRecord = await auth.getUserByEmail(userData.email);
        console.log(`✅ Auth user exists: ${userData.email}`);
      } catch (error) {
        // User doesn't exist in auth, create it
        if (error.code === "auth/user-not-found") {
          userRecord = await auth.createUser({
            email: userData.email,
            password: userData.password,
            emailVerified: true,
            displayName: userData.profile.name,
          });
          console.log(`✅ Created auth user: ${userData.email}`);
        } else {
          throw error;
        }
      }

      // Always set custom claims (in case they're missing)
      await auth.setCustomUserClaims(userRecord.uid, {
        role: userData.profile.role,
      });

      // Check if Firestore document exists
      const userDoc = await db.collection("users").doc(userRecord.uid).get();

      if (!userDoc.exists) {
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
        console.log(`✅ Created Firestore user doc: ${userData.email}`);
      } else {
        console.log(`✅ Firestore user doc exists: ${userData.email}`);
      }

      // Check if user preferences exist
      const prefsDoc = await db
        .collection("user_preferences")
        .doc(userRecord.uid)
        .get();

      if (!prefsDoc.exists) {
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
        console.log(`✅ Created user preferences: ${userData.email}`);
      } else {
        console.log(`✅ User preferences exist: ${userData.email}`);
      }

      createdUsers.push({ uid: userRecord.uid, ...userData });
      console.log("");
    } catch (error) {
      console.error(`❌ Error syncing ${userData.email}:`, error.message);
    }
  }

  // Create sample data only if collections are empty
  console.log("\n📊 Checking sample data...\n");

  // Check announcements
  const announcementsSnapshot = await db
    .collection("announcements")
    .limit(1)
    .get();

  if (announcementsSnapshot.empty) {
    console.log("📢 Creating sample announcements...\n");

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
    ];

    for (const ann of announcements) {
      await db.collection("announcements").add(ann);
      console.log(`✅ Created: ${ann.title}`);
    }
  } else {
    console.log("✅ Announcements already exist");
  }

  // Check events
  const eventsSnapshot = await db.collection("events").limit(1).get();

  if (eventsSnapshot.empty) {
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
    ];

    for (const event of events) {
      await db.collection("events").add(event);
      console.log(`✅ Created: ${event.title}`);
    }
  } else {
    console.log("✅ Events already exist");
  }

  // Check resources
  const resourcesSnapshot = await db.collection("resources").limit(1).get();

  if (resourcesSnapshot.empty) {
    console.log("\n📁 Creating sample resources...\n");

    const resources = [
      {
        uuid: "res-001",
        title: "Training Manual 2025",
        description:
          "Complete training manual for all personnel - updated for 2025",
        fileName: "training-manual-2025.pdf",
        fileUrl: "",
        fileSize: 1024 * 1024 * 2,
        fileType: "pdf",
        category: "training",
        uploadedById:
          createdUsers.find((u) => u.profile.role === "adjt")?.uid || "",
        tags: ["training", "manual", "2025"],
        downloads: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    ];

    for (const resource of resources) {
      await db.collection("resources").add(resource);
      console.log(`✅ Created: ${resource.title}`);
    }
  } else {
    console.log("✅ Resources already exist");
  }

  console.log("\n✨ Sync complete!\n");
  console.log("═══════════════════════════════════════════════════════");
  console.log("📝 Test Credentials:");
  console.log("═══════════════════════════════════════════════════════");
  console.log("Adjutant:  adjt@unit.mil     / Adjt@2025");
  console.log("IT JCO:    itjco@unit.mil    / ItJco@2025");
  console.log("User:      user@unit.mil     / User@2025");
  console.log("═══════════════════════════════════════════════════════");
  console.log("\n🔍 Next: Check Firebase Console:");
  console.log("   - Authentication > Users (should see 3 users)");
  console.log("   - Firestore > users collection (should see 3 docs)");
  console.log(
    "   - Firestore > user_preferences collection (should see 3 docs)\n"
  );
}

// Run sync
syncFirebase()
  .then(() => {
    console.log("✅ Sync completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Sync failed:", error);
    process.exit(1);
  });
