import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api.js';
import { toast } from 'sonner';

const useFetch = (fetchFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line

  useEffect(() => { execute(); }, [execute]);

  return { data, loading, error, refetch: execute };
};

export const useProducts = (params = {}) => {
  const key = JSON.stringify(params);
  return useFetch(() => api.getProducts(params), [key]);
};

export const useProduct = (slug) =>
  useFetch(() => api.getProductBySlug(slug), [slug]);

export const useCategories = () =>
  useFetch(() => api.getCategories(), []);

export const useTags = () =>
  useFetch(() => api.getTags(), []);

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bellezza_wishlist') || '[]'); }
    catch { return []; }
  });

  const toggle = (id) => {
    setWishlist(prev => {
      const isRemoving = prev.includes(id);
      const next = isRemoving ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('bellezza_wishlist', JSON.stringify(next));
      if (isRemoving) {
        toast.info('Removed from favorites');
      } else {
        toast.success('Added to favorites!');
      }
      return next;
    });
  };

  const isWished = (id) => wishlist.includes(id);

  return { wishlist, toggle, isWished };
};
