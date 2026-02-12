import { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Database } from 'lucide-react';
import { supabase } from '../services/supabase-client';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

/**
 * ProfileSyncDebug Component
 * 
 * A diagnostic and repair tool for profile synchronization issues.
 * Shows auth data vs profile data and provides sync/repair options.
 */

interface DiagnosticData {
  authUser: any;
  profileData: any;
  issues: string[];
}

export function ProfileSyncDebug() {
  const { user } = useAuth();
  const { profile, loading: profileLoading, refreshProfile } = useProfile();
  const [diagnostics, setDiagnostics] = useState<DiagnosticData | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const runDiagnostics = async () => {
    if (!user) {
      toast.error('Not logged in');
      return;
    }

    setIsRunning(true);
    try {
      // Get auth user data
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      // Get profile data
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const issues: string[] = [];

      // Check for issues
      if (profileError) {
        issues.push(`Profile fetch error: ${profileError.message}`);
      }

      if (!profileData) {
        issues.push('Profile does not exist in database');
      } else {
        // Check for data mismatches
        const authFullName = authUser?.user_metadata?.full_name || 
                            authUser?.user_metadata?.name || 
                            authUser?.email?.split('@')[0];
        const authAvatar = authUser?.user_metadata?.avatar_url || 
                          authUser?.user_metadata?.picture;

        if (profileData.full_name === 'User' && authFullName && authFullName !== 'User') {
          issues.push(`Profile name is default "User" but auth has "${authFullName}"`);
        }

        if (!profileData.profile_image_url && authAvatar) {
          issues.push(`Profile missing avatar but auth has one`);
        }

        if (profileData.email !== authUser?.email) {
          issues.push(`Email mismatch: Profile has "${profileData.email}", Auth has "${authUser?.email}"`);
        }
      }

      setDiagnostics({
        authUser: authUser?.user_metadata || {},
        profileData: profileData || null,
        issues
      });

      if (issues.length === 0) {
        toast.success('No issues found!');
      } else {
        toast.warning(`Found ${issues.length} issue(s)`);
      }
    } catch (error: any) {
      console.error('Diagnostics error:', error);
      toast.error('Failed to run diagnostics', {
        description: error.message
      });
    } finally {
      setIsRunning(false);
    }
  };

  const syncProfile = async () => {
    if (!user) {
      toast.error('Not logged in');
      return;
    }

    setIsSyncing(true);
    try {
      // Get auth user data
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        throw new Error('Could not fetch auth user');
      }

      // Extract data from auth metadata
      const fullName = authUser.user_metadata?.full_name || 
                      authUser.user_metadata?.name || 
                      authUser.user_metadata?.display_name ||
                      authUser.email?.split('@')[0] || 
                      'User';
      
      const profileImageUrl = authUser.user_metadata?.avatar_url || 
                              authUser.user_metadata?.picture || 
                              '';

      console.log('🔄 Syncing profile with auth data:', { fullName, profileImageUrl });

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            full_name: fullName,
            profile_image_url: profileImageUrl,
            email: authUser.email || ''
          })
          .eq('user_id', user.id);

        if (updateError) throw updateError;
        toast.success('Profile synced successfully!');
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            email: authUser.email || '',
            full_name: fullName,
            profile_image_url: profileImageUrl
          });

        if (insertError) throw insertError;
        toast.success('Profile created and synced!');
      }

      // Refresh profile data
      await refreshProfile?.();
      
      // Re-run diagnostics
      await runDiagnostics();
    } catch (error: any) {
      console.error('Sync error:', error);
      toast.error('Failed to sync profile', {
        description: error.message
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Profile Sync Diagnostics</h2>
        <p className="text-sm text-gray-600 mt-1">
          Check and repair profile synchronization issues
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={runDiagnostics}
          disabled={isRunning || !user}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Database className="w-4 h-4" />
          {isRunning ? 'Running...' : 'Run Diagnostics'}
        </button>

        {diagnostics && diagnostics.issues.length > 0 && (
          <button
            onClick={syncProfile}
            disabled={isSyncing || !user}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync from Auth'}
          </button>
        )}
      </div>

      {/* Current Profile State */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-medium text-gray-900 mb-3">Current Profile State</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Full Name:</span>
            <p className="font-medium text-gray-900">{profile?.fullName || '(empty)'}</p>
          </div>
          <div>
            <span className="text-gray-600">Email:</span>
            <p className="font-medium text-gray-900">{profile?.email || '(empty)'}</p>
          </div>
          <div>
            <span className="text-gray-600">Profile Image:</span>
            <p className="font-medium text-gray-900 truncate">
              {profile?.profileImage ? 'Set' : '(empty)'}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Loading:</span>
            <p className="font-medium text-gray-900">{profileLoading ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      {/* Diagnostics Results */}
      {diagnostics && (
        <div className="space-y-4">
          {/* Issues */}
          {diagnostics.issues.length > 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-yellow-900 mb-2">Issues Found</h4>
                  <ul className="space-y-1 text-sm text-yellow-800">
                    {diagnostics.issues.map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-yellow-600">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="font-medium text-green-900">All checks passed!</p>
              </div>
            </div>
          )}

          {/* Auth User Data */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Auth Metadata</h4>
            <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-auto">
              {JSON.stringify(diagnostics.authUser, null, 2)}
            </pre>
          </div>

          {/* Profile Data */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Profile Database Data</h4>
            <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-auto">
              {JSON.stringify(diagnostics.profileData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
