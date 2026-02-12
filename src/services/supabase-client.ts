/**
 * Supabase Client
 * Centralized Supabase client instance
 */

import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info.tsx';

// Safe environment variable access with fallback
const getEnvVar = (key: string): string | undefined => {
  try {
    // Check if import.meta.env exists and is defined
    if (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env === 'object') {
      return import.meta.env[key];
    }
    return undefined;
  } catch (error) {
    // Fallback for environments where import.meta is not available
    return undefined;
  }
};

// Try environment variables first, fallback to imported credentials
const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL') || `https://${projectId}.supabase.co`;
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY') || publicAnonKey;

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('⚠️ Supabase configuration missing! Please check your environment variables.');
}

// Create and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'x-client-info': 'kaal-productivity-app@1.0.0'
    }
  }
});

// Export types for convenience
export type { SupabaseClient } from '@supabase/supabase-js';