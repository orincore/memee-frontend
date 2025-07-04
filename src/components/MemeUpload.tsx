import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadMeme } from '../services/api';

interface MemeUploadProps {
  onUploadSuccess?: (meme: any) => void;
  onClose?: () => void;
}

export const MemeUpload: React.FC<MemeUploadProps> = ({ onUploadSuccess, onClose }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Dark Humor');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Dark Humor', 'Dank Memes', 'Wholesome', 'Comedy', 'Gaming', 'Trending'
  ];

  const validateFile = (file: File): string[] => {
    const errors: string[] = [];
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      errors.push('Invalid file type. Please select JPG, PNG, GIF, WebP, MP4, MOV, AVI, or WebM.');
    }
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push('File size must be less than 10MB.');
    }
    
    // Check file name
    if (file.name.length > 100) {
      errors.push('File name is too long.');
    }
    
    return errors;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const errors = validateFile(file);
      if (errors.length > 0) {
        setError(errors.join(' '));
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !selectedFile) {
      setError('Please fill in all fields and select a file');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const uploadedMeme = await uploadMeme(title.trim(), category, selectedFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccess(true);
      
      // Reset form
      setTitle('');
      setCategory('Dark Humor');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess(uploadedMeme);
      }
      
      // Auto close after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        setUploadProgress(0);
        if (onClose) onClose();
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFilePreview = () => {
    if (!selectedFile) return null;
    
    const url = URL.createObjectURL(selectedFile);
    
    if (selectedFile.type.startsWith('image/')) {
      return (
        <img 
          src={url} 
          alt="Preview" 
          className="max-w-full max-h-64 object-contain rounded-lg"
          onLoad={() => URL.revokeObjectURL(url)}
        />
      );
    } else {
      return (
        <video 
          src={url} 
          controls 
          className="max-w-full max-h-64 object-contain rounded-lg"
          onLoadedMetadata={() => URL.revokeObjectURL(url)}
        />
      );
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Upload Successful!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your meme has been uploaded successfully.
          </p>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Upload Your Meme
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meme Title/Caption
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your meme title..."
              maxLength={200}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/200 characters
            </p>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    category === cat
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select File
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-purple-500 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/*,video/mp4,video/mov,video/avi,video/webm"
                className="hidden"
              />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Click to select or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF, WebP, MP4, MOV, AVI, WebM (max 10MB)
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Choose File
              </button>
            </div>
          </div>

          {/* File Preview */}
          {selectedFile && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Preview:</h4>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-center">
                {getFilePreview()}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || !title.trim() || !selectedFile}
            className="w-full px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload Meme'}
          </button>
        </form>
      </div>
    </div>
  );
}; 