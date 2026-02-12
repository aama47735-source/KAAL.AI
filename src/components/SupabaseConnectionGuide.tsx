import React from 'react';
import { AlertCircle, Database, Key, CheckCircle } from 'lucide-react';

/**
 * Supabase Connection Guide
 * Shows when Supabase is not properly configured
 */

interface SupabaseConnectionGuideProps {
  error?: string;
  onDismiss?: () => void;
}

export function SupabaseConnectionGuide({ error, onDismiss }: SupabaseConnectionGuideProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="glass-panel max-w-2xl w-full p-8 animate-fadeInUp">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
              Supabase Setup Required
            </h2>
            <p className="text-gray-600">
              KAAL requires a Supabase backend to work properly. Follow these steps to get started.
            </p>
          </div>
        </div>

        {/* Error Message (if any) */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200 font-mono">
              {error}
            </p>
          </div>
        )}

        {/* Setup Steps */}
        <div className="space-y-6 mb-8">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">1</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Create a Supabase Project
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">supabase.com</a> and create a new project.
              </p>
              <p className="text-gray-500 text-xs">
                It's free to get started and takes about 2 minutes.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">2</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Key className="w-4 h-4" />
                Get Your API Keys
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                In your Supabase project, go to <strong>Settings → API</strong> and copy:
              </p>
              <ul className="text-gray-500 text-xs space-y-1 ml-4 list-disc">
                <li>Project URL (looks like: https://xxx.supabase.co)</li>
                <li>Anon/Public Key (starts with: eyJ...)</li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">3</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Connect to KAAL
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                In Figma Make, use the <strong>Supabase Connect</strong> tool to add your credentials.
              </p>
              <p className="text-gray-500 text-xs">
                Your keys are stored securely and never shared.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors text-center"
          >
            Create Supabase Project
          </a>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Continue Anyway
            </button>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            📖 For detailed instructions, see <strong>ADD-YOUR-API-KEY.md</strong> in the project root
          </p>
        </div>
      </div>
    </div>
  );
}
