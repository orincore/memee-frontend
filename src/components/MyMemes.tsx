import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, MoreVertical, X, Save, AlertCircle } from 'lucide-react';
import { getMyMemes, editMeme, deleteMeme } from '../services/api';
import { Meme } from '../types';

interface MyMemesProps {
  onClose?: () => void;
}

export const MyMemes: React.FC<MyMemesProps> = ({ onClose }) => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [memeCount, setMemeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMeme, setEditingMeme] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingMeme, setDeletingMeme] = useState<number | null>(null);

  const categories = [
    'Dark Humor', 'Dank Memes', 'Wholesome', 'Comedy', 'Gaming', 'Trending'
  ];

  useEffect(() => {
    fetchMyMemes();
  }, []);

  const fetchMyMemes = async () => {
    try {
      setLoading(true);
      setError(null);
      const myMemes = await getMyMemes();
      setMemes(myMemes);
      setMemeCount(myMemes.length);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch your memes');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (meme: Meme) => {
    setEditingMeme(meme.id);
    setEditTitle(meme.title);
    setEditCategory(meme.category);
  };

  const handleSave = async () => {
    if (!editingMeme) return;

    try {
      setSaving(true);
      const updatedMeme = await editMeme(editingMeme, editTitle, editCategory);
      
      // Update the meme in the list
      setMemes(prev => prev.map(meme => 
        meme.id === editingMeme ? updatedMeme : meme
      ));
      
      setEditingMeme(null);
      setEditTitle('');
      setEditCategory('');
    } catch (err: any) {
      setError(err.message || 'Failed to update meme');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingMeme(null);
    setEditTitle('');
    setEditCategory('');
  };

  const handleDelete = async (memeId: number) => {
    if (!confirm('Are you sure you want to delete this meme? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingMeme(memeId);
      await deleteMeme(memeId);
      
      // Remove the meme from the list
      setMemes(prev => prev.filter(meme => meme.id !== memeId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete meme');
    } finally {
      setDeletingMeme(null);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your memes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Memes ({memeCount})
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

        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {memes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No memes uploaded yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start creating and sharing your memes!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {memes.map(meme => (
              <div key={meme.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <div className="flex items-start space-x-4">
                  {/* Meme Image/Video */}
                  <div className="flex-shrink-0">
                    {meme.cloudinary_url.includes('.mp4') || meme.cloudinary_url.includes('.mov') ? (
                      <video
                        src={meme.cloudinary_url}
                        className="w-24 h-24 object-cover rounded-lg"
                        muted
                        loop
                      />
                    ) : (
                      <img
                        src={meme.cloudinary_url}
                        alt={meme.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                  </div>

                  {/* Meme Details */}
                  <div className="flex-1 min-w-0">
                    {editingMeme === meme.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                          placeholder="Meme title"
                        />
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSave}
                            disabled={saving || !editTitle.trim()}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                          >
                            <Save className="w-4 h-4" />
                            <span>{saving ? 'Saving...' : 'Save'}</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {meme.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                            {meme.category}
                          </span>
                          <span>❤️ {meme.like_count || 0}</span>
                          <span>💾 {meme.save_count || 0}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Uploaded {formatDate(meme.timestamp)}
                        </p>
                        {meme.uploader_username && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            by {meme.uploader_username}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {editingMeme !== meme.id && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(meme)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit meme"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(meme.id)}
                        disabled={deletingMeme === meme.id}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete meme"
                      >
                        {deletingMeme === meme.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 