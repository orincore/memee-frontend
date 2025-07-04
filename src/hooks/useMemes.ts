import { useState, useEffect } from 'react';
import { Meme } from '../types';
import axios from 'axios';

export const useMemes = (searchTerm: string = '') => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [shownIds, setShownIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('shownMemeIds');
    return saved ? JSON.parse(saved) : [];
  });

  // Helper to update shown IDs in state and localStorage
  const updateShownIds = (newMemes: Meme[]) => {
    const newIds = newMemes.map((m) => m.id);
    const updated = Array.from(new Set([...shownIds, ...newIds]));
    setShownIds(updated);
    localStorage.setItem('shownMemeIds', JSON.stringify(updated));
  };

  const loadMemes = async (pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No access token found. Please log in.');
      const excludeIdsString = shownIds.join(',');
      const url = `http://localhost:8000/fetch-memes/feed?page=${pageNum}&page_size=10${excludeIdsString ? `&exclude_ids=${excludeIdsString}` : ''}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      let newMemes: Meme[] = response.data;
      // If searching, filter client-side (API does not support search param)
      if (searchTerm) {
        newMemes = newMemes.filter(meme =>
          meme.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setHasMore(false); // No pagination for search
      } else {
        setHasMore(newMemes.length === 10);
      }
      if (newMemes.length === 0) {
        setHasMore(false);
      }
      updateShownIds(newMemes);
      if (append) {
        setMemes(prev => [...prev, ...newMemes]);
      } else {
        setMemes(newMemes);
      }
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load memes');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadMemes(nextPage, true);
    }
  };

  const refresh = () => {
    setPage(1);
    setHasMore(true);
    setShownIds([]);
    localStorage.removeItem('shownMemeIds');
    loadMemes(1, false);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return {
    memes,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};