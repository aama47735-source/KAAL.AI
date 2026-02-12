/**
 * Storage Service Debug Component
 * Shows if saveProfile method exists and is working
 */

import { useEffect, useState } from 'react';
import { storageService } from '../services/storage-service';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export function StorageServiceDebug() {
  const [status, setStatus] = useState<{
    saveProfileExists: boolean;
    getProfileExists: boolean;
    testPassed: boolean;
    error?: string;
  }>({
    saveProfileExists: false,
    getProfileExists: false,
    testPassed: false
  });

  useEffect(() => {
    try {
      // Check if methods exist
      const saveProfileExists = typeof storageService.saveProfile === 'function';
      const getProfileExists = typeof storageService.getProfile === 'function';

      // Try to use them
      let testPassed = false;
      try {
        const profile = storageService.getProfile();
        storageService.saveProfile(profile);
        testPassed = true;
      } catch (err) {
        setStatus({
          saveProfileExists,
          getProfileExists,
          testPassed: false,
          error: err instanceof Error ? err.message : String(err)
        });
        return;
      }

      setStatus({
        saveProfileExists,
        getProfileExists,
        testPassed
      });
    } catch (err) {
      setStatus({
        saveProfileExists: false,
        getProfileExists: false,
        testPassed: false,
        error: err instanceof Error ? err.message : String(err)
      });
    }
  }, []);

  return (
    <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">🔍 Storage Service Debug</h3>
      
      <div className="space-y-2">
        {/* saveProfile check */}
        <div className="flex items-center gap-2">
          {status.saveProfileExists ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
          <span className="text-xs text-gray-700">
            saveProfile: {status.saveProfileExists ? 'EXISTS' : 'MISSING'}
          </span>
        </div>

        {/* getProfile check */}
        <div className="flex items-center gap-2">
          {status.getProfileExists ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
          <span className="text-xs text-gray-700">
            getProfile: {status.getProfileExists ? 'EXISTS' : 'MISSING'}
          </span>
        </div>

        {/* Test passed */}
        <div className="flex items-center gap-2">
          {status.testPassed ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
          <span className="text-xs text-gray-700">
            Test: {status.testPassed ? 'PASSED' : 'FAILED'}
          </span>
        </div>

        {/* Error message */}
        {status.error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-800">{status.error}</p>
            </div>
          </div>
        )}

        {/* Fix instructions */}
        {!status.testPassed && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
            <p className="text-xs text-blue-800 font-medium mb-1">Fix:</p>
            <p className="text-xs text-blue-700">
              Press <kbd className="px-1 py-0.5 bg-white border border-blue-300 rounded text-xs font-mono">Ctrl+Shift+R</kbd> to hard refresh
            </p>
          </div>
        )}

        {/* Success message */}
        {status.testPassed && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
            <p className="text-xs text-green-800">
              ✅ All methods working correctly!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
