import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { MemeCard } from './components/MemeCard';
import { ProductCard } from './components/ProductCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { AuthModal } from './components/AuthModal';
import { AdBanner } from './components/AdBanner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useMemes } from './hooks/useMemes';
import { mockProducts } from './data/mockData';
import { Category, AuthMode } from './types';
import { postFetchMemesDark, getMemeById, getSavedMemes, likeMeme, unlikeMeme, saveMeme, unsaveMeme, checkMemeLiked, checkMemeSaved } from './services/api';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { Heart, Bookmark } from 'lucide-react';
import VerifyOtp from './components/VerifyOtp';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import { MemeUpload } from './components/MemeUpload';
import { MyMemes } from './components/MyMemes';

function PostDetail({ id }: { id: string }) {
  const [meme, setMeme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Helper to check if the meme is a video
  const isVideo = (url: string) => /\.(mp4|webm|mov)$/i.test(url);
  
  useEffect(() => {
    setLoading(true);
    getMemeById(Number(id))
      .then(setMeme)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);
  
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-yellow-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">Loading meme...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-yellow-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
                 <div className="text-red-500 text-6xl mb-6">😵</div>
         <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
           Oops! Something went wrong
         </h2>
         <p className="text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {error}
        </p>
        <button
          onClick={() => window.history.back()}
                     className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-semibold text-base shadow-lg"
        >
          ← Go Back to Feed
        </button>
      </div>
    </div>
  );
  
  if (!meme) return null;
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-yellow-900">
      {/* Back Navigation */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="font-semibold text-lg">Back to Feed</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header Section */}
                     <div className="p-6 lg:p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-4xl">
              <h1 className="text-base lg:text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                {meme.title}
              </h1>
              
                             <div className="flex flex-wrap items-center gap-3 text-sm">
                                 <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-xs shadow-lg">
                   {meme.category}
                 </span>
                                 <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                   <span className="font-medium text-sm">{formatDate(meme.timestamp)}</span>
                 </div>
                {meme.uploader_username && (
                                     <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                     <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                       <span className="text-white text-xs font-bold">
                         {meme.uploader_username.charAt(0).toUpperCase()}
                       </span>
                     </div>
                     <span className="font-medium text-sm">by {meme.uploader_username}</span>
                   </div>
                )}
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="relative bg-black">
            {isVideo(meme.cloudinary_url) ? (
              <video
                src={meme.cloudinary_url}
                className="w-full max-h-[75vh] object-contain mx-auto"
                controls
                autoPlay
                muted
                loop
                poster={meme.cloudinary_url.replace(/\.(mp4|webm|mov)$/i, '.jpg')}
              />
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center min-h-[400px]">
                <img 
                  src={meme.cloudinary_url} 
                  alt={meme.title} 
                  className="w-full max-h-[75vh] object-contain" 
                />
              </div>
            )}
          </div>

          {/* Stats and Actions */}
                     <div className="p-6 lg:p-8">
            {/* Engagement Stats */}
                         <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-8">
                <div className="text-center">
                                     <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                     {meme.like_count || 0}
                   </div>
                   <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Likes</div>
                 </div>
                 <div className="text-center">
                   <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                     {meme.save_count || 0}
                   </div>
                   <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Saves</div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <LikeSaveButtons meme={meme} />
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              {/* Meme Details */}
              <div className="space-y-6">
                                 <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-3">
                   <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                     <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                   </div>
                   <span>Meme Details</span>
                 </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Category</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{meme.category}</span>
                  </div>
                  
                  {meme.subreddit && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Subreddit</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">r/{meme.subreddit}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Uploaded</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{formatDate(meme.timestamp)}</span>
                  </div>
                  
                  {meme.uploader_username && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Creator</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{meme.uploader_username}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="space-y-6">
                                 <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-3">
                   <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                     <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                     </svg>
                   </div>
                   <span>Actions</span>
                 </h3>
                
                                 <div className="space-y-4">
                   {meme.reddit_post_url && meme.reddit_post_url.includes('reddit.com') && (
                     <a 
                       href={meme.reddit_post_url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex items-center space-x-4 w-full p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-semibold shadow-lg group"
                     >
                       <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                         <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                         </svg>
                       </div>
                       <span className="text-base">View on Reddit</span>
                     </a>
                   )}
                   
                   {meme.reddit_post_url && meme.reddit_post_url.includes('instagram.com') && (
                     <a 
                       href={meme.reddit_post_url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex items-center space-x-4 w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-semibold shadow-lg group"
                     >
                       <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                         <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                         </svg>
                       </div>
                       <span className="text-base">View on Instagram</span>
                     </a>
                   )}
                  
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }}
                    className="flex items-center space-x-4 w-full p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 font-semibold shadow-lg group"
                  >
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center group-hover:bg-gray-400 dark:group-hover:bg-gray-500 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </div>
                                         <span className="text-base">Share Meme</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostDetailWrapper() {
  const { id } = useParams();
  if (!id) return null;
  return <PostDetail id={id} />;
}

// Reusable LikeSaveButtons component
function LikeSaveButtons({ meme }: { meme: any }) {
  const [isLiked, setIsLiked] = useState(!!meme.is_liked);
  const [likeCount, setLikeCount] = useState(meme.like_count ?? 0);
  const [isSaved, setIsSaved] = useState(!!meme.is_saved);
  const [saveCount, setSaveCount] = useState(meme.save_count ?? 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Fetch initial like/save status if not provided
  useEffect(() => {
    const fetchInitialStatus = async () => {
      try {
        // Always fetch the current status to ensure accuracy
        const [liked, saved] = await Promise.all([
          checkMemeLiked(meme.id),
          checkMemeSaved(meme.id)
        ]);
        setIsLiked(liked);
        setIsSaved(saved);
      } catch (error) {
        console.warn('Could not fetch like/save status:', error);
        // Keep the initial state from meme object if API fails
        setIsLiked(!!meme.is_liked);
        setIsSaved(!!meme.is_saved);
      }
    };

    fetchInitialStatus();
  }, [meme.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      if (isLiked) {
        await unlikeMeme(meme.id);
        setIsLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await likeMeme(meme.id);
        setIsLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (err) {
      alert('Failed to update like.');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saveLoading) return;
    setSaveLoading(true);
    try {
      if (isSaved) {
        await unsaveMeme(meme.id);
        setIsSaved(false);
        setSaveCount(saveCount - 1);
      } else {
        await saveMeme(meme.id);
        setIsSaved(true);
        setSaveCount(saveCount + 1);
      }
    } catch (err) {
      alert('Failed to update save.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-6 px-4 pb-2">
      <button
        onClick={handleLike}
        disabled={likeLoading}
        className={`flex items-center gap-1 text-gray-700 dark:text-gray-300 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
      >
        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        <span className="font-medium">{likeCount}</span>
      </button>
      <button
        onClick={handleSave}
        disabled={saveLoading}
        className={`flex items-center gap-1 text-gray-700 dark:text-gray-300 transition-colors ${isSaved ? 'text-blue-500' : 'hover:text-blue-500'}`}
      >
        <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        <span className="font-medium">{saveCount}</span>
      </button>
    </div>
  );
}

export { LikeSaveButtons };

function AppContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showSaved, setShowSaved] = useState(false);
  const [savedMemes, setSavedMemes] = useState<any[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showMyMemes, setShowMyMemes] = useState(false);

  // useMemes now only takes searchTerm
  const { memes, loading, error, hasMore, loadMore, refresh } = useMemes(
    searchTerm
  );

  // Add handler for refresh meme button
  const handleRefreshMemes = () => {
    refresh(); // Only refreshes the feed
  };

  const [fetchingNewMemes, setFetchingNewMemes] = useState(false);
  const handleFetchNewMemes = async () => {
    setFetchingNewMemes(true);
    try {
      await postFetchMemesDark();
    } finally {
      setFetchingNewMemes(false);
    }
  };

  // Create mixed content with products
  const createMixedContent = () => {
    const mixed: any[] = [];
    let productIndex = 0;

    memes.forEach((meme, index) => {
      mixed.push({ ...meme, type: 'meme' });
      // Add a product every 4 memes
      if ((index + 1) % 4 === 0 && productIndex < mockProducts.length) {
        mixed.push({ ...mockProducts[productIndex], type: 'product' });
        productIndex++;
      }
    });

    return mixed;
  };

  const mixedContent = createMixedContent();

  // Remove markMemeViewed logic (no longer in useMemes)
  const handleMemeClick = (id: number) => {
    navigate(`/post/${id}`);
  };

  const handleShowSaved = async () => {
    setShowSaved(true);
    setSavedLoading(true);
    setSavedError(null);
    try {
      const memesOrIds = await getSavedMemes();
      let memes;
      if (Array.isArray(memesOrIds) && memesOrIds.length > 0) {
        // Type guard: check if every item is a number
        if (memesOrIds.every((item: any) => typeof item === 'number')) {
          // Array of IDs
          memes = await Promise.all(memesOrIds.map((id: any) => getMemeById(id)));
        } else {
          // Array of meme objects
          memes = memesOrIds;
        }
      } else {
        memes = [];
      }
      setSavedMemes(memes);
    } catch (e: any) {
      setSavedError(e.message);
    } finally {
      setSavedLoading(false);
    }
  };

  const handleShowFeed = () => setShowSaved(false);

  const handleUploadSuccess = (uploadedMeme: any) => {
    // Refresh the feed to show the new meme
    refresh();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <h1 className="text-4xl font-bold mb-4 text-purple-600">Welcome to Meme Orincore</h1>
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-8 text-center max-w-xl">
          Discover, share, and enjoy the best memes! Please login or sign up to access the full experience.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => setAuthMode('login')}
            className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
          >
            Sign Up
          </button>
        </div>
        <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Failed to load memes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={refresh}
            className="bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600 transition-colors mb-2"
          >
            Try Again
          </button>
          {error === 'No access token found. Please log in.' && (
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors mt-2"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-yellow-900 transition-colors duration-200 overflow-x-hidden">
      {/* Meme collage background */}
      {!user && (
        <div className="absolute inset-0 z-0 pointer-events-none select-none opacity-30">
          <div className="w-full h-full flex flex-wrap justify-center items-center gap-8 animate-fade-in-slow">
            {[...Array(12)].map((_, i) => (
              <img
                key={i}
                src={`https://api.memegen.link/images/${['buzz','doge','drake','gru','joker','fry','leo','morpheus','spongebob','trump','y-u-no','success'][i]}/funny/meme.png`}
                alt="Meme collage"
                className="w-32 h-32 object-cover rounded-2xl shadow-lg border-2 border-white/70 dark:border-purple-700 rotate-[${(i%2===0?'-':'')}${10+i*2}deg] opacity-70 hover:scale-105 transition-transform duration-200"
                style={{ position: 'absolute', left: `${(i%4)*25+Math.random()*5}%`, top: `${(i%3)*30+Math.random()*5}%`, zIndex: 0 }}
              />
            ))}
          </div>
        </div>
      )}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        setAuthMode={setAuthMode}
        onPostClick={() => setShowUpload(true)}
        onMyMemesClick={() => setShowMyMemes(true)}
      />
      {/* Premium Meme Hero Section for not-logged-in users */}
      {!user && (
        <section className="w-full min-h-screen flex flex-col items-center justify-center py-0 px-0 relative z-10">
          {/* Animated meme emojis and overlays */}
          <div className="absolute left-8 top-8 text-8xl opacity-40 select-none pointer-events-none animate-bounce-slow">😂</div>
          <div className="absolute right-12 bottom-12 text-8xl opacity-30 select-none pointer-events-none animate-pulse">🔥</div>
          <div className="absolute left-1/2 top-1/4 -translate-x-1/2 text-8xl opacity-20 select-none pointer-events-none animate-spin-slow">😎</div>
          <div className="absolute right-1/4 top-1/3 text-7xl opacity-30 select-none pointer-events-none animate-bounce">🥳</div>
          {/* Hero content with glassmorphism */}
          <div className="flex flex-col items-center justify-center min-h-[70vh] w-full pt-24 pb-12 px-4 z-10">
            <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 rounded-3xl shadow-2xl border-4 border-yellow-300 dark:border-purple-700 px-10 py-12 max-w-3xl mx-auto flex flex-col items-center">
              <h1 className="text-6xl sm:text-7xl font-extrabold text-center bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl mb-6 tracking-tight animate-wiggle">
                Welcome to <span className="inline-block animate-bounce">Memee</span>
              </h1>
              <p className="text-2xl sm:text-3xl text-center text-gray-700 dark:text-yellow-100 font-mono mb-8 max-w-2xl">
                The <span className="font-bold text-pink-500">#1</span> place to discover, share, and laugh at the best memes on the internet!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 mt-2 mb-10 w-full max-w-xl justify-center">
                <Link to="/login" className="w-full sm:w-auto px-10 py-4 bg-white/90 text-purple-700 font-extrabold text-2xl rounded-2xl shadow-xl border-2 border-purple-300 hover:bg-purple-100 hover:text-pink-500 transition-all duration-200 text-center">
                  Login
                </Link>
                <Link to="/signup" className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-extrabold text-2xl shadow-xl border-2 border-pink-300 hover:from-yellow-400 hover:to-pink-500 hover:text-purple-800 transition-all duration-200 text-center">
                  Sign Up
                </Link>
                <a href="#feed" className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white rounded-2xl font-extrabold text-2xl shadow-xl hover:from-yellow-500 hover:to-purple-700 transition-all duration-200 text-center">
                  See Trending Memes 🚀
                </a>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-8 mb-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-32 h-32 bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg border-2 border-purple-200 dark:border-purple-700 flex items-center justify-center overflow-hidden relative">
                    <img
                      src={`https://api.memegen.link/images/${['buzz','doge','drake','gru','joker'][i-1]}/funny/meme.png`}
                      alt="Trending meme"
                      className="object-cover w-full h-full opacity-90 hover:scale-105 transition-transform duration-200"
                    />
                    <span className="absolute bottom-1 right-2 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold shadow">Trending</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* About and Why Memee section with glassmorphism */}
          <div className="w-full flex flex-col md:flex-row gap-8 justify-center items-stretch px-4 pb-16 mt-4 z-10">
            <div className="flex-1 max-w-xl backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-lg p-10 border-2 border-purple-200 dark:border-purple-700 flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-purple-700 dark:text-yellow-200 mb-4 text-center">About Memee</h2>
              <p className="text-xl text-gray-700 dark:text-yellow-100 text-center">
                Memee is your go-to platform for the freshest, funniest, and most viral memes. Join our vibrant community to share your own creations, save your favorites, and connect with meme lovers from around the world. Whether you love dark humor, dank memes, wholesome laughs, or trending topics, Memee has something for everyone. <span className="font-bold text-pink-500">Sign up</span> and start your meme journey today!
              </p>
            </div>
            <div className="flex-1 max-w-xl backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-lg p-10 border-2 border-yellow-200 dark:border-pink-700 flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-pink-500 dark:text-yellow-200 mb-4 text-center">Why Memee?</h2>
              <ul className="text-xl text-gray-700 dark:text-yellow-100 list-disc list-inside space-y-3">
                <li>🚀 Instantly access trending and viral memes</li>
                <li>🎨 Create and share your own meme masterpieces</li>
                <li>💾 Save your favorites and build your meme collection</li>
                <li>🌎 Connect with meme lovers worldwide</li>
                <li>🔒 100% free, safe, and always fun</li>
              </ul>
            </div>
          </div>
        </section>
      )}
      <main id="feed" className="max-w-2xl mx-auto px-4 sm:px-6 py-6 relative z-20">
        {/* Refresh Memes Button */}
        <div className="text-center mb-6 flex flex-col items-center gap-2">
          <button
            onClick={handleRefreshMemes}
            disabled={loading}
            className="bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-3 rounded-2xl hover:from-green-500 hover:to-green-700 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Refreshing...' : 'Refresh Memes'}
          </button>
        </div>

        {/* Saved/Feed Toggle */}
        <div className="text-center mb-6 flex flex-col items-center gap-2">
          <div className="flex gap-2 mb-2">
            <button
              onClick={handleShowFeed}
              className={`px-6 py-2 rounded-xl font-medium transition-colors ${!showSaved ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              Feed
            </button>
            <button
              onClick={handleShowSaved}
              className={`px-6 py-2 rounded-xl font-medium transition-colors ${showSaved ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              Saved
            </button>
          </div>
        </div>

        {/* Content Feed or Saved Memes */}
        {!showSaved ? (
          <div className="space-y-6">
            {mixedContent.map((item, index) => (
              <div key={`${item.type}-${item.id}`}> 
                {item.type === 'meme' ? (
                  <MemeCard meme={item} onClick={() => handleMemeClick(item.id)} />
                ) : (
                  <ProductCard product={item} />
                )}
                {/* Insert ads every 5 posts */}
                {(index + 1) % 5 === 0 && (
                  <AdBanner size="horizontal" className="my-6" />
                )}
              </div>
            ))}
            {hasMore && (
              <div className="sticky bottom-0 left-0 w-full flex justify-center bg-gradient-to-t from-gray-50/95 dark:from-gray-900/95 to-transparent pt-6 pb-4 z-20">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-purple-600 text-white rounded-2xl font-bold shadow-lg hover:bg-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {loading ? 'Loading...' : 'Load More Memes'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {savedLoading && <LoadingSpinner />}
            {savedError && <div className="text-center text-red-500 py-8">{savedError}</div>}
            {!savedLoading && !savedError && savedMemes.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🤷‍♂️</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No saved memes found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Save memes to see them here!
                </p>
              </div>
            )}
            {!savedLoading && !savedError && savedMemes.map(meme => (
              <MemeCard key={meme.id} meme={meme} onClick={() => handleMemeClick(meme.id)} />
            ))}
          </div>
        )}
      </main>

      {/* Sidebar Ad (Desktop only) */}
      <div className="hidden xl:block fixed right-4 top-24">
        <AdBanner size="vertical" />
      </div>

      {/* Auth Modal */}
      <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />

      {/* Upload Modal */}
      {showUpload && (
        <MemeUpload
          onUploadSuccess={handleUploadSuccess}
          onClose={() => setShowUpload(false)}
        />
      )}

      {/* My Memes Modal */}
      {showMyMemes && (
        <MyMemes onClose={() => setShowMyMemes(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/post/:id" element={<PostDetailWrapper />} />
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;