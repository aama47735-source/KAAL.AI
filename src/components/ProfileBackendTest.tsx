import { useUserProfile } from '../hooks/useProfile';
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';

/**
 * Profile Backend Test Component
 * 
 * Use this to verify your Supabase profile backend is working correctly.
 * Navigate to /profile-test to see this component.
 */
export function ProfileBackendTest() {
  const { profile, loading, error, updateProfile, refreshProfile } = useUserProfile();
  const [testBio, setTestBio] = useState('');

  const testUpdate = async () => {
    await updateProfile({
      bio: `Profile updated at ${new Date().toLocaleTimeString()}`,
    });
  };

  const testCustomBio = async () => {
    if (!testBio.trim()) return;
    await updateProfile({
      bio: testBio,
    });
    setTestBio('');
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div 
          className="p-8 rounded-3xl border"
          style={{
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(24px) saturate(180%)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)'
          }}
        >
          <h1 
            className="text-3xl italic font-medium mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: '#111827' }}
          >
            Profile Backend Test
          </h1>
          <p style={{ color: '#6B7280' }}>
            Testing Supabase integration for user profiles
          </p>
        </div>

        {/* Status Card */}
        <div 
          className="p-8 rounded-3xl border"
          style={{
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(24px) saturate(180%)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)'
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#111827' }}>
            Connection Status
          </h2>

          <div className="space-y-3">
            {/* Loading Status */}
            <div className="flex items-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  <span style={{ color: '#6B7280' }}>Loading profile...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span style={{ color: '#111827' }}>Profile loaded</span>
                </>
              )}
            </div>

            {/* Error Status */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Profile Data Status */}
            {profile && (
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span style={{ color: '#111827' }}>
                  Connected as: <strong>{profile.fullName}</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Data Display */}
        {profile && (
          <div 
            className="p-8 rounded-3xl border"
            style={{
              background: 'rgba(255, 255, 255, 0.55)',
              backdropFilter: 'blur(24px) saturate(180%)',
              borderColor: 'rgba(255, 255, 255, 0.4)',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)'
            }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#111827' }}>
              Profile Data
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold" style={{ color: '#6B7280' }}>Full Name:</span>
                <p style={{ color: '#111827' }}>{profile.fullName}</p>
              </div>

              <div>
                <span className="font-semibold" style={{ color: '#6B7280' }}>Professional Title:</span>
                <p style={{ color: '#111827' }}>{profile.professionalTitle || 'Not set'}</p>
              </div>

              <div>
                <span className="font-semibold" style={{ color: '#6B7280' }}>Email:</span>
                <p style={{ color: '#111827' }}>{profile.email}</p>
              </div>

              <div>
                <span className="font-semibold" style={{ color: '#6B7280' }}>Pronouns:</span>
                <p style={{ color: '#111827' }}>{profile.pronouns || 'Not set'}</p>
              </div>

              <div className="md:col-span-2">
                <span className="font-semibold" style={{ color: '#6B7280' }}>Bio:</span>
                <p style={{ color: '#111827' }}>{profile.bio || 'No bio set'}</p>
              </div>

              <div>
                <span className="font-semibold" style={{ color: '#6B7280' }}>Skills:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs rounded-lg"
                        style={{ backgroundColor: '#111827', color: 'white' }}
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#6B7280' }}>No skills added</span>
                  )}
                </div>
              </div>

              <div>
                <span className="font-semibold" style={{ color: '#6B7280' }}>Interests:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.interests && profile.interests.length > 0 ? (
                    profile.interests.map((interest, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs rounded-lg border"
                        style={{ borderColor: '#111827', color: '#111827' }}
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#6B7280' }}>No interests added</span>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-3 gap-4">
                <div>
                  <span className="font-semibold" style={{ color: '#6B7280' }}>Deep Work Mode:</span>
                  <p style={{ color: '#111827' }}>{profile.deepWorkMode ? '✅ On' : '❌ Off'}</p>
                </div>
                <div>
                  <span className="font-semibold" style={{ color: '#6B7280' }}>Quiet Mode:</span>
                  <p style={{ color: '#111827' }}>{profile.quietMode ? '✅ On' : '❌ Off'}</p>
                </div>
                <div>
                  <span className="font-semibold" style={{ color: '#6B7280' }}>Weekly Digest:</span>
                  <p style={{ color: '#111827' }}>{profile.weeklyDigest ? '✅ On' : '❌ Off'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div 
          className="p-8 rounded-3xl border"
          style={{
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(24px) saturate(180%)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)'
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#111827' }}>
            Test Actions
          </h2>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={testUpdate}
              disabled={loading || !profile}
              className="px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#111827',
                color: 'white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              Test Update Bio
            </button>

            <button
              onClick={() => refreshProfile()}
              disabled={loading}
              className="px-6 py-3 rounded-xl font-medium transition-all border disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{
                borderColor: '#E5E7EB',
                color: '#111827'
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Profile
            </button>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={testBio}
                onChange={(e) => setTestBio(e.target.value)}
                placeholder="Enter custom bio"
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={testCustomBio}
                disabled={loading || !profile}
                className="px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#111827',
                  color: 'white',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                Update Custom Bio
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div 
          className="p-8 rounded-3xl border"
          style={{
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(24px) saturate(180%)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)'
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#111827' }}>
            Migration Status
          </h2>

          <div className="space-y-3 text-sm" style={{ color: '#6B7280' }}>
            <p>✅ <strong>Migration file created:</strong> /supabase/migrations/003_create_user_profiles.sql</p>
            <p>✅ <strong>React hook created:</strong> /hooks/useProfile.ts</p>
            <p>✅ <strong>ProfileContext updated:</strong> Now uses Supabase</p>
            <p>✅ <strong>ProfileEditModal updated:</strong> Async save implemented</p>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="font-semibold text-blue-900 mb-2">📋 Next Steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-800">
                <li>Go to Supabase Dashboard → SQL Editor</li>
                <li>Copy contents from /supabase/migrations/003_create_user_profiles.sql</li>
                <li>Paste and run in SQL Editor</li>
                <li>Refresh this page to test connection</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}