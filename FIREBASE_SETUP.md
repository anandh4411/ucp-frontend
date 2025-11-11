# Firebase Setup Guide - Unit Communication Portal

Complete step-by-step guide to set up Firebase backend for your Unit Communication Portal.

---

## 📋 Table of Contents

1. [Firebase Project Setup](#1-firebase-project-setup)
2. [Enable Firebase Services](#2-enable-firebase-services)
3. [Install Firebase SDK](#3-install-firebase-sdk)
4. [Configure Environment Variables](#4-configure-environment-variables)
5. [Deploy Firebase Rules](#5-deploy-firebase-rules)
6. [Initialize Database](#6-initialize-database)
7. [Test the Setup](#7-test-the-setup)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Firebase Project Setup

### Step 1.1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter project name: `unit-comn-portal` (or your preferred name)
4. **Disable** Google Analytics (not needed for Spark plan)
5. Click **"Create Project"**
6. Wait for project creation (30-60 seconds)

### Step 1.2: Register Web App

1. In Firebase Console, click the **web icon (</>) "Add app"**
2. Register app nickname: `Unit Comn Portal Web`
3. **DO NOT** check "Firebase Hosting" yet
4. Click **"Register app"**
5. **COPY** the Firebase config object - you'll need this later!

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

6. Click **"Continue to console"**

---

## 2. Enable Firebase Services

### Step 2.1: Enable Authentication

1. In left sidebar, click **"Authentication"**
2. Click **"Get Started"**
3. Click **"Email/Password"** tab
4. Toggle **"Email/Password"** to **ENABLED**
5. Leave "Email link" disabled
6. Click **"Save"**

### Step 2.2: Create Firestore Database

1. In left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add rules later)
4. Choose location closest to your users:
   - Asia: `asia-south1` (Mumbai)
   - US: `us-central1`
   - Europe: `europe-west1`
5. Click **"Enable"**
6. Wait for database creation

### Step 2.3: Create Firebase Storage

1. In left sidebar, click **"Storage"**
2. Click **"Get Started"**
3. Click **"Next"** (production mode)
4. Select **same location as Firestore**
5. Click **"Done"**

---

## 3. Install Firebase SDK

### Step 3.1: Install Dependencies

In your project directory:

```bash
npm install firebase firebase-admin
```

### Step 3.2: Verify Installation

```bash
npm list firebase firebase-admin
```

You should see:
```
├── firebase@11.x.x
└── firebase-admin@13.x.x
```

---

## 4. Configure Environment Variables

### Step 4.1: Update `.env` File

Open your `.env` file and add Firebase configuration:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Keep existing variables
VITE_API_BASE_URL=http://localhost:8000/api
VITE_DISABLE_AUTH_GUARD=false
VITE_ENABLE_DEV_TOOLS=true
```

**⚠️ IMPORTANT**:
- Replace all `your_*` placeholders with actual values from Step 1.2
- DO NOT commit `.env` to git (already in `.gitignore`)

### Step 4.2: Verify Configuration

Restart your dev server:

```bash
npm run dev
```

Check browser console for:
```
🔥 Firebase initialized: { projectId: 'your-project-id', configured: true }
```

---

## 5. Deploy Firebase Rules

### Step 5.1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 5.2: Login to Firebase

```bash
firebase login
```

Follow the browser prompts to authenticate.

### Step 5.3: Initialize Firebase in Project

```bash
firebase init
```

Select:
- ✅ Firestore
- ✅ Storage
- ❌ (Uncheck all others)

For each prompt:
- **Project**: Select your project from list
- **Firestore rules**: `firestore.rules` (already exists)
- **Firestore indexes**: `firestore.indexes.json` (already exists)
- **Storage rules**: `storage.rules` (already exists)

### Step 5.4: Deploy Rules

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

You should see:
```
✔  Deploy complete!
✔  firestore: rules deployed successfully
✔  firestore: indexes deployed successfully
✔  storage: rules deployed successfully
```

---

## 6. Initialize Database

### Step 6.1: Download Service Account Key

1. Go to Firebase Console
2. Click **⚙️ (Settings)** → **Project settings**
3. Go to **"Service accounts"** tab
4. Click **"Generate new private key"**
5. Click **"Generate key"** in confirmation dialog
6. Save file as `serviceAccountKey.json` in project root
7. **⚠️ NEVER commit this file to git!**

Add to `.gitignore` if not already present:
```
serviceAccountKey.json
```

### Step 6.2: Run Initialization Script

```bash
node firebase-init.js
```

You should see:
```
🔥 Initializing Firebase for Unit Communication Portal...

👥 Creating users and authentication...

✅ Created: adjt@unit.mil (adjt)
✅ Created: itjco@unit.mil (it_jco)
✅ Created: user@unit.mil (user)

📢 Creating sample announcements...

✅ Created: Republic Day Parade 2025
✅ Created: Weapon Training Schedule - January 2025
✅ Created: Leave Roster - Updated

📅 Creating sample events...

✅ Created: Weekly CO Briefing
✅ Created: Physical Training Session
✅ Created: Republic Day Celebration

📁 Creating sample resources...

✅ Created: Training Manual 2025
✅ Created: Unit SOP Document

💬 Creating sample conversation...

✅ Created sample conversation

✨ Firebase initialization complete!

═══════════════════════════════════════════════════════
📝 Test Credentials:
═══════════════════════════════════════════════════════
Adjutant:  adjt@unit.mil     / Adjt@2025
IT JCO:    itjco@unit.mil    / ItJco@2025
User:      user@unit.mil     / User@2025
═══════════════════════════════════════════════════════

✅ Script completed successfully
```

---

## 7. Test the Setup

### Step 7.1: Test Login

1. Start dev server: `npm run dev`
2. Navigate to http://localhost:5174
3. Try logging in with test credentials:
   - **Email**: `adjt@unit.mil`
   - **Password**: `Adjt@2025`

### Step 7.2: Verify Data in Firebase Console

1. Go to Firebase Console → **Firestore Database**
2. You should see collections:
   - `users` (3 documents)
   - `announcements` (3 documents)
   - `events` (3 documents)
   - `resources` (2 documents)
   - `conversations` (1 document)
   - `user_preferences` (3 documents)

### Step 7.3: Test Real-time Features

1. Login as Adjutant
2. Navigate to Announcements page
3. Keep browser open
4. In Firebase Console → Firestore → announcements
5. Edit any announcement (change title)
6. **Watch your browser** - the change should appear **instantly** without refresh!

✅ **Real-time working!**

---

## 8. Troubleshooting

### Issue: "Firebase not configured" error

**Solution**:
1. Check `.env` file has all `VITE_FIREBASE_*` variables
2. Restart dev server: `npm run dev`
3. Clear browser cache

### Issue: "Permission denied" in Firestore

**Solution**:
1. Verify rules are deployed: `firebase deploy --only firestore:rules`
2. Check Firebase Console → Firestore → Rules tab
3. Make sure user is logged in (check Network tab for auth token)

### Issue: firebase-init.js fails with "Permission denied"

**Solution**:
1. Verify `serviceAccountKey.json` exists in project root
2. Check file has correct JSON format
3. Verify you're using the correct project's service account

### Issue: "Index not found" error

**Solution**:
```bash
firebase deploy --only firestore:indexes
```

Wait 2-3 minutes for indexes to build, then retry.

### Issue: Storage upload fails

**Solution**:
1. Deploy storage rules: `firebase deploy --only storage:rules`
2. Check file size limits:
   - Avatar: 2MB max
   - Resources: 100MB max
   - Attachments: 10MB max

### Issue: Real-time not working

**Solution**:
1. Check browser console for errors
2. Verify Firestore rules allow read access
3. Check network tab - should see WebSocket connection to Firestore
4. Try hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

---

## 🎉 Setup Complete!

Your Firebase backend is now fully configured with:

✅ **Authentication** - Email/password login
✅ **Firestore** - Real-time database with security rules
✅ **Storage** - File upload/download
✅ **Real-time Listeners** - Instant updates for messages, announcements
✅ **Browser Notifications** - Desktop alerts
✅ **Seed Data** - Test users and sample content

---

## Next Steps

### 1. Update Frontend to Use Firebase

Replace mock data with Firebase calls in features:

```typescript
// Old (mock data)
import data from '@/data/announcements.json';

// New (Firebase)
import { getAnnouncements } from '@/api/firebase';

const announcements = await getAnnouncements();
```

### 2. Add Real-time Listeners

```typescript
import { subscribeToAnnouncements } from '@/api/firebase';

useEffect(() => {
  const unsubscribe = subscribeToAnnouncements((announcements) => {
    setAnnouncements(announcements);
  });

  return () => unsubscribe();
}, []);
```

### 3. Deploy to Firebase Hosting (Optional)

```bash
firebase init hosting
firebase deploy --only hosting
```

Your app will be live at: `https://your-project-id.web.app`

---

## 📚 Additional Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Storage Rules](https://firebase.google.com/docs/storage/security)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)

---

## 🆘 Need Help?

If you encounter issues not covered here:

1. Check Firebase Console → **Usage** tab (ensure not hitting limits)
2. Check browser console for error messages
3. Check Firebase Console → **Logs** for backend errors
4. Review security rules in Firebase Console

---

**Happy Coding! 🚀**
