// Cloudinary Storage Implementation (FREE Alternative to Firebase Storage)
// Free tier: 25GB storage + 25GB bandwidth/month

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
}

export type UploadProgressCallback = (progress: UploadProgress) => void;

// Cloudinary configuration from environment
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload file to Cloudinary
 */
const uploadToCloudinary = async (
  file: File,
  folder: string,
  onProgress?: UploadProgressCallback
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = {
            bytesTransferred: e.loaded,
            totalBytes: e.total,
            percentage: (e.loaded / e.total) * 100,
          };
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.secure_url);
      } else {
        reject(new Error('Upload failed'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error'));
    });

    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`
    );
    xhr.send(formData);
  });
};

/**
 * Upload user avatar
 */
export const uploadAvatar = async (
  userId: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> => {
  try {
    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('Avatar size must be less than 2MB');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Avatar must be an image file');
    }

    return await uploadToCloudinary(file, `avatars/${userId}`, onProgress);
  } catch (error) {
    console.error('Upload avatar error:', error);
    throw error;
  }
};

/**
 * Upload resource file
 */
export const uploadResource = async (
  resourceId: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> => {
  try {
    // Validate file size (100MB)
    if (file.size > 100 * 1024 * 1024) {
      throw new Error('Resource size must be less than 100MB');
    }

    return await uploadToCloudinary(file, `resources/${resourceId}`, onProgress);
  } catch (error) {
    console.error('Upload resource error:', error);
    throw error;
  }
};

/**
 * Upload message attachment
 */
export const uploadAttachment = async (
  conversationId: string,
  messageId: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> => {
  try {
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Attachment size must be less than 10MB');
    }

    return await uploadToCloudinary(
      file,
      `attachments/${conversationId}/${messageId}`,
      onProgress
    );
  } catch (error) {
    console.error('Upload attachment error:', error);
    throw error;
  }
};

/**
 * Delete file from Cloudinary (requires backend or Admin API)
 * Note: Direct deletion from frontend is not secure
 * This is a placeholder - implement via backend API
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
  console.warn(
    'Delete from Cloudinary requires backend implementation for security'
  );
  // TODO: Implement backend endpoint to delete from Cloudinary
  throw new Error('Delete not implemented - requires backend API');
};

/**
 * Get file size
 */
export const getFileSize = (file: File): number => {
  return file.size;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate file size
 */
export const validateFileSize = (
  file: File,
  maxSizeInMB: number
): { valid: boolean; error?: string } => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeInMB}MB limit`,
    };
  }

  return { valid: true };
};

/**
 * Validate file type
 */
export const validateFileType = (
  file: File,
  allowedTypes: string[]
): { valid: boolean; error?: string } => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  if (!fileExtension || !allowedTypes.includes(fileExtension)) {
    return {
      valid: false,
      error: `File type .${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
};
