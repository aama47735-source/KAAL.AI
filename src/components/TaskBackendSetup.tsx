import { CheckCircle, Database, Zap, Code, FileText, AlertCircle } from 'lucide-react';

export function TaskBackendSetup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Database className="w-12 h-12" />
              <div>
                <h1 className="text-3xl font-bold mb-2">Task Management Backend</h1>
                <p className="text-indigo-100">Complete Supabase integration with real-time sync</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-6 p-6 border-b border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">4</div>
              <div className="text-sm text-gray-600 mt-1">Database Tables</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">16</div>
              <div className="text-sm text-gray-600 mt-1">RLS Policies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">✓</div>
              <div className="text-sm text-gray-600 mt-1">Real-time Sync</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-600 mt-1">React Hooks</div>
            </div>
          </div>

          {/* Features */}
          <div className="p-6">
            <h3 className="font-bold text-lg mb-4">✨ Features Included</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Full CRUD operations',
                'Real-time sync across devices',
                'Task history & audit log',
                'Project organization',
                'Task comments',
                'Advanced filtering',
                'Recurring tasks support',
                'Row-level security',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Setup Steps */}
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Run SQL Schema</h3>
                  <p className="text-sm text-gray-600">Create database tables in Supabase</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ol className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">Open Supabase Dashboard</p>
                    <p className="text-gray-600">Go to your project at supabase.com/dashboard</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">Open SQL Editor</p>
                    <p className="text-gray-600">Click "SQL Editor" → "New Query"</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">Copy & Run Schema</p>
                    <p className="text-gray-600 mb-2">Copy contents of <code className="bg-gray-100 px-1 rounded">/supabase/schema.sql</code></p>
                    <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs">
                      -- Open /supabase/schema.sql<br />
                      -- Copy all contents<br />
                      -- Paste into SQL Editor<br />
                      -- Click "Run" or press Cmd+Enter
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    ✓
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">Verify Success</p>
                    <p className="text-gray-600">Should see "Success. No rows returned"</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="bg-purple-50 border-b border-purple-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Verify Tables Created</h3>
                  <p className="text-sm text-gray-600">Check that all tables exist</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 mb-4">Go to <strong>Table Editor</strong> and verify these tables exist:</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'tasks', desc: 'Main task storage' },
                  { name: 'projects', desc: 'Project organization' },
                  { name: 'task_comments', desc: 'Task notes & comments' },
                  { name: 'task_history', desc: 'Automatic audit log' },
                ].map((table, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Database className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono text-sm font-medium text-gray-900">{table.name}</p>
                      <p className="text-xs text-gray-600">{table.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="bg-green-50 border-b border-green-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Use in Your App</h3>
                  <p className="text-sm text-gray-600">Start building with React hooks</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-green-600" />
                  <h4 className="font-bold text-gray-900">Quick Start with Hooks</h4>
                </div>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{`import { useTasks } from '../hooks/useTasks';

function TaskList() {
  const { tasks, create, toggleComplete } = useTasks({
    realtime: true, // Enable real-time sync
    status: 'todo',
  });

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <button onClick={() => toggleComplete(task.id)}>
            {task.status === 'completed' ? 'Undo' : 'Complete'}
          </button>
        </div>
      ))}
    </div>
  );
}`}</pre>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-5 h-5 text-green-600" />
                  <h4 className="font-bold text-gray-900">Available Hooks</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="font-mono text-sm font-medium text-green-900">useTasks()</p>
                    <p className="text-xs text-green-700 mt-1">Manage tasks with filters</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="font-mono text-sm font-medium text-green-900">useProjects()</p>
                    <p className="text-xs text-green-700 mt-1">Manage projects</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="font-mono text-sm font-medium text-green-900">useTask(id)</p>
                    <p className="text-xs text-green-700 mt-1">Get single task</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="font-mono text-sm font-medium text-green-900">task-service</p>
                    <p className="text-xs text-green-700 mt-1">Direct API access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documentation */}
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="bg-orange-50 border-b border-orange-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-orange-600" />
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Full Documentation</h3>
                  <p className="text-sm text-gray-600">Complete reference guide</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 mb-4">
                For detailed documentation, API reference, and examples, check:
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="font-mono text-sm text-orange-900 font-medium">
                  📄 /docs/TASK_MANAGEMENT_SETUP.md
                </p>
                <p className="text-xs text-orange-700 mt-2">
                  Includes: Hook API reference, advanced features, troubleshooting, and more
                </p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-bold text-amber-900">Important Notes</h4>
                <ul className="text-sm text-amber-800 space-y-1 ml-4 list-disc">
                  <li>Row Level Security (RLS) is automatically enabled - users only see their own data</li>
                  <li>Task history is logged automatically via database triggers</li>
                  <li>Real-time sync works across tabs and devices</li>
                  <li>All timestamps are stored in UTC and converted to local time in UI</li>
                  <li>The schema uses snake_case in DB, but hooks return camelCase objects</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="font-bold text-xl mb-4">🎉 What's Next?</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <h4 className="font-bold mb-2">Update TasksScreen</h4>
                <p className="text-sm text-indigo-100">Replace localStorage with useTasks() hook</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <h4 className="font-bold mb-2">Add Projects UI</h4>
                <p className="text-sm text-indigo-100">Create project management interface</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <h4 className="font-bold mb-2">Build Analytics</h4>
                <p className="text-sm text-indigo-100">Query task completion metrics</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <h4 className="font-bold mb-2">Add Notifications</h4>
                <p className="text-sm text-indigo-100">Notify users of due dates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
