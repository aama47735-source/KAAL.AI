import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Circle, Trash2, Edit2, Plus, Zap, Database, Loader2, AlertCircle } from 'lucide-react';
import { Task } from '../services/task-service';

export function TaskBackendTest() {
  const { user } = useAuth();
  const { tasks, isLoading, error, create, update, remove, toggleComplete, refresh } = useTasks({
    realtime: true, // Enable real-time sync!
  });
  const { projects } = useProjects({ realtime: true });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | Task['status']>('all');

  // Filter tasks by status
  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filterStatus);

  // Task counts
  const counts = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    await create({
      title: newTaskTitle,
      status: 'todo',
      priority: newTaskPriority,
      projectId: selectedProject || undefined,
    });

    setNewTaskTitle('');
    setSelectedProject('');
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await remove(taskId);
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🧪 Task Backend Test</h1>
              <p className="text-gray-600">Testing Supabase integration with real-time sync</p>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Logged in as</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              )}
              <button
                onClick={refresh}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="text-2xl font-bold text-purple-900">{counts.total}</div>
              <div className="text-sm text-purple-700">Total Tasks</div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{counts.todo}</div>
              <div className="text-sm text-gray-700">To Do</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-900">{counts.inProgress}</div>
              <div className="text-sm text-blue-700">In Progress</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="text-2xl font-bold text-green-900">{counts.completed}</div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
          </div>
        </div>

        {/* Real-time Indicator */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-4 flex items-center gap-3">
          <Zap className="w-5 h-5 animate-pulse" />
          <div>
            <p className="font-bold">Real-time Sync Active</p>
            <p className="text-sm text-green-100">Changes will appear instantly across all devices and tabs</p>
          </div>
        </div>

        {/* Create Task */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Task
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
              placeholder="Task title..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as Task['priority'])}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">No Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.icon} {project.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleCreateTask}
              disabled={!newTaskTitle.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {[
            { label: 'All', value: 'all' as const },
            { label: 'To Do', value: 'todo' as const },
            { label: 'In Progress', value: 'in-progress' as const },
            { label: 'Completed', value: 'completed' as const },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === tab.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Tasks from Supabase
          </h2>

          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Error loading tasks</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {!isLoading && !error && filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <Circle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No tasks found. Create one above!</p>
            </div>
          )}

          {!isLoading && !error && filteredTasks.length > 0 && (
            <div className="space-y-2">
              {filteredTasks.map(task => {
                const project = projects.find(p => p.id === task.projectId);
                
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className="flex-shrink-0"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                      )}
                    </button>

                    {/* Task Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {project && (
                          <span 
                            className="text-xs px-2 py-1 rounded"
                            style={{ backgroundColor: project.color + '20', color: project.color }}
                          >
                            {project.icon} {project.name}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          const newStatus = task.status === 'todo' ? 'in-progress' : 'todo';
                          update(task.id, { status: newStatus });
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Change status"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📁 Projects</h2>
          <div className="grid grid-cols-3 gap-4">
            {projects.map(project => (
              <div
                key={project.id}
                className="p-4 rounded-lg border-2"
                style={{ borderColor: project.color, backgroundColor: project.color + '10' }}
              >
                <div className="text-2xl mb-2">{project.icon}</div>
                <p className="font-bold text-gray-900">{project.name}</p>
                <p className="text-sm text-gray-600">{project.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {tasks.filter(t => t.projectId === project.id).length} tasks
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Test Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-bold text-amber-900 mb-3">🧪 Test Real-time Sync</h3>
          <ol className="text-sm text-amber-800 space-y-2 ml-4 list-decimal">
            <li>Open this page in two browser tabs side-by-side</li>
            <li>Create a task in one tab</li>
            <li>Watch it appear instantly in the other tab! ⚡</li>
            <li>Toggle completion or delete - changes sync everywhere</li>
            <li>This works across devices too (as long as you're logged in)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
