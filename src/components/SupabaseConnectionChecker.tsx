import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase-client';
import { SupabaseConnectionGuide } from './SupabaseConnectionGuide';

/**
 * Supabase Connection Checker
 * Checks if Supabase is properly configured and shows a guide if not
 */

export function SupabaseConnectionChecker({ children }: { children: React.ReactNode }) {
  const [showGuide, setShowGuide] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setChecking(true);
      
      // Try to connect to Supabase
      const { error: connError } = await supabase.auth.getSession();
      
      if (connError) {
        // Network error or configuration issue
        if (connError.message.includes('Failed to fetch') || connError.message.includes('fetch')) {
          setError('Cannot connect to Supabase. Please check your configuration.');
          setShowGuide(true);
        }
      } else {
        // Connection successful
        setShowGuide(false);
        setError(null);
      }
    } catch (err: any) {
      // Network error
      if (err.message?.includes('Failed to fetch') || err.name === 'TypeError') {
        setError('Network error: Cannot reach Supabase backend.');
        setShowGuide(true);
      }
    } finally {
      setChecking(false);
    }
  };

  // Don't show guide while checking or if everything is fine
  if (checking || !showGuide) {
    return <>{children}</>;
  }

  // Show guide if there's a connection issue
  return (
    <>
      {children}
      <SupabaseConnectionGuide 
        error={error || undefined} 
        onDismiss={() => setShowGuide(false)}
      />
    </>
  );
}
