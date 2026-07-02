import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../utils/api.js';

const CACHE_KEY = 'bellezza_site_settings';

const DEFAULT_SETTINGS = {
  siteName: 'BEAUTY-HOUSE',
  tagline: 'Where Natural Beauty Begins',
  logo: '/assets/logo.png',
  amazonId: '',
  aliexpressId: '',
  ebayId: '',
  heroBadgeText: 'New arrivals in K-Beauty',
  heroBoxImage: '/assets/serum.avif',
  heroBoxTitle: 'Glow Serum Pro',
  heroBoxDescription: 'Best seller this week',
};

function getCachedSettings() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Ignore parse errors — fall through to defaults
  }
  return null;
}

function setCachedSettings(settings) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(settings));
  } catch {
    // localStorage may be full or unavailable — ignore
  }
}

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const cached = getCachedSettings();
  const [settings, setSettings] = useState(cached || DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(!cached); // No loading if we have cache

  const fetchSettings = useCallback(async () => {
    try {
      const data = await api.getSiteSettings();
      setSettings(data);
      setCachedSettings(data);
    } catch (err) {
      console.error('Failed to fetch site settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (newSettings) => {
    try {
      const data = await api.updateSiteSettings(newSettings);
      setSettings(data);
      setCachedSettings(data);
      return data;
    } catch (err) {
      console.error('Failed to update site settings:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, updateSettings, refetch: fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}