# Firebase Quick Start Guide ⚡

**Get your backend running in 15 minutes!**

---

## 📋 Prerequisites

- [ ] Node.js installed
- [ ] Google account
- [ ] Project cloned locally

---

## 🚀 Quick Setup (5 Steps)

### 1️⃣ Create Firebase Project (5 min)

```
1. Go to: https://console.firebase.google.com/
2. Click "Add Project" → Name: unit-comn-portal
3. Disable Google Analytics → Create
4. Click web icon </> → Register app
5. COPY the config object (you'll need this!)
```

### 2️⃣ Enable Services (3 min)

```
In Firebase Console sidebar:

✅ Authentication → Get Started → Email/Password → Enable → Save
✅ Firestore Database → Create → Production mode → Select region → Enable
❌ Storage → SKIP (No longer free! We'll use Cloudinary instead)
```

### 3️⃣ Configure Your App (2 min)

```bash
# Copy environment template
cp .env.example .env

# Edit .env and paste your Firebase config
nano .env  # or use VS Code
```

Paste Firebase values from Step 1:
```bash
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc
```

### 4️⃣ Deploy Security Rules (3 min)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select Firestore + Storage)
firebase init

# Deploy rules (only Firestore, no Storage)
firebase deploy --only firestore:rules,firestore:indexes
```

### 5️⃣ Initialize Database (2 min)

```bash
# Download service account key:
# Firebase Console → Settings → Service Accounts → Generate new key
# Save as: serviceAccountKey.json

# Install dependencies
npm install firebase firebase-admin

# Run initialization
node firebase-init.js
```

---

## ✅ Test It!

```bash
# Start dev server
npm run dev

# Login with test credentials:
Email: adjt@unit.mil
Password: Adjt@2025
```

---

## 🎯 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Adjutant** (Admin) | `adjt@unit.mil` | `Adjt@2025` |
| **IT JCO** (Moderator) | `itjco@unit.mil` | `ItJco@2025` |
| **User** (Personnel) | `user@unit.mil` | `User@2025` |

---

## 🔥 What You Get

✅ **Authentication** - Login/logout/password reset
✅ **Real-time Database** - Instant updates across all devices
✅ **Security Rules** - Role-based access control
✅ **Sample Data** - 3 users, announcements, events, resources
✅ **Browser Notifications** - Desktop alerts for new messages

**For File Storage**: Use Cloudinary (25GB free!) - See `CLOUDINARY_SETUP.md`

---

## 🆘 Common Issues

**❌ "Firebase not configured"**
```bash
# Solution: Restart dev server
npm run dev
```

**❌ "Permission denied"**
```bash
# Solution: Redeploy rules
firebase deploy --only firestore:rules
```

**❌ firebase-init.js fails**
```
# Solution: Check serviceAccountKey.json exists in project root
ls -la serviceAccountKey.json
```

---

## 📚 Full Documentation

For detailed setup, troubleshooting, and advanced features:
👉 **See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**

---

## 🎉 You're Done!

Your Firebase backend is live and ready to use!

**Next**: Update your frontend components to use Firebase APIs instead of mock data.

Example:
```typescript
// Replace this
import data from '@/data/announcements.json';

// With this
import { getAnnouncements } from '@/api/firebase';
const announcements = await getAnnouncements();
```

---

**Happy Coding! 🚀**
