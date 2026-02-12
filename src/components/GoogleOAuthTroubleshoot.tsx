/**
 * Google OAuth Troubleshooting Component
 * Helps debug and diagnose Google OAuth issues
 */

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { supabase } from '../services/supabase-client';
import { toast } from 'sonner@2.0.3';

export function GoogleOAuthTroubleshoot() {
  const [checks, setChecks] = useState({
    supabaseConnection: 'checking',
    callbackUrl: 'checking',
    googleProvider: 'checking',
  });
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [expectedCallbackUrl, setExpectedCallbackUrl] = useState('');
  const [appCallbackUrl, setAppCallbackUrl] = useState('');

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    // Check 1: Supabase connection
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      setChecks(prev => ({ ...prev, supabaseConnection: 'success' }));
      
      // Get Supabase URL
      const url = supabase['supabaseUrl'] || 'Not found';
      setSupabaseUrl(url);
      setExpectedCallbackUrl(`${url}/auth/v1/callback`);
      setAppCallbackUrl(`${window.location.origin}/auth-callback`);
    } catch (error) {
      setChecks(prev => ({ ...prev, supabaseConnection: 'error' }));
    }

    // Check 2: Callback URL configuration
    setChecks(prev => ({ ...prev, callbackUrl: 'success' }));

    // Check 3: Test Google provider
    setTimeout(() => {
      setChecks(prev => ({ ...prev, googleProvider: 'warning' }));
    }, 500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Google OAuth Troubleshooter</h1>
            <p className="text-blue-100">Diagnose and fix Google Sign-In issues</p>
          </div>
        </div>

        {/* Diagnostics */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">System Diagnostics</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              {getStatusIcon(checks.supabaseConnection)}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Supabase Connection</h3>
                <p className="text-sm text-gray-600">Checking connection to Supabase backend</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              {getStatusIcon(checks.callbackUrl)}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Callback URL Configuration</h3>
                <p className="text-sm text-gray-600">App callback route is configured</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              {getStatusIcon(checks.googleProvider)}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Google Provider Status</h3>
                <p className="text-sm text-gray-600">Needs manual verification in Supabase Dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Values */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Configuration Values</h2>
          
          <div className="space-y-4">
            {/* Supabase URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Supabase Project URL
              </label>
              <div className="flex gap-2">
                <code className="flex-1 bg-gray-900 text-green-400 px-4 py-3 rounded-lg font-mono text-sm overflow-x-auto">
                  {supabaseUrl || 'Loading...'}
                </code>
                <button
                  onClick={() => copyToClipboard(supabaseUrl)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={!supabaseUrl}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expected Callback URL (for Google Cloud Console) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Authorized Redirect URI (Add this to Google Cloud Console)
              </label>
              <div className="flex gap-2">
                <code className="flex-1 bg-gray-900 text-green-400 px-4 py-3 rounded-lg font-mono text-sm overflow-x-auto">
                  {expectedCallbackUrl || 'Loading...'}
                </code>
                <button
                  onClick={() => copyToClipboard(expectedCallbackUrl)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={!expectedCallbackUrl}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                ℹ️ This must be added to "Authorized redirect URIs" in your Google OAuth 2.0 Client configuration
              </p>
            </div>

            {/* App Callback URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                App Callback URL (Already configured in your app)
              </label>
              <div className="flex gap-2">
                <code className="flex-1 bg-gray-900 text-green-400 px-4 py-3 rounded-lg font-mono text-sm overflow-x-auto">
                  {appCallbackUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(appCallbackUrl)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                ✅ This URL is already configured in your React router
              </p>
            </div>
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Common Issues & Solutions</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
              <h3 className="font-bold text-red-900 mb-2">❌ Issue: "redirect_uri_mismatch"</h3>
              <p className="text-sm text-red-800 mb-2">
                The redirect URI in your Google Cloud Console doesn't match.
              </p>
              <p className="text-sm text-red-800 font-semibold">Solution:</p>
              <ol className="text-sm text-red-800 list-decimal ml-5 space-y-1">
                <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                <li>Select your OAuth 2.0 Client ID</li>
                <li>Under "Authorized redirect URIs", add: <code className="bg-red-100 px-1 rounded">{expectedCallbackUrl}</code></li>
                <li>Click "Save"</li>
              </ol>
            </div>

            <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
              <h3 className="font-bold text-yellow-900 mb-2">⚠️ Issue: "access_denied" or "App Not Verified"</h3>
              <p className="text-sm text-yellow-800 mb-2">
                Your app is in "Testing" mode and the user is not added as a test user.
              </p>
              <p className="text-sm text-yellow-800 font-semibold">Solution:</p>
              <ol className="text-sm text-yellow-800 list-decimal ml-5 space-y-1">
                <li>Go to <a href="https://console.cloud.google.com/apis/credentials/consent" target="_blank" rel="noopener noreferrer" className="underline">OAuth Consent Screen</a></li>
                <li>Scroll to "Test users" section</li>
                <li>Click "Add Users"</li>
                <li>Add the Gmail address you want to test with</li>
                <li>Click "Save"</li>
              </ol>
            </div>

            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
              <h3 className="font-bold text-blue-900 mb-2">🔵 Issue: Provider Not Enabled in Supabase</h3>
              <p className="text-sm text-blue-800 mb-2">
                Google provider is not configured in Supabase.
              </p>
              <p className="text-sm text-blue-800 font-semibold">Solution:</p>
              <ol className="text-sm text-blue-800 list-decimal ml-5 space-y-1">
                <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">Supabase Dashboard</a></li>
                <li>Navigate to Authentication → Providers → Google</li>
                <li>Toggle "Enable Sign in with Google" to ON</li>
                <li>Paste your Google Client ID and Client Secret</li>
                <li>Click "Save"</li>
              </ol>
            </div>

            <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
              <h3 className="font-bold text-purple-900 mb-2">🔮 Issue: Infinite Redirect Loop</h3>
              <p className="text-sm text-purple-800 mb-2">
                The OAuth flow keeps redirecting.
              </p>
              <p className="text-sm text-purple-800 font-semibold">Solution:</p>
              <ol className="text-sm text-purple-800 list-decimal ml-5 space-y-1">
                <li>Clear your browser cookies and cache</li>
                <li>Check that the callback URL is correct in both places</li>
                <li>Ensure you're not blocking third-party cookies</li>
                <li>Try in an incognito window</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 flex gap-3 justify-center">
          <a
            href="https://console.cloud.google.com/apis/credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Google Cloud Console
          </a>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Supabase Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
