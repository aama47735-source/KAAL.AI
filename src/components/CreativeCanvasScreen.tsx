import { useState, useRef } from "react";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";
import { 
  Brain, 
  Trash2, 
  X, 
  Edit3, 
  Link as LinkIcon, 
  Video, 
  FileText, 
  Image as ImageIcon, 
  Upload, 
  Loader2, 
  Sparkles, 
  CheckSquare, 
  ListPlus, 
  Clock, 
  Calendar, 
  CalendarPlus, 
  Zap, 
  ExternalLink 
} from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { storageService } from "../services/storage-service";
import { supabase } from "../services/supabase-client";

interface BrainDumpItem {
  id: string;
  type: "text" | "file" | "link" | "image";
  content: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  timestamp: Date;
  status: "pending" | "processing" | "processed" | "error";
}

interface AIProcessedResult {
  tasks: Array<{
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    dueDate?: string;
    category?: string;
  }>;
  events: Array<{
    title: string;
    date: string;
    time?: string;
    duration?: number;
    type: "meeting" | "deadline" | "event";
    link?: string;
  }>;
  insights: Array<{
    title: string;
    description: string;
    category: string;
  }>;
  summary: string;
}

export function CreativeCanvasScreen({ onClose }: { onClose: () => void }) {
  const [brainDumpItems, setBrainDumpItems] = useState<BrainDumpItem[]>([]);
  const [textInput, setTextInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResults, setProcessedResults] = useState<AIProcessedResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile } = useProfile();

  // Helper function to call Gemini API via Edge Function
  const generateInsight = async (prompt: string): Promise<string> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('gemini-proxy', {
        body: { prompt }
      });

      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }

      return data.response;
    } catch (error) {
      console.error('Gemini API call failed:', error);
      throw error;
    }
  };

  // Handle text brain dump
  const handleAddText = () => {
    if (!textInput.trim()) return;

    const newItem: BrainDumpItem = {
      id: `text-${Date.now()}`,
      type: "text",
      content: textInput,
      timestamp: new Date(),
      status: "pending"
    };

    setBrainDumpItems(prev => [...prev, newItem]);
    setTextInput("");
    toast.success("Added to brain dump!", {
      description: "AI will process this shortly"
    });
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = async (event) => {
        const content = event.target?.result as string;
        
        const newItem: BrainDumpItem = {
          id: `file-${Date.now()}-${i}`,
          type: file.type.startsWith('image/') ? 'image' : 'file',
          content: content,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          timestamp: new Date(),
          status: "pending"
        };

        setBrainDumpItems(prev => [...prev, newItem]);
        toast.success(`Uploaded ${file.name}`, {
          description: "AI will analyze this file"
        });
      };

      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  // Handle link paste
  const handleAddLink = () => {
    const linkMatch = textInput.match(/(https?:\/\/[^\s]+)/g);
    if (linkMatch) {
      linkMatch.forEach(link => {
        const newItem: BrainDumpItem = {
          id: `link-${Date.now()}`,
          type: "link",
          content: link,
          timestamp: new Date(),
          status: "pending"
        };
        setBrainDumpItems(prev => [...prev, newItem]);
      });
      setTextInput("");
      toast.success("Link added!", {
        description: "AI will extract meeting info and details"
      });
    }
  };

  // Detect link type
  const detectLinkType = (url: string): "zoom" | "meet" | "teams" | "generic" => {
    if (url.includes('zoom.us')) return 'zoom';
    if (url.includes('meet.google.com')) return 'meet';
    if (url.includes('teams.microsoft.com')) return 'teams';
    return 'generic';
  };

  // Process all items with AI
  const processWithAI = async () => {
    if (brainDumpItems.length === 0) {
      toast.error("Nothing to process", {
        description: "Add some text, files, or links first"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Build comprehensive prompt
      let prompt = `You are an intelligent executive assistant. Analyze the following brain dump and extract actionable items.

USER CONTEXT:
- Name: ${profile.name}
- Current Date: ${new Date().toLocaleDateString()}
- Current Time: ${new Date().toLocaleTimeString()}

BRAIN DUMP ITEMS:
`;

      brainDumpItems.forEach((item, index) => {
        prompt += `\n${index + 1}. [${item.type.toUpperCase()}] `;
        
        if (item.type === 'text') {
          prompt += item.content;
        } else if (item.type === 'link') {
          const linkType = detectLinkType(item.content);
          prompt += `${linkType.toUpperCase()} LINK: ${item.content}`;
        } else if (item.type === 'file') {
          prompt += `FILE: ${item.fileName} (${item.fileType})`;
          if (item.content && item.fileType === 'text/plain') {
            prompt += `\nContent preview: ${item.content.substring(0, 500)}`;
          }
        } else if (item.type === 'image') {
          prompt += `IMAGE: ${item.fileName}`;
        }
      });

      prompt += `

TASK:
Analyze everything above and extract:

1. TASKS: Any actionable items that should become tasks
   - Include title, description, priority (low/medium/high), optional due date, category
   
2. EVENTS: Any meetings, deadlines, or calendar items
   - For Zoom/Meet/Teams links, create meeting events with the link
   - Extract dates and times if mentioned
   - Note event type (meeting/deadline/event)
   
3. INSIGHTS: Key observations, ideas, or notes that aren't tasks
   - Categorize as: idea, note, reference, decision, question
   
4. SUMMARY: A brief 2-3 sentence summary of everything

Return ONLY valid JSON in this exact format:
{
  "tasks": [
    {
      "title": "Task title",
      "description": "Detailed description",
      "priority": "medium",
      "dueDate": "2026-02-15",
      "category": "Work"
    }
  ],
  "events": [
    {
      "title": "Event title",
      "date": "2026-02-14",
      "time": "14:00",
      "duration": 60,
      "type": "meeting",
      "link": "https://zoom.us/..."
    }
  ],
  "insights": [
    {
      "title": "Insight title",
      "description": "Details",
      "category": "idea"
    }
  ],
  "summary": "Brief summary of the brain dump"
}

Be smart about inferring context. If someone mentions "meeting tomorrow at 2pm", calculate the actual date.
If a Zoom link is provided without context, create a "Team Meeting" event.
Extract tasks from natural language like "need to email John" → Task: "Email John"
`;

      const aiResponse = await generateInsight(prompt);
      
      // Parse AI response
      let jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid AI response format");
      }

      const results: AIProcessedResult = JSON.parse(jsonMatch[0]);
      setProcessedResults(results);

      // Mark all items as processed
      setBrainDumpItems(prev => 
        prev.map(item => ({ ...item, status: 'processed' as const }))
      );

      toast.success("✨ AI Processing Complete!", {
        description: `Found ${results.tasks.length} tasks, ${results.events.length} events, ${results.insights.length} insights`
      });

    } catch (error) {
      console.error("AI processing error:", error);
      toast.error("Processing failed", {
        description: "Try again or simplify your input"
      });
      
      setBrainDumpItems(prev => 
        prev.map(item => ({ ...item, status: 'error' as const }))
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Create tasks from AI results
  const createTasksFromResults = async () => {
    if (!processedResults) return;

    let created = 0;
    for (const taskData of processedResults.tasks) {
      try {
        await supabase.from('tasks').insert({
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          category: taskData.category || 'General',
          due_date: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
          completed: false,
          created_at: new Date(),
          updated_at: new Date(),
          user_id: profile.email
        });
        created++;
      } catch (error) {
        console.error("Failed to create task:", error);
      }
    }

    toast.success(`✅ Created ${created} tasks!`, {
      description: "Check your task list"
    });
  };

  // Create calendar events from AI results
  const createEventsFromResults = async () => {
    if (!processedResults) return;

    try {
      // Store in calendar_events table
      for (const event of processedResults.events) {
        await storageService.createCalendarEvent({
          title: event.title,
          date: event.date,
          time: event.time,
          duration: event.duration || 60,
          type: event.type,
          link: event.link,
          userId: profile.email
        });
      }

      toast.success(`📅 Created ${processedResults.events.length} calendar events!`, {
        description: "Check your calendar"
      });
    } catch (error) {
      console.error("Failed to create events:", error);
      toast.error("Failed to create some events");
    }
  };

  // Delete item
  const deleteItem = (id: string) => {
    setBrainDumpItems(prev => prev.filter(item => item.id !== id));
    toast.success("Item removed");
  };

  // Clear all
  const clearAll = () => {
    setBrainDumpItems([]);
    setProcessedResults(null);
    setTextInput("");
    toast.success("Canvas cleared");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col p-8 transition-all duration-700 ease-out"
      style={{
        background: "rgba(248, 249, 250, 0.95)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)"
      }}
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center mb-8 shrink-0 relative z-10"
      >
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
            style={{ 
              background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)"
            }}
          >
            <Brain className="w-6 h-6" strokeWidth={2} />
          </div>
          <div>
            <h2 
              className="text-sm font-semibold tracking-wider uppercase"
              style={{ color: "#6B7280" }}
            >
              Creative Canvas
            </h2>
            <p 
              className="text-2xl italic"
              style={{ 
                fontFamily: "'Playfair Display', serif", 
                color: "#111827" 
              }}
            >
              AI Brain Dump
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {brainDumpItems.length > 0 && (
            <button 
              onClick={clearAll}
              className="px-4 py-2 rounded-xl border transition-all"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderColor: "rgba(239, 68, 68, 0.3)",
                color: "#EF4444"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FEF2F2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          
          <button 
            onClick={onClose}
            className="p-3 rounded-full hover:bg-gray-100/50 transition-colors group"
            style={{ color: "#6B7280" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#111827";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#6B7280";
            }}
          >
            <X className="w-7 h-7 group-hover:rotate-90 transition-transform duration-500" strokeWidth={2} />
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex gap-8 min-h-0 relative z-10">
        {/* Left Panel - Input */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-2/5 flex flex-col gap-6"
        >
          {/* Text Input */}
          <div 
            className="flex-1 border rounded-3xl p-6 flex flex-col"
            style={{
              background: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderColor: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)"
            }}
          >
            <h3 
              className="text-lg italic mb-4"
              style={{ 
                fontFamily: "'Playfair Display', serif", 
                color: "#111827" 
              }}
            >
              Dump your thoughts here...
            </h3>
            
            <textarea
              autoFocus
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.metaKey) {
                  handleAddText();
                }
              }}
              className="flex-1 w-full text-base font-light leading-relaxed resize-none bg-transparent border-none outline-none"
              style={{ color: "#111827" }}
              placeholder="Type anything... tasks, ideas, meeting notes, links to Zoom calls, etc.&#10;&#10;Examples:&#10;• 'Meeting with Sarah tomorrow at 2pm'&#10;• 'https://zoom.us/j/123456789'&#10;• 'Need to finish the presentation by Friday'&#10;• Upload PDFs, images, or paste links&#10;&#10;Press ⌘+Enter to add"
            />
            
            <div className="mt-4 flex gap-2">
              <button 
                onClick={handleAddText}
                disabled={!textInput.trim()}
                className="flex-1 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: textInput.trim() ? "#111827" : "#E5E7EB",
                  color: textInput.trim() ? "white" : "#9CA3AF"
                }}
              >
                Add Text
              </button>
              
              {textInput.match(/(https?:\/\/[^\s]+)/g) && (
                <button 
                  onClick={handleAddLink}
                  className="px-4 py-3 rounded-xl font-medium transition-all"
                  style={{
                    backgroundColor: "#667EEA",
                    color: "white"
                  }}
                >
                  <LinkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div 
            className="border rounded-3xl p-6"
            style={{
              background: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderColor: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)"
            }}
          >
            <h3 
              className="text-sm font-bold uppercase tracking-wider mb-4"
              style={{ color: "#6B7280" }}
            >
              Upload Files
            </h3>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.txt,.doc,.docx,image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 border-2 border-dashed rounded-2xl flex flex-col items-center gap-2 transition-all group"
              style={{
                borderColor: "rgba(102, 126, 234, 0.3)",
                backgroundColor: "rgba(102, 126, 234, 0.05)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#667EEA";
                e.currentTarget.style.backgroundColor = "rgba(102, 126, 234, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(102, 126, 234, 0.3)";
                e.currentTarget.style.backgroundColor = "rgba(102, 126, 234, 0.05)";
              }}
            >
              <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color: "#667EEA" }} />
              <span className="text-sm font-medium" style={{ color: "#667EEA" }}>
                Click to upload or drag files
              </span>
              <span className="text-xs" style={{ color: "#9CA3AF" }}>
                PDFs, images, text files
              </span>
            </button>
          </div>

          {/* Process Button */}
          <button 
            onClick={processWithAI}
            disabled={brainDumpItems.length === 0 || isProcessing}
            className="py-4 rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            style={{
              background: brainDumpItems.length > 0 && !isProcessing
                ? "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)"
                : "#E5E7EB"
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Process with AI ({brainDumpItems.length})
              </>
            )}
          </button>
        </motion.div>

        {/* Middle Panel - Brain Dump Items */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-1 flex flex-col gap-4"
        >
          <div className="flex justify-between items-center">
            <h3 
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: "#6B7280" }}
            >
              Brain Dump Items ({brainDumpItems.length})
            </h3>
          </div>

          <div 
            className="flex-1 overflow-y-auto space-y-3 pr-2"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#E5E7EB transparent"
            }}
          >
            <AnimatePresence>
              {brainDumpItems.length === 0 ? (
                <div 
                  className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-3xl"
                  style={{
                    borderColor: "rgba(229, 231, 235, 0.5)",
                    color: "#9CA3AF"
                  }}
                >
                  <Brain className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">Nothing here yet</p>
                  <p className="text-sm">Start adding text, files, or links to get started</p>
                </div>
              ) : (
                brainDumpItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border rounded-2xl group relative"
                    style={{
                      background: "rgba(255, 255, 255, 0.8)",
                      borderColor: item.status === 'processed' 
                        ? "rgba(16, 185, 129, 0.3)"
                        : item.status === 'error'
                        ? "rgba(239, 68, 68, 0.3)"
                        : "rgba(229, 231, 235, 0.5)",
                      backdropFilter: "blur(8px)"
                    }}
                  >
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                      {item.status === 'processed' && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600 font-bold border border-green-100">
                          ✓ Processed
                        </span>
                      )}
                      {item.status === 'error' && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 font-bold border border-red-100">
                          ✗ Error
                        </span>
                      )}
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 transition-all"
                        style={{ color: "#EF4444" }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: item.type === 'text' 
                            ? "#F3F4F6"
                            : item.type === 'link'
                            ? "#EEF2FF"
                            : item.type === 'image'
                            ? "#FEF3C7"
                            : "#DBEAFE",
                          color: item.type === 'text'
                            ? "#6B7280"
                            : item.type === 'link'
                            ? "#667EEA"
                            : item.type === 'image'
                            ? "#F59E0B"
                            : "#3B82F6"
                        }}
                      >
                        {item.type === 'text' && <Edit3 className="w-5 h-5" />}
                        {item.type === 'link' && (
                          detectLinkType(item.content) === 'zoom' ? <Video className="w-5 h-5" /> :
                          detectLinkType(item.content) === 'meet' ? <Video className="w-5 h-5" /> :
                          <LinkIcon className="w-5 h-5" />
                        )}
                        {item.type === 'image' && <ImageIcon className="w-5 h-5" />}
                        {item.type === 'file' && <FileText className="w-5 h-5" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        {item.type === 'text' && (
                          <p className="text-sm leading-relaxed" style={{ color: "#111827" }}>
                            {item.content}
                          </p>
                        )}
                        
                        {item.type === 'link' && (
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {detectLinkType(item.content) === 'zoom' && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold border border-blue-100">
                                  ZOOM
                                </span>
                              )}
                              {detectLinkType(item.content) === 'meet' && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-bold border border-green-100">
                                  MEET
                                </span>
                              )}
                            </div>
                            <a 
                              href={item.content} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline flex items-center gap-1 truncate"
                            >
                              {item.content}
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            </a>
                          </div>
                        )}
                        
                        {(item.type === 'file' || item.type === 'image') && (
                          <div>
                            <p className="text-sm font-medium mb-1" style={{ color: "#111827" }}>
                              {item.fileName}
                            </p>
                            {item.fileSize && (
                              <p className="text-xs" style={{ color: "#6B7280" }}>
                                {formatFileSize(item.fileSize)} • {item.fileType}
                              </p>
                            )}
                            {item.type === 'image' && item.content && (
                              <img 
                                src={item.content} 
                                alt={item.fileName}
                                className="mt-2 max-h-32 rounded-lg border"
                                style={{ borderColor: "#E5E7EB" }}
                              />
                            )}
                          </div>
                        )}

                        <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>
                          {item.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Panel - AI Results */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-2/5 flex flex-col gap-6"
        >
          <h3 
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: "#6B7280" }}
          >
            AI Processed Results
          </h3>

          <div 
            className="flex-1 overflow-y-auto space-y-4"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#E5E7EB transparent"
            }}
          >
            {!processedResults ? (
              <div 
                className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-3xl"
                style={{
                  borderColor: "rgba(229, 231, 235, 0.5)",
                  color: "#9CA3AF"
                }}
              >
                <Sparkles className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-medium mb-2">Waiting for AI...</p>
                <p className="text-sm">Add items and click "Process with AI"</p>
              </div>
            ) : (
              <>
                {/* Summary */}
                {processedResults.summary && (
                  <div 
                    className="p-6 border rounded-3xl"
                    style={{
                      background: "rgba(102, 126, 234, 0.05)",
                      borderColor: "rgba(102, 126, 234, 0.2)"
                    }}
                  >
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "#667EEA" }}>
                      ✨ Summary
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: "#111827" }}>
                      {processedResults.summary}
                    </p>
                  </div>
                )}

                {/* Tasks */}
                {processedResults.tasks.length > 0 && (
                  <div 
                    className="p-6 border rounded-3xl"
                    style={{
                      background: "rgba(255, 255, 255, 0.8)",
                      borderColor: "rgba(229, 231, 235, 0.5)"
                    }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#6B7280" }}>
                        <CheckSquare className="w-4 h-4 inline mr-2" />
                        Tasks ({processedResults.tasks.length})
                      </h4>
                      <button 
                        onClick={createTasksFromResults}
                        className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all"
                        style={{
                          backgroundColor: "#10B981",
                          color: "white"
                        }}
                      >
                        <ListPlus className="w-3 h-3 inline mr-1" />
                        Create All
                      </button>
                    </div>
                    <div className="space-y-3">
                      {processedResults.tasks.map((task, i) => (
                        <div 
                          key={i}
                          className="p-3 rounded-xl border"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            borderColor: "#E5E7EB"
                          }}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <p className="font-bold text-sm" style={{ color: "#111827" }}>
                              {task.title}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                              task.priority === 'high' 
                                ? 'bg-red-50 text-red-600 border border-red-100'
                                : task.priority === 'medium'
                                ? 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                                : 'bg-gray-50 text-gray-600 border border-gray-100'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-xs mb-2" style={{ color: "#6B7280" }}>
                            {task.description}
                          </p>
                          {task.dueDate && (
                            <p className="text-xs flex items-center gap-1" style={{ color: "#9CA3AF" }}>
                              <Clock className="w-3 h-3" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Events */}
                {processedResults.events.length > 0 && (
                  <div 
                    className="p-6 border rounded-3xl"
                    style={{
                      background: "rgba(255, 255, 255, 0.8)",
                      borderColor: "rgba(229, 231, 235, 0.5)"
                    }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#6B7280" }}>
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Events ({processedResults.events.length})
                      </h4>
                      <button 
                        onClick={createEventsFromResults}
                        className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all"
                        style={{
                          backgroundColor: "#3B82F6",
                          color: "white"
                        }}
                      >
                        <CalendarPlus className="w-3 h-3 inline mr-1" />
                        Create All
                      </button>
                    </div>
                    <div className="space-y-3">
                      {processedResults.events.map((event, i) => (
                        <div 
                          key={i}
                          className="p-3 rounded-xl border"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            borderColor: "#E5E7EB"
                          }}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <p className="font-bold text-sm" style={{ color: "#111827" }}>
                              {event.title}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                              event.type === 'meeting'
                                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                : event.type === 'deadline'
                                ? 'bg-red-50 text-red-600 border border-red-100'
                                : 'bg-purple-50 text-purple-600 border border-purple-100'
                            }`}>
                              {event.type}
                            </span>
                          </div>
                          <p className="text-xs flex items-center gap-1 mb-1" style={{ color: "#6B7280" }}>
                            <Calendar className="w-3 h-3" />
                            {new Date(event.date).toLocaleDateString()}
                            {event.time && ` • ${event.time}`}
                            {event.duration && ` • ${event.duration}min`}
                          </p>
                          {event.link && (
                            <a 
                              href={event.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2"
                            >
                              <Video className="w-3 h-3" />
                              Join meeting
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insights */}
                {processedResults.insights.length > 0 && (
                  <div 
                    className="p-6 border rounded-3xl"
                    style={{
                      background: "rgba(255, 255, 255, 0.8)",
                      borderColor: "rgba(229, 231, 235, 0.5)"
                    }}
                  >
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#6B7280" }}>
                      <Zap className="w-4 h-4 inline mr-2" />
                      Insights ({processedResults.insights.length})
                    </h4>
                    <div className="space-y-3">
                      {processedResults.insights.map((insight, i) => (
                        <div 
                          key={i}
                          className="p-3 rounded-xl border"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            borderColor: "#E5E7EB"
                          }}
                        >
                          <p className="font-bold text-sm mb-1" style={{ color: "#111827" }}>
                            {insight.title}
                          </p>
                          <p className="text-xs" style={{ color: "#6B7280" }}>
                            {insight.description}
                          </p>
                          <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-bold border border-purple-100">
                            {insight.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Info Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 text-center text-xs"
        style={{ color: "#9CA3AF" }}
      >
        💡 Pro tip: Paste Zoom/Meet links, upload PDFs, or describe tasks naturally - AI will organize everything
      </motion.div>
    </div>
  );
}