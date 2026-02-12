import { useState } from "react";
import { Search, Filter, Plus, Trash2, Clock, Edit2, GripVertical, Paperclip, MessageCircle } from "lucide-react";
import { TaskCreationModal } from "./TaskCreationModal";
import { TaskEditModal } from "./TaskEditModal";
import { useTasks } from "../hooks/useTasks";
import { useProjects } from "../hooks/useProjects";
import { Task } from "../services/task-service";
import { useSettings } from "../context/SettingsContext";
import { toast } from "sonner@2.0.3";

/**
 * TasksScreen - Main task management interface
 * Uses Supabase backend with useTasks hook (NOT storageService)
 */
export function TasksScreen() {
  const { settings, updateSettings } = useSettings();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Use Supabase backend with real-time sync  
  const { tasks, isLoading, toggleComplete, remove } = useTasks({
    realtime: true,
  });

  const { projects } = useProjects({ realtime: true });

  const handleDeepWorkToggle = () => {
    updateSettings({ deepWorkMode: !settings.deepWorkMode });
    toast.success(settings.deepWorkMode ? 'Deep Work mode disabled' : 'Deep Work mode enabled');
  };

  const handleTaskCreated = () => {
    setIsCreateModalOpen(false);
  };

  const handleTaskUpdated = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    // Confirm deletion
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${taskTitle}"?\n\nThis action cannot be undone.`
    );
    
    if (!confirmDelete) {
      return;
    }

    console.log('🗑️ TasksScreen: Deleting task:', taskId, taskTitle);
    const success = await remove(taskId);
    
    if (success) {
      console.log('✅ TasksScreen: Task deleted successfully');
    } else {
      console.error('❌ TasksScreen: Delete failed');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleToggleTask = async (taskId: string) => {
    await toggleComplete(taskId);
  };

  // Filter tasks by search query
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = searchQuery 
      ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      : true;
    return matchesSearch;
  });

  // Organize tasks into columns
  const urgentTasks = filteredTasks.filter(t => 
    (t.priority === 'high' || t.priority === 'urgent') && 
    t.status !== 'completed' && 
    t.status !== 'archived'
  );
  
  const inFocusTasks = filteredTasks.filter(t => 
    t.status === 'in_progress' && 
    t.status !== 'archived'
  );

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth" style={{ backgroundColor: "#F8F9FA" }}>
      {/* Header */}
      <header 
        className="h-24 border-b flex items-center justify-between px-10 sticky top-0 z-20"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderColor: "rgba(255, 255, 255, 0.5)",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
        }}
      >
        <div className="flex flex-col">
          <h1 
            className="text-sm font-semibold tracking-wide uppercase"
            style={{ color: "#6B7280" }}
          >
            My Tasks
          </h1>
          <p 
            className="text-2xl italic"
            style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
          >
            Focus Mode
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-lg mx-10">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
            </div>
            <input 
              className="block w-full pl-11 pr-4 py-3 rounded-2xl text-sm border-0 focus:ring-0 transition-all duration-300 shadow-sm"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                color: "#111827"
              }}
              placeholder="Search tasks, tags, or projects..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                e.currentTarget.style.boxShadow = "0 0 0 2px rgba(17, 24, 39, 0.05)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.9)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
              }}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-[10px] font-bold border rounded px-1.5 py-0.5" style={{ color: "rgba(107, 114, 128, 0.4)", borderColor: "rgba(107, 114, 128, 0.2)" }}>
                ⌘K
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 mr-4">
            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: "#6B7280" }}>
              Deep Work
            </span>
            <label className="flex items-center cursor-pointer relative">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.deepWorkMode}
                onChange={handleDeepWorkToggle}
              />
              <div 
                className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900 shadow-inner"
              ></div>
              {settings.deepWorkMode && (
                <div className="absolute inset-0 rounded-full blur-md opacity-100 transition-opacity duration-500 animate-pulse" style={{ backgroundColor: "rgba(17, 24, 39, 0.2)" }}></div>
              )}
            </label>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-10 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 
              className="text-4xl font-medium tracking-tight leading-tight"
              style={{ 
                fontFamily: "'Playfair Display', serif", 
                color: "#111827",
                animation: "settle 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards"
              }}
            >
              Today's Agenda
            </h2>
            <p 
              className="text-sm mt-2 font-light tracking-wide max-w-lg opacity-0" 
              style={{ 
                color: "#6B7280",
                animation: "fadeInUp 0.8s ease-out 0.2s forwards"
              }}
            >
              Prioritize your flow. You have {urgentTasks.length} urgent items pending.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-sm flex items-center gap-2"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                color: "#6B7280"
              }}
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
              style={{
                backgroundColor: "#111827",
                color: "white"
              }}
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p style={{ color: "#6B7280" }}>Loading tasks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-8 pb-20">
            {/* Urgent Column */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
              <div className="flex items-center justify-between px-1 mb-2">
                <h3 
                  className="text-lg font-medium italic flex items-center gap-2"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                >
                  <span className="w-2 h-2 rounded-full bg-red-400" style={{ boxShadow: "0 0 8px rgba(248,113,113,0.6)" }}></span>
                  Urgent
                </h3>
                <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ color: "#6B7280", backgroundColor: "rgba(255, 255, 255, 0.5)" }}>
                  {urgentTasks.length}
                </span>
              </div>
              
              {urgentTasks.map((task) => (
                <UrgentTaskCard 
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  projects={projects}
                />
              ))}
              
              {urgentTasks.length === 0 && (
                <div className="text-center py-8 text-sm" style={{ color: "#6B7280" }}>
                  No urgent tasks
                </div>
              )}
            </div>

            {/* In Focus Column */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
              <div className="flex items-center justify-between px-1 mb-2">
                <h3 
                  className="text-lg font-medium italic flex items-center gap-2"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ boxShadow: "0 0 8px rgba(96,165,250,0.6)" }}></span>
                  In Focus
                </h3>
                <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ color: "#6B7280", backgroundColor: "rgba(255, 255, 255, 0.5)" }}>
                  {inFocusTasks.length}
                </span>
              </div>
              
              {inFocusTasks.slice(0, 1).map((task) => (
                <FeaturedTaskCard 
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  projects={projects}
                />
              ))}
              
              {inFocusTasks.slice(1).map((task) => (
                <InFocusTaskCard 
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  projects={projects}
                />
              ))}
              
              {inFocusTasks.length === 0 && (
                <div className="text-center py-12 text-sm" style={{ color: "#6B7280" }}>
                  No tasks in focus. Start one to begin!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      {isCreateModalOpen && (
        <TaskCreationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {/* Task Edit Modal */}
      {isEditModalOpen && editingTask && (
        <TaskEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onTaskUpdated={handleTaskUpdated}
          task={editingTask}
        />
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes settle {
          0% { opacity: 0; letter-spacing: 0.05em; }
          100% { opacity: 1; letter-spacing: 0; }
        }
        @keyframes checkmark {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// Urgent Task Card Component
interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  onEdit?: (task: Task) => void;
  projects: any[];
}

function UrgentTaskCard({ task, onToggle, onDelete, onEdit, projects }: TaskCardProps) {
  const project = projects.find(p => p.id === task.projectId);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  
  const getPriorityStyle = () => {
    return {
      bg: "rgba(254, 242, 242, 1)",
      text: "#DC2626",
      border: "#FECACA"
    };
  };

  const priorityStyle = getPriorityStyle();
  
  return (
    <div 
      className="group rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative"
      style={{
        background: "rgba(255, 255, 255, 0.55)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)"
      }}
    >
      {/* Refraction Border Effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-80 pointer-events-none"
        style={{
          padding: "1px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0.6))",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude"
        }}
      />

      <div className="flex items-center gap-5 relative z-10">
        {/* Checkbox */}
        <label className="relative flex items-center justify-center cursor-pointer group/checkbox">
          <input
            type="checkbox"
            checked={task.completed || false}
            onChange={() => onToggle(task.id)}
            className="sr-only peer"
          />
          <div 
            className="w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center peer-checked:bg-indigo-600 peer-checked:border-indigo-600 group-hover/checkbox:border-indigo-400"
            style={{
              borderColor: task.completed ? "#4F46E5" : "#D1D5DB",
              backgroundColor: task.completed ? "#4F46E5" : "white"
            }}
          >
            {task.completed && (
              <svg 
                className="w-4 h-4 text-white animate-[checkmark_0.3s_ease-out]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={3}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            )}
          </div>
        </label>

        <div className={`flex-1 transition-all duration-300 ${task.completed ? 'opacity-50' : 'opacity-100'}`}>
          <div className="flex justify-between items-start mb-1">
            <h3 
              className="font-semibold text-xl group-hover:text-blue-900 transition-colors"
              style={{ 
                fontFamily: "'Playfair Display', serif",
                color: "#111827"
              }}
            >
              {task.title}
            </h3>
            <span 
              className="px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wider"
              style={{
                backgroundColor: priorityStyle.bg,
                color: priorityStyle.text,
                borderColor: priorityStyle.border
              }}
            >
              {isOverdue ? "OVERDUE" : task.priority} Priority
            </span>
          </div>

          {task.description && (
            <p 
              className="text-sm font-light mb-4"
              style={{ color: "#6B7280" }}
            >
              {task.description}
            </p>
          )}

          <div 
            className="flex items-center gap-6 border-t pt-3"
            style={{ borderColor: "rgba(243, 244, 246, 0.5)" }}
          >
            {project && (
              <div 
                className="flex items-center gap-2 text-xs font-medium"
                style={{ color: "#6B7280" }}
              >
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: project.color || "#E5E7EB" }}
                />
                <span>{project.name}</span>
              </div>
            )}

            {task.estimatedMinutes && (
              <div 
                className="flex items-center gap-2 text-xs font-medium"
                style={{ color: "#6B7280" }}
              >
                <Clock className="w-[18px] h-[18px]" />
                <span>{task.estimatedMinutes}m</span>
              </div>
            )}

            <div className="flex-1"></div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id, task.title);
              }}
              className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {onEdit && (
              <button 
                className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-600"
                style={{ color: "#111827" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
              >
                Edit <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Featured Task Card (large In Focus card)
function FeaturedTaskCard({ task, onToggle, onDelete, onEdit, projects }: TaskCardProps) {
  const project = projects.find(p => p.id === task.projectId);
  
  return (
    <div 
      className="rounded-3xl p-8 relative overflow-hidden group"
      style={{
        background: "linear-gradient(160deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.4) 100%)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)"
      }}
    >
      <div 
        className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "rgba(96, 165, 250, 0.1)" }}
      ></div>
      
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-2">
          <span 
            className="text-[10px] font-bold px-2.5 py-1 rounded-md border tracking-wider uppercase flex items-center gap-1"
            style={{ backgroundColor: "#EFF6FF", color: "#1E40AF", borderColor: "#DBEAFE" }}
          >
            <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
            Active
          </span>
          {project && (
            <span 
              className="text-[10px] font-bold px-2.5 py-1 rounded-md border tracking-wider uppercase"
              style={{ backgroundColor: "#F9FAFB", color: "#4B5563", borderColor: "#E5E7EB" }}
            >
              {project.name}
            </span>
          )}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              title="Edit task"
            >
              <Edit2 className="w-4 h-4" style={{ color: "#3B82F6" }} />
            </button>
          )}
          <button
            onClick={() => onDelete(task.id, task.title)}
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" style={{ color: "#EF4444" }} />
          </button>
        </div>
      </div>
      
      <h4 
        className="text-3xl font-medium mb-4 leading-tight"
        style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
      >
        {task.title}
      </h4>
      
      {task.description && (
        <p className="text-sm leading-relaxed mb-8 max-w-xl" style={{ color: "#6B7280" }}>
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between border-t pt-6" style={{ borderColor: "rgba(229, 231, 235, 0.5)" }}>
        <div className="flex -space-x-2">
          {project && (
            <div 
              className="w-8 h-8 rounded-full ring-2 ring-white flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: project.color || "#E5E7EB", color: "#1F2937" }}
            >
              {project.name?.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button className="p-2 rounded-lg transition-all" style={{ color: "#6B7280" }}>
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg transition-all" style={{ color: "#6B7280" }}>
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// In Focus Task Card (smaller version)
function InFocusTaskCard({ task, onToggle, onDelete, onEdit, projects }: TaskCardProps) {
  const project = projects.find(p => p.id === task.projectId);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  
  const getPriorityStyle = (priority: string | undefined) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return { bg: 'rgba(254, 242, 242, 1)', text: '#DC2626', border: '#FECACA' };
      case 'medium':
        return { bg: 'rgba(239, 246, 255, 1)', text: '#2563EB', border: '#DBEAFE' };
      case 'low':
        return { bg: 'rgba(243, 244, 246, 1)', text: '#6B7280', border: '#E5E7EB' };
      default:
        return { bg: 'rgba(243, 244, 246, 1)', text: '#6B7280', border: '#E5E7EB' };
    }
  };

  const priorityStyle = getPriorityStyle(task.priority);
  
  return (
    <div 
      className="group rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative"
      style={{
        background: "rgba(255, 255, 255, 0.55)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)"
      }}
    >
      {/* Refraction Border Effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-80 pointer-events-none"
        style={{
          padding: "1px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0.6))",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude"
        }}
      />

      <div className="relative z-10">
        {/* Top row: Checkbox, Drag Handle, Title, and Priority Badge */}
        <div className="flex items-start gap-4 mb-3">
          {/* Checkbox */}
          <label className="relative flex items-center justify-center cursor-pointer group/checkbox flex-shrink-0">
            <input
              type="checkbox"
              checked={task.completed || false}
              onChange={() => onToggle(task.id)}
              className="sr-only peer"
            />
            <div 
              className="w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center peer-checked:bg-indigo-600 peer-checked:border-indigo-600 group-hover/checkbox:border-indigo-400"
              style={{
                borderColor: task.completed ? "#4F46E5" : "#D1D5DB",
                backgroundColor: task.completed ? "#4F46E5" : "white"
              }}
            >
              {task.completed && (
                <svg 
                  className="w-4 h-4 text-white animate-[checkmark_0.3s_ease-out]" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              )}
            </div>
          </label>

          {/* Drag Handle */}
          <div 
            className="text-gray-300 hover:text-primary transition-colors p-1 cursor-grab active:cursor-grabbing flex-shrink-0"
            style={{ color: "#D1D5DB" }}
          >
            <GripVertical className="w-5 h-5" />
          </div>

          {/* Title and Badge */}
          <div className={`flex-1 min-w-0 transition-all duration-300 ${task.completed ? 'opacity-50' : 'opacity-100'}`}>
            <div className="flex justify-between items-start gap-3">
              <h3 
                className="font-semibold text-lg leading-tight group-hover:text-blue-900 transition-colors break-words"
                style={{ 
                  fontFamily: "'Playfair Display', serif",
                  color: "#111827"
                }}
              >
                {task.title}
              </h3>
              <span 
                className="px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wider whitespace-nowrap flex-shrink-0"
                style={{
                  backgroundColor: priorityStyle.bg,
                  color: priorityStyle.text,
                  borderColor: priorityStyle.border
                }}
              >
                {isOverdue ? "OVERDUE" : task.priority}
              </span>
            </div>

            {/* Description */}
            {task.description && (
              <p 
                className="text-sm font-light mt-2 mb-3 line-clamp-2"
                style={{ color: "#6B7280" }}
              >
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Bottom metadata row */}
        <div 
          className="flex items-center gap-4 flex-wrap border-t pt-3"
          style={{ borderColor: "rgba(243, 244, 246, 0.5)" }}
        >
          {project && (
            <div 
              className="flex items-center gap-2 text-xs font-medium"
              style={{ color: "#6B7280" }}
            >
              <div 
                className="w-4 h-4 rounded flex-shrink-0"
                style={{ backgroundColor: project.color || "#E5E7EB" }}
              />
              <span className="truncate">{project.name}</span>
            </div>
          )}

          {task.estimatedMinutes && (
            <div 
              className="flex items-center gap-2 text-xs font-medium"
              style={{ color: "#6B7280" }}
            >
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{task.estimatedMinutes}m</span>
            </div>
          )}

          <div className="flex-1"></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button 
                className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:text-blue-600 transition-colors"
                style={{ color: "#111827" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id, task.title);
              }}
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Backlog Task Card
function BacklogTaskCard({ task, onToggle, onDelete, onEdit, projects }: TaskCardProps) {
  const project = projects.find(p => p.id === task.projectId);
  
  const getPriorityStyle = (priority: string | undefined) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return { bg: 'rgba(254, 242, 242, 1)', text: '#DC2626', border: '#FECACA' };
      case 'medium':
        return { bg: 'rgba(239, 246, 255, 1)', text: '#2563EB', border: '#DBEAFE' };
      case 'low':
        return { bg: 'rgba(243, 244, 246, 1)', text: '#6B7280', border: '#E5E7EB' };
      default:
        return { bg: 'rgba(243, 244, 246, 1)', text: '#6B7280', border: '#E5E7EB' };
    }
  };

  const priorityStyle = getPriorityStyle(task.priority);
  
  return (
    <div 
      className="group rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative"
      style={{
        background: "rgba(255, 255, 255, 0.55)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)"
      }}
    >
      {/* Refraction Border Effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-80 pointer-events-none"
        style={{
          padding: "1px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0.6))",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude"
        }}
      />

      <div className="flex items-center gap-5 relative z-10">
        {/* Checkbox */}
        <label className="relative flex items-center justify-center cursor-pointer group/checkbox">
          <input
            type="checkbox"
            checked={task.completed || false}
            onChange={() => onToggle(task.id)}
            className="sr-only peer"
          />
          <div 
            className="w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center peer-checked:bg-indigo-600 peer-checked:border-indigo-600 group-hover/checkbox:border-indigo-400"
            style={{
              borderColor: task.completed ? "#4F46E5" : "#D1D5DB",
              backgroundColor: task.completed ? "#4F46E5" : "white"
            }}
          >
            {task.completed && (
              <svg 
                className="w-4 h-4 text-white animate-[checkmark_0.3s_ease-out]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={3}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            )}
          </div>
        </label>

        <div 
          className="text-gray-300 hover:text-primary transition-colors p-1 cursor-grab active:cursor-grabbing"
          style={{ color: "#D1D5DB" }}
        >
          <GripVertical className="w-5 h-5" />
        </div>

        <div className={`flex-1 transition-all duration-300 ${task.completed ? 'opacity-50' : 'opacity-100'}`}>
          <div className="flex justify-between items-start mb-1">
            <h3 
              className="font-semibold text-xl group-hover:text-blue-900 transition-colors"
              style={{ 
                fontFamily: "'Playfair Display', serif",
                color: "#111827"
              }}
            >
              {task.title}
            </h3>
            {task.priority && (
              <span 
                className="px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wider"
                style={{
                  backgroundColor: priorityStyle.bg,
                  color: priorityStyle.text,
                  borderColor: priorityStyle.border
                }}
              >
                {task.priority} Priority
              </span>
            )}
          </div>

          {task.description && (
            <p 
              className="text-sm font-light mb-4"
              style={{ color: "#6B7280" }}
            >
              {task.description}
            </p>
          )}

          <div 
            className="flex items-center gap-6 border-t pt-3"
            style={{ borderColor: "rgba(243, 244, 246, 0.5)" }}
          >
            {project && (
              <div 
                className="flex items-center gap-2 text-xs font-medium"
                style={{ color: "#6B7280" }}
              >
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: project.color || "#E5E7EB" }}
                />
                <span>{project.name}</span>
              </div>
            )}

            {task.estimatedMinutes && (
              <div 
                className="flex items-center gap-2 text-xs font-medium"
                style={{ color: "#6B7280" }}
              >
                <Clock className="w-[18px] h-[18px]" />
                <span>{task.estimatedMinutes}m</span>
              </div>
            )}

            <div className="flex-1"></div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id, task.title);
              }}
              className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {onEdit && (
              <button 
                className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-600"
                style={{ color: "#111827" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
              >
                Edit <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}