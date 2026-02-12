/**
 * Data Cleanup Utility
 * Clears corrupted or invalid tasks from localStorage
 */

import { useState } from 'react';
import { Trash2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function DataCleanupUtility() {
  const [isClearing, setIsClearing] = useState(false);
  const [stats, setStats] = useState<{
    totalTasks: number;
    corruptedTasks: number;
    validTasks: number;
  } | null>(null);

  const analyzeData = () => {
    try {
      const tasksData = localStorage.getItem('kaal_tasks');
      if (!tasksData) {
        setStats({ totalTasks: 0, corruptedTasks: 0, validTasks: 0 });
        return;
      }

      const tasks = JSON.parse(tasksData);
      let corrupted = 0;
      let valid = 0;

      tasks.forEach((task: any) => {
        // Check if title or description contains gibberish
        const hasGibberishTitle = task.title && /[^a-zA-Z0-9\s\-_.,!?'"()]+/.test(task.title);
        const hasGibberishDesc = task.description && /[^a-zA-Z0-9\s\-_.,!?'"()]+/.test(task.description);
        const isTooShort = task.title && task.title.length < 2;
        const isTooLong = task.title && task.title.length > 200;

        if (hasGibberishTitle || hasGibberishDesc || isTooShort || isTooLong) {
          corrupted++;
        } else {
          valid++;
        }
      });

      setStats({
        totalTasks: tasks.length,
        corruptedTasks: corrupted,
        validTasks: valid
      });
    } catch (error) {
      toast.error('Failed to analyze data');
      console.error(error);
    }
  };

  const clearAllTasks = async () => {
    setIsClearing(true);
    try {
      // Clear all task-related data
      localStorage.removeItem('kaal_tasks');
      localStorage.removeItem('kaal_projects');
      
      toast.success('All task data cleared successfully!');
      
      // Re-analyze
      setTimeout(() => {
        analyzeData();
        setIsClearing(false);
      }, 500);
    } catch (error) {
      toast.error('Failed to clear data');
      console.error(error);
      setIsClearing(false);
    }
  };

  const clearCorruptedOnly = async () => {
    setIsClearing(true);
    try {
      const tasksData = localStorage.getItem('kaal_tasks');
      if (!tasksData) {
        toast.info('No tasks to clean');
        setIsClearing(false);
        return;
      }

      const tasks = JSON.parse(tasksData);
      const cleanedTasks = tasks.filter((task: any) => {
        const hasGibberishTitle = task.title && /[^a-zA-Z0-9\s\-_.,!?'"()]+/.test(task.title);
        const hasGibberishDesc = task.description && /[^a-zA-Z0-9\s\-_.,!?'"()]+/.test(task.description);
        const isTooShort = task.title && task.title.length < 2;
        const isTooLong = task.title && task.title.length > 200;

        // Keep task if it's NOT corrupted
        return !(hasGibberishTitle || hasGibberishDesc || isTooShort || isTooLong);
      });

      localStorage.setItem('kaal_tasks', JSON.stringify(cleanedTasks));
      
      toast.success(`Removed ${tasks.length - cleanedTasks.length} corrupted tasks!`);
      
      // Re-analyze
      setTimeout(() => {
        analyzeData();
        setIsClearing(false);
      }, 500);
    } catch (error) {
      toast.error('Failed to clean data');
      console.error(error);
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Data Cleanup Utility</h1>
            <p className="text-purple-100">Remove corrupted or invalid tasks from your workspace</p>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Data Analysis</h2>
          
          <button
            onClick={analyzeData}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-6"
          >
            <RefreshCw className="w-4 h-4" />
            Analyze Task Data
          </button>

          {stats && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{stats.totalTasks}</div>
                <div className="text-xs text-blue-800 font-medium">Total Tasks</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">{stats.corruptedTasks}</div>
                <div className="text-xs text-red-800 font-medium">Corrupted Tasks</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{stats.validTasks}</div>
                <div className="text-xs text-green-800 font-medium">Valid Tasks</div>
              </div>
            </div>
          )}
        </div>

        {/* Actions Section */}
        {stats && stats.corruptedTasks > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Cleanup Actions</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-bold text-yellow-900 mb-1">Corrupted Tasks Detected</h3>
                    <p className="text-sm text-yellow-800 mb-3">
                      Found {stats.corruptedTasks} corrupted task{stats.corruptedTasks !== 1 ? 's' : ''} with invalid data (gibberish text, invalid length, etc.)
                    </p>
                    <button
                      onClick={clearCorruptedOnly}
                      disabled={isClearing}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove Corrupted Tasks Only
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-bold text-red-900 mb-1">Clear All Tasks</h3>
                    <p className="text-sm text-red-800 mb-3">
                      Remove ALL tasks from localStorage and start fresh. This action cannot be undone.
                    </p>
                    <button
                      onClick={clearAllTasks}
                      disabled={isClearing}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All Task Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {stats && stats.corruptedTasks === 0 && stats.totalTasks > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex gap-3 items-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-bold text-green-900">All Tasks Are Valid!</h3>
                <p className="text-sm text-green-800">No corrupted tasks found in your workspace.</p>
              </div>
            </div>
          </div>
        )}

        {stats && stats.totalTasks === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex gap-3 items-center">
              <AlertCircle className="w-6 h-6 text-gray-400" />
              <div>
                <h3 className="font-bold text-gray-900">No Tasks Found</h3>
                <p className="text-sm text-gray-600">Your workspace is empty. Create some tasks to get started!</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-bold text-blue-900 mb-2">What counts as corrupted?</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc ml-5">
            <li>Tasks with gibberish or special characters in titles/descriptions</li>
            <li>Tasks with titles shorter than 2 characters</li>
            <li>Tasks with titles longer than 200 characters</li>
            <li>Tasks with invalid data structures</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
