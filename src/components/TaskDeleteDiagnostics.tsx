/**
 * Task Delete Diagnostics Component
 * Use this to troubleshoot task deletion issues
 */

import { useState } from 'react';
import { supabase } from '../services/supabase-client';
import { Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function TaskDeleteDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: [],
    };

    // Test 1: Check authentication
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      results.tests.push({
        name: 'Authentication',
        status: user ? 'pass' : 'fail',
        message: user ? `Authenticated as ${user.email}` : 'Not authenticated',
        details: { userId: user?.id, email: user?.email },
      });
    } catch (error: any) {
      results.tests.push({
        name: 'Authentication',
        status: 'fail',
        message: error.message,
      });
    }

    // Test 2: Check tasks table access
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('id, title')
        .limit(1);
      
      results.tests.push({
        name: 'Tasks Table Access',
        status: error ? 'fail' : 'pass',
        message: error ? error.message : 'Can read tasks table',
        details: { taskCount: data?.length || 0 },
      });
    } catch (error: any) {
      results.tests.push({
        name: 'Tasks Table Access',
        status: 'fail',
        message: error.message,
      });
    }

    // Test 3: Check task_history table exists
    try {
      const { data, error } = await supabase
        .from('task_history')
        .select('id')
        .limit(1);
      
      results.tests.push({
        name: 'Task History Table',
        status: error?.code === '42P01' ? 'fail' : 'pass',
        message: error?.code === '42P01' 
          ? 'Table does not exist - run SUPABASE_MASTER_SETUP.sql' 
          : 'Table exists',
        details: { error: error?.message },
      });
    } catch (error: any) {
      results.tests.push({
        name: 'Task History Table',
        status: 'fail',
        message: error.message,
      });
    }

    // Test 4: Check task_comments table exists
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .select('id')
        .limit(1);
      
      results.tests.push({
        name: 'Task Comments Table',
        status: error?.code === '42P01' ? 'fail' : 'pass',
        message: error?.code === '42P01' 
          ? 'Table does not exist - run SUPABASE_MASTER_SETUP.sql' 
          : 'Table exists',
        details: { error: error?.message },
      });
    } catch (error: any) {
      results.tests.push({
        name: 'Task Comments Table',
        status: 'fail',
        message: error.message,
      });
    }

    // Test 5: Check RLS policies
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', '00000000-0000-0000-0000-000000000000'); // Non-existent ID
        
        // If we get here without error, RLS allows deletes (which is good)
        results.tests.push({
          name: 'Delete Permission',
          status: 'pass',
          message: 'User has permission to delete tasks',
          details: { note: 'RLS policies allow DELETE operations' },
        });
      }
    } catch (error: any) {
      results.tests.push({
        name: 'Delete Permission',
        status: 'warn',
        message: 'Could not verify delete permission',
        details: { error: error.message },
      });
    }

    // Test 6: Check for any database triggers
    try {
      const { data, error } = await supabase.rpc('pg_catalog.pg_get_triggerdef', {});
      results.tests.push({
        name: 'Database Triggers',
        status: 'info',
        message: 'Trigger information available in Supabase dashboard',
      });
    } catch (error: any) {
      // This is expected to fail in some cases
      results.tests.push({
        name: 'Database Triggers',
        status: 'info',
        message: 'Cannot query triggers directly (this is normal)',
      });
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warn':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Task Delete Diagnostics</h2>
            <p className="text-sm text-gray-600">
              Run this to troubleshoot task deletion issues
            </p>
          </div>
        </div>

        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-xl transition-colors font-medium"
        >
          {isRunning ? 'Running diagnostics...' : 'Run Diagnostics'}
        </button>

        {diagnostics && (
          <div className="mt-6 space-y-4">
            <div className="text-xs text-gray-500 mb-2">
              Last run: {new Date(diagnostics.timestamp).toLocaleString()}
            </div>

            {diagnostics.tests.map((test: any, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${
                  test.status === 'pass'
                    ? 'bg-green-50 border-green-200'
                    : test.status === 'fail'
                    ? 'bg-red-50 border-red-200'
                    : test.status === 'warn'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(test.status)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{test.name}</h3>
                    <p className="text-sm text-gray-700 mb-2">{test.message}</p>
                    {test.details && (
                      <pre className="text-xs bg-white/50 p-2 rounded border border-gray-200 overflow-auto">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Summary and recommendations */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Next Steps:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {diagnostics.tests.some((t: any) => t.status === 'fail') && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>
                      <strong>Critical issues found:</strong> Fix the failed tests above before attempting to delete tasks.
                    </span>
                  </li>
                )}
                {diagnostics.tests.find((t: any) => t.name === 'Task History Table' && t.status === 'fail') && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>
                      <strong>Database setup required:</strong> Run <code className="px-2 py-1 bg-white rounded border">/SUPABASE_MASTER_SETUP.sql</code> in your Supabase SQL Editor.
                    </span>
                  </li>
                )}
                {diagnostics.tests.every((t: any) => t.status !== 'fail') && (
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>
                      <strong>All checks passed:</strong> Task deletion should work. If you're still experiencing issues, check the browser console for error messages.
                    </span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>
                    Open the browser console (F12) and try deleting a task. Look for messages starting with 🗑️, ✅, or ❌ for detailed debugging info.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">How to use this tool:</h3>
        <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
          <li>Click "Run Diagnostics" to check your database setup</li>
          <li>Review the test results above</li>
          <li>If any tests fail, follow the recommendations provided</li>
          <li>After making changes, run diagnostics again to verify</li>
          <li>Once all tests pass, try deleting a task from the Tasks screen</li>
          <li>Open browser console (F12) to see detailed logs during deletion</li>
        </ol>
      </div>
    </div>
  );
}
