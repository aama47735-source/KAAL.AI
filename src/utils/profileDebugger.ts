/**
 * Profile Debug & Cleanup Utility
 * 
 * Add this temporarily to help debug profile issues.
 * Shows detailed info about profile state.
 */

import { useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { supabase } from '../services/supabase-client';

export function ProfileDebugger() {
  const { profile, loading, error } = useProfile();

  useEffect(() => {
    console.log('=== PROFILE DEBUGGER ===');
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('Profile:', profile);
    
    // Check localStorage
    const localProfile = localStorage.getItem('kaal_user_profile');
    const localImage = localStorage.getItem('profileImage');
    
    if (localProfile) {
      console.warn('⚠️ OLD LOCALSTORAGE DATA FOUND:', localProfile);
      console.log('Run this to clear: localStorage.removeItem("kaal_user_profile")');
    }
    
    if (localImage) {
      console.warn('⚠️ OLD IMAGE DATA FOUND');
      console.log('Run this to clear: localStorage.removeItem("profileImage")');
    }
    
    if (!localProfile && !localImage) {
      console.log('✅ No old localStorage data');
    }
    
    // Check auth
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        console.log('✅ Authenticated as:', user.email);
        console.log('   User ID:', user.id);
        
        // Check database
        supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('❌ Database error:', error);
            } else {
              console.log('✅ Database profile:', data);
            }
          });
      } else {
        console.log('❌ Not authenticated');
      }
    });
    
    console.log('========================');
  }, [profile, loading, error]);

  // Return null - this is just for debugging
  return null;
}

// Cleanup function you can call manually
export function cleanupOldProfileData() {
  console.log('🧹 Cleaning up old profile data...');
  
  const items = [
    'kaal_user_profile',
    'profileImage',
    'profile',
    'user_profile'
  ];
  
  items.forEach(item => {
    if (localStorage.getItem(item)) {
      localStorage.removeItem(item);
      console.log(`   ✅ Removed ${item}`);
    }
  });
  
  console.log('✅ Cleanup complete!');
  console.log('Please refresh the page.');
}

// Export for easy console access
if (typeof window !== 'undefined') {
  (window as any).cleanupProfileData = cleanupOldProfileData;
  console.log('💡 Tip: Run cleanupProfileData() in console to clear old data');
}
