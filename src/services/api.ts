import { Meme } from '../types';

const API_BASE_URL = 'https://memeeapi.orincore.com';

function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');
  return { Authorization: `Bearer ${token}` };
}

export const fetchMemes = async (category: string = 'dark', page: number = 1, pageSize: number = 10): Promise<Meme[]> => {
  try {
    let url;
    if (category === 'dark') {
      url = `${API_BASE_URL}/memes/dark?random=true&page=${page}&page_size=20`;
    } else {
      url = `${API_BASE_URL}/memes/${category}?page=${page}&page_size=${pageSize}`;
    }
    const response = await fetch(url, { headers: { ...getAuthHeaders() } });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const memes: Meme[] = await response.json();
    
    // Use real API data, do not add random likes/comments/shares
    return memes.map(meme => ({
      ...meme,
      author: extractAuthorFromUrl(meme.reddit_post_url),
      timeAgo: formatTimeAgo(meme.timestamp),
      isVideo: isVideoUrl(meme.cloudinary_url)
    }));
  } catch (error) {
    console.error('Error fetching memes:', error);
    throw error;
  }
};

const extractAuthorFromUrl = (url: string): string => {
  // Extract subreddit name from Reddit URL as author
  const match = url.match(/\/r\/([^\/]+)\//);
  return match ? `r/${match[1]}` : 'Anonymous';
};

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const memeTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - memeTime.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return memeTime.toLocaleDateString();
};

const isVideoUrl = (url: string): boolean => {
  // Check if Cloudinary URL is for video
  return url.includes('/video/') || url.includes('.mp4') || url.includes('.webm') || url.includes('.mov');
};

export const searchMemes = async (query: string, category: string = 'dark'): Promise<Meme[]> => {
  // For now, fetch all memes and filter client-side
  // In a real app, you'd have a search endpoint
  const memes = await fetchMemes(category, 1, 50);
  return memes.filter(meme => 
    meme.title.toLowerCase().includes(query.toLowerCase())
  );
};

export const postFetchMemesDark = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/fetch-memes/dark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error posting to /fetch-memes/dark:', error);
    throw error;
  }
};

export const getMemeById = async (id: number): Promise<any> => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');
  const response = await fetch(`${API_BASE_URL}/memes/id/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const meme = await response.json();
  
  // Always fetch the current like/save status to ensure accuracy
  try {
    const [likeResponse, saveResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/memes/${id}/likes`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(`${API_BASE_URL}/memes/${id}/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);
    
    if (likeResponse.ok) {
      const likeData = await likeResponse.json();
      meme.is_liked = likeData.is_liked || false;
    }
    
    if (saveResponse.ok) {
      const saveData = await saveResponse.json();
      meme.is_saved = saveData.is_saved || false;
    }
  } catch (error) {
    console.warn('Could not fetch like/save status:', error);
    // Set default values if API calls fail
    meme.is_liked = meme.is_liked || false;
    meme.is_saved = meme.is_saved || false;
  }
  
  return meme;
};

export const likeMeme = async (id: number): Promise<void> => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');
  const response = await fetch(`${API_BASE_URL}/memes/${id}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error(`Failed to like meme: ${response.status}`);
};

export const unlikeMeme = async (id: number): Promise<void> => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');
  const response = await fetch(`${API_BASE_URL}/memes/${id}/unlike`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error(`Failed to unlike meme: ${response.status}`);
};

export const getMemeLikeCount = async (id: number): Promise<number> => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');
  const response = await fetch(`${API_BASE_URL}/memes/${id}/likes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error(`Failed to get like count: ${response.status}`);
  const data = await response.json();
  return data.like_count;
};

export const checkMemeLiked = async (id: number): Promise<boolean> => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');
  const response = await fetch(`${API_BASE_URL}/memes/${id}/likes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error(`Failed to check like status: ${response.status}`);
  const data = await response.json();
  return data.is_liked || false;
};

export const checkMemeSaved = async (id: number): Promise<boolean> => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');
  const response = await fetch(`${API_BASE_URL}/memes/${id}/saved`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error(`Failed to check save status: ${response.status}`);
  const data = await response.json();
  return data.is_saved || false;
};

export const getSavedMemes = async (): Promise<Meme[]> => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');
  const response = await fetch(`${API_BASE_URL}/memes/saved/ids`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error(`Failed to fetch saved memes: ${response.status}`);
  return await response.json();
};

export const saveMeme = async (id: number): Promise<void> => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');
  const response = await fetch(`${API_BASE_URL}/memes/${id}/save`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error(`Failed to save meme: ${response.status}`);
};

export const unsaveMeme = async (id: number): Promise<void> => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');
  const response = await fetch(`${API_BASE_URL}/memes/${id}/unsave`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error(`Failed to unsave meme: ${response.status}`);
};

export const uploadMeme = async (title: string, category: string, file: File): Promise<Meme> => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');
  
  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/memes/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to upload meme: ${response.status}`);
  }
  
  return await response.json();
};

export const getMyMemes = async (): Promise<Meme[]> => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');
  
  // Get user ID from localStorage or decode from token
  const user = localStorage.getItem('memee_user');
  if (!user) throw new Error('User information not found. Please log in again.');
  
  const userData = JSON.parse(user);
  const userId = userData.id;
  
  const response = await fetch(`${API_BASE_URL}/memes/debug/user/${userId}/memes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to fetch your memes: ${response.status}`);
  }
  
  const data = await response.json();
  return data.memes; // Extract memes array from response
};

export const editMeme = async (memeId: number, title: string, category: string): Promise<Meme> => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');
  
  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  
  const response = await fetch(`${API_BASE_URL}/memes/${memeId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to edit meme: ${response.status}`);
  }
  
  return await response.json();
};

export const deleteMeme = async (memeId: number): Promise<void> => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');
  const response = await fetch(`${API_BASE_URL}/memes/${memeId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error(`Failed to delete meme: ${response.status}`);
};

export const verifyOtp = async (email: string, otp: string): Promise<any> => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('otp', otp);
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) throw new Error('OTP verification failed');
  return await response.json();
};

export const resendOtp = async (email: string): Promise<any> => {
  const formData = new FormData();
  formData.append('email', email);
  const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) throw new Error('Failed to resend OTP');
  return await response.json();
};