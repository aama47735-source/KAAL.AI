/**
 * Supabase Setup Modal - Connect to cloud sync
 */

import { useState, useEffect } from 'react';
import { X, Cloud, CheckCircle, AlertCircle, Copy, ExternalLink, Database } from 'lucide-react';
import { supabaseService } from '../services/supabase-service';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupabaseSetupModal({ isOpen, onClose }: SupabaseSetupModalProps) {
  const [anonKey, setAnonKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [showSQL, setShowSQL] = useState(false);

  useEffect(() => {
    setIsConnected(supabaseService.isConnected());
  }, [isOpen]);

  if (!isOpen) return null;

  const SQL_SCHEMA = `-- KAAL Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  due_date TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at BIGINT NOT NULL,
  completed_at BIGINT,
  estimated_minutes INTEGER,
  actual_minutes INTEGER
);

-- Focus sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  start_time BIGINT NOT NULL,
  end_time BIGINT,
  duration INTEGER NOT NULL,
  task_ids TEXT[] DEFAULT '{}',
  focus_score INTEGER DEFAULT 0,
  energy_levels JSONB DEFAULT '[]',
  context_switches INTEGER DEFAULT 0,
  notes TEXT,
  mood TEXT
);

-- Energy logs table
CREATE TABLE IF NOT EXISTS energy_logs (
  id TEXT PRIMARY KEY,
  timestamp BIGINT NOT NULL,
  level INTEGER NOT NULL,
  mood TEXT,
  notes TEXT,
  activities TEXT[] DEFAULT '{}'
);

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  apps JSONB DEFAULT '[]',
  tasks TEXT[] DEFAULT '{}',
  created_at BIGINT NOT NULL
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY DEFAULT 'default-user',
  name TEXT NOT NULL,
  email TEXT,
  avatar TEXT,
  work_style TEXT CHECK (work_style IN ('sprint', 'cyclic', 'marathon')),
  focus_baseline INTEGER DEFAULT 75,
  timezone TEXT,
  preferences JSONB DEFAULT '{}',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON focus_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_energy_timestamp ON energy_logs(timestamp);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - customize based on auth)
CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON focus_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON energy_logs FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON workspaces FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON profiles FOR ALL USING (true);`;

  const handleConnect = async () => {
    if (!anonKey.trim()) {
      setErrorMessage('Please enter your Supabase anon key');
      setConnectionStatus('error');
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('testing');
    setErrorMessage('');

    try {
      // Initialize Supabase
      const initialized = supabaseService.initialize(anonKey);

      if (!initialized) {
        throw new Error('Failed to initialize Supabase client');
      }

      // Test connection
      const connected = await supabaseService.testConnection();

      if (connected) {
        setConnectionStatus('success');
        setIsConnected(true);
        
        // Start initial sync
        await supabaseService.syncAll();

        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error('Connection test failed - please check your API key and database setup');
      }
    } catch (error: any) {
      setConnectionStatus('error');
      setErrorMessage(error.message || 'Failed to connect to Supabase');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    supabaseService.disconnect();
    setIsConnected(false);
    setAnonKey('');
    setConnectionStatus('idle');
  };

  const copySQL = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    // Could add a toast notification here
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div 
        className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(40px) saturate(200%)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 48px 144px -24px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Header */}
        <div 
          className="px-8 py-6 border-b flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            borderColor: 'rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Supabase Cloud Sync</h2>
              <p className="text-sm text-white/80">Connect your database for multi-device sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Status Banner */}
          {isConnected ? (
            <div 
              className="p-4 rounded-2xl flex items-center gap-3 border"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                borderColor: 'rgba(16, 185, 129, 0.2)'
              }}
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#10B981' }} />
              <div className="flex-1">
                <h3 className="text-sm font-bold" style={{ color: '#10B981' }}>
                  ✅ Cloud Sync Active
                </h3>
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                  Your data is automatically syncing every 5 minutes
                </p>
              </div>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#EF4444'
                }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div 
              className="p-4 rounded-2xl flex items-center gap-3 border"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                borderColor: 'rgba(59, 130, 246, 0.2)'
              }}
            >
              <Database className="w-5 h-5 flex-shrink-0" style={{ color: '#3B82F6' }} />
              <div className="flex-1">
                <h3 className="text-sm font-bold" style={{ color: '#3B82F6' }}>
                  Local Storage Only
                </h3>
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                  Connect Supabase to enable cloud backup and multi-device sync
                </p>
              </div>
            </div>
          )}

          {/* Setup Steps */}
          {!isConnected && (
            <div className="space-y-6">
              {/* Step 1: Setup Database */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: '#3B82F6',
                      color: 'white'
                    }}
                  >
                    1
                  </div>
                  <h3 className="text-sm font-bold" style={{ color: '#111827' }}>
                    Setup Your Database
                  </h3>
                </div>

                <div 
                  className="p-4 rounded-xl border mb-3"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    borderColor: 'rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold" style={{ color: '#111827' }}>
                      Your Supabase Project
                    </span>
                    <a
                      href="https://supabase.com/dashboard/project/grxcanjeqpejwxdxdfen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-medium hover:underline"
                      style={{ color: '#3B82F6' }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open Dashboard
                    </a>
                  </div>
                  <code className="text-xs font-mono" style={{ color: '#6B7280' }}>
                    grxcanjeqpejwxdxdfen
                  </code>
                </div>

                <button
                  onClick={() => setShowSQL(!showSQL)}
                  className="w-full text-left"
                >
                  <div 
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: showSQL ? 'rgba(59, 130, 246, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                      borderColor: showSQL ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: '#111827' }}>
                        {showSQL ? '▼' : '▶'} Database Schema (Click to {showSQL ? 'hide' : 'show'})
                      </span>
                      {showSQL && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copySQL();
                          }}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                          style={{
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            color: '#3B82F6'
                          }}
                        >
                          <Copy className="w-3 h-3" />
                          Copy SQL
                        </button>
                      )}
                    </div>
                  </div>
                </button>

                {showSQL && (
                  <div 
                    className="mt-2 p-4 rounded-xl border overflow-x-auto"
                    style={{
                      backgroundColor: '#1F2937',
                      borderColor: '#374151'
                    }}
                  >
                    <pre className="text-xs font-mono" style={{ color: '#E5E7EB' }}>
                      {SQL_SCHEMA}
                    </pre>
                  </div>
                )}

                <div className="mt-3 text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                  1. Go to your Supabase dashboard → SQL Editor<br />
                  2. Copy the schema above and run it<br />
                  3. This creates all necessary tables for KAAL
                </div>
              </div>

              {/* Step 2: Get API Key */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: '#3B82F6',
                      color: 'white'
                    }}
                  >
                    2
                  </div>
                  <h3 className="text-sm font-bold" style={{ color: '#111827' }}>
                    Get Your API Key
                  </h3>
                </div>

                <a
                  href="https://supabase.com/dashboard/project/grxcanjeqpejwxdxdfen/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-medium hover:underline mb-3"
                  style={{ color: '#3B82F6' }}
                >
                  <ExternalLink className="w-3 h-3" />
                  Go to Project Settings → API
                </a>

                <div className="text-xs leading-relaxed mb-3" style={{ color: '#6B7280' }}>
                  Copy your <strong style={{ color: '#111827' }}>anon/public</strong> API key (not the service_role key)
                </div>

                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full pl-4 pr-24 py-3 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'white',
                      borderColor: connectionStatus === 'error' ? '#EF4444' : 'rgba(0, 0, 0, 0.1)',
                      color: '#111827'
                    }}
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      color: '#6B7280'
                    }}
                  >
                    {showKey ? 'Hide' : 'Show'}
                  </button>
                </div>

                {connectionStatus === 'error' && errorMessage && (
                  <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: '#EF4444' }}>
                    <AlertCircle className="w-4 h-4" />
                    {errorMessage}
                  </div>
                )}

                {connectionStatus === 'success' && (
                  <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: '#10B981' }}>
                    <CheckCircle className="w-4 h-4" />
                    Connected successfully! Syncing data...
                  </div>
                )}
              </div>

              {/* Privacy Note */}
              <div 
                className="p-4 rounded-xl text-xs leading-relaxed"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  color: '#6B7280'
                }}
              >
                <strong style={{ color: '#111827' }}>Privacy & Security:</strong> Your Supabase connection is direct from your browser to your database. KAAL does not store or have access to your API keys or data.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isConnected && (
          <div 
            className="px-8 py-4 border-t flex items-center justify-end gap-3"
            style={{
              backgroundColor: 'rgba(249, 250, 251, 0.8)',
              borderColor: 'rgba(0, 0, 0, 0.05)'
            }}
          >
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                color: '#6B7280'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConnect}
              disabled={!anonKey.trim() || isConnecting}
              className="px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
            >
              {isConnecting ? 'Connecting...' : connectionStatus === 'testing' ? 'Testing...' : 'Connect & Sync'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
