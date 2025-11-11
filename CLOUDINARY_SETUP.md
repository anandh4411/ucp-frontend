# Cloudinary Setup Guide (FREE Storage Alternative)

Since Firebase Storage now requires the Blaze plan, we'll use **Cloudinary** as a free alternative.

---

## 🎁 **Cloudinary Free Tier**

- ✅ **25 GB** storage
- ✅ **25 GB/month** bandwidth
- ✅ **All file types** supported (images, videos, documents, PDFs)
- ✅ Built-in CDN
- ✅ Image optimization
- ✅ No credit card required

---

## 🚀 **Quick Setup (5 Minutes)**

### **Step 1: Create Cloudinary Account**

1. Go to: https://cloudinary.com/users/register_free
2. Sign up with email (or Google/GitHub)
3. Verify email
4. Login to dashboard: https://console.cloudinary.com/

### **Step 2: Get Your Credentials**

In Cloudinary Dashboard, you'll see:

```
Cloud Name: your_cloud_name
API Key: 123456789012345
API Secret: abcdefghijklmnopqrs_tuvw
```

**Note**: We only need `Cloud Name` for frontend uploads!

### **Step 3: Create Upload Preset**

1. In dashboard, click **Settings** (⚙️ icon)
2. Go to **Upload** tab
3. Scroll to **Upload presets**
4. Click **Add upload preset**
5. Configure:
   ```
   Preset name: unit_portal_uploads
   Signing mode: Unsigned
   Folder: uploads
   ```
6. Click **Save**
7. Copy the preset name: `unit_portal_uploads`

### **Step 4: Configure Environment**

Update your `.env` file:

```bash
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=unit_portal_uploads
```

Replace `your_cloud_name` with your actual cloud name from Step 2.

### **Step 5: Update Environment Example**

```bash
# Already done - see .env.example
```

### **Step 6: Install Package (Optional)**

```bash
# Optional - only needed if you want advanced features
npm install cloudinary-core
```

### **Step 7: Test Upload**

```bash
npm run dev

# Try uploading an avatar or resource
# File should appear in Cloudinary Dashboard → Media Library
```

---

## 📝 **How to Use**

### **Import Storage Functions**

```typescript
import {
  uploadAvatar,
  uploadResource,
  uploadAttachment,
} from '@/api/cloudinary/storage';
```

### **Upload Avatar**

```typescript
const handleAvatarUpload = async (file: File) => {
  try {
    const url = await uploadAvatar(userId, file, (progress) => {
      console.log(`${progress.percentage}% uploaded`);
    });

    console.log('Avatar uploaded:', url);
    // Save URL to Firestore user profile
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### **Upload Resource**

```typescript
const handleResourceUpload = async (file: File) => {
  try {
    const url = await uploadResource(resourceId, file, (progress) => {
      setUploadProgress(progress.percentage);
    });

    // Save to Firestore
    await createResource({
      title: file.name,
      fileUrl: url,
      fileSize: file.size,
      fileType: getFileType(file),
      // ... other fields
    });
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### **Upload Message Attachment**

```typescript
const handleAttachmentUpload = async (file: File) => {
  const url = await uploadAttachment(conversationId, messageId, file);

  await sendMessage(conversationId, {
    content: message,
    attachments: [
      {
        name: file.name,
        url: url,
        size: file.size,
        type: file.type,
      },
    ],
  });
};
```

---

## 📊 **File Size Limits**

| Type | Max Size | Validation |
|------|----------|------------|
| **Avatars** | 2 MB | Automatic |
| **Resources** | 100 MB | Automatic |
| **Attachments** | 10 MB | Automatic |

---

## 🗑️ **Deleting Files**

**⚠️ Important**: Direct deletion from frontend is not secure.

### **Option 1: Manual Deletion** (Development)

1. Go to Cloudinary Dashboard
2. Media Library
3. Find and delete file

### **Option 2: Auto-Delete via Cloudinary** (Recommended)

Configure auto-delete in upload preset:
1. Settings → Upload → Upload presets
2. Edit your preset
3. Enable **"Auto-tagging"**
4. Set **Expiration** (optional)

### **Option 3: Backend API** (Production)

Create a backend endpoint to delete via Cloudinary Admin API:

```typescript
// Backend only - never expose API secret to frontend!
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
});

// Delete by public_id
await cloudinary.uploader.destroy(publicId);
```

---

## 🔒 **Security**

### **Upload Preset (Unsigned)**

Pros:
- ✅ No backend needed
- ✅ Direct uploads from frontend
- ✅ Fast and simple

Cons:
- ⚠️ Anyone with preset name can upload
- ⚠️ Can't restrict file types server-side

### **Best Practices**

1. **Client-side validation** (already implemented)
2. **Monitor uploads** in Cloudinary dashboard
3. **Set quotas** in Cloudinary settings
4. **Enable moderation** for user-uploaded content

### **For Production**

Consider upgrading to **signed uploads**:
1. Generate signature on backend
2. Pass signature to frontend
3. Upload with signature

---

## 📈 **Monitoring Usage**

### **Check Usage**

1. Cloudinary Dashboard
2. Click **Reports** in sidebar
3. View:
   - Storage used
   - Bandwidth used
   - Transformations used

### **Free Tier Limits**

```
Storage: 25 GB
Bandwidth: 25 GB/month
Transformations: 25,000/month
```

**Your estimated usage**: ~2-3 GB storage, ~5 GB bandwidth/month ✅

---

## 🎨 **Bonus: Image Optimization**

Cloudinary automatically optimizes images!

### **Get Optimized URL**

```typescript
// Original upload URL
const url = 'https://res.cloudinary.com/cloud/image/upload/v123/avatar.jpg';

// Optimized (auto format, auto quality)
const optimized = url.replace('/upload/', '/upload/f_auto,q_auto/');

// Resized thumbnail (200x200)
const thumbnail = url.replace('/upload/', '/upload/w_200,h_200,c_fill/');

// Cropped to face
const avatar = url.replace('/upload/', '/upload/w_200,h_200,c_thumb,g_face/');
```

---

## ✅ **Testing Checklist**

- [ ] Created Cloudinary account
- [ ] Created unsigned upload preset
- [ ] Added credentials to `.env`
- [ ] Tested avatar upload
- [ ] Tested resource upload
- [ ] Verified files in Cloudinary dashboard
- [ ] URLs work in browser

---

## 🆘 **Troubleshooting**

### **Error: "Invalid upload preset"**

**Solution**: Check preset name in Cloudinary dashboard matches `.env`

### **Error: "Upload failed"**

**Solution**:
1. Check internet connection
2. Verify credentials in `.env`
3. Check Cloudinary dashboard for errors

### **Error: "File too large"**

**Solution**:
- Avatars: max 2MB
- Resources: max 100MB
- Attachments: max 10MB

### **CORS Error**

**Solution**: Cloudinary CORS is enabled by default. If you see CORS errors:
1. Dashboard → Settings → Security
2. Enable **"Allowed fetch domains"**
3. Add: `http://localhost:5174` and your production domain

---

## 🔄 **Migration from Firebase Storage**

### **Before (Firebase)**

```typescript
import { uploadAvatar } from '@/api/firebase/storage';
```

### **After (Cloudinary)**

```typescript
import { uploadAvatar } from '@/api/cloudinary/storage';
```

**API is identical!** Just change the import path.

---

## 📚 **Additional Resources**

- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Upload Widget](https://cloudinary.com/documentation/upload_widget)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Video Uploads](https://cloudinary.com/documentation/video_upload)

---

## 🎉 **Setup Complete!**

You now have:

✅ **25 GB free storage** (10x more than Firebase Storage was!)
✅ **Automatic CDN delivery**
✅ **Image optimization**
✅ **No credit card required**
✅ **Same API as Firebase Storage**

**Cost**: $0.00/month forever (up to 25GB)

---

**Happy Uploading! 📤**
