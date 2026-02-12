import { useState, useEffect, useMemo } from 'react';
import { storageService } from '../services/storage-service';
import type { FocusSession } from '../services/supabase-service';

export interface AnalyticsMetrics {
  deepWorkRatio: number;
  cognitiveLoad: number;
  focusScore: number;
  totalDeepWorkHours: number;
  totalShallowWorkHours: number;
  averageSessionDuration: number;
  contextSwitches: number;
  peakPerformanceTime: string;
  interruptions: {
    email: number;
    slack: number;
    meetings: number;
  };
  trends: {
    deepWorkChange: number;
    focusScoreChange: number;
  };
}

export interface ChartDataPoint {
  day: string;
  deepWork: number;
  shallowWork: number;
  date: Date;
}

type TimeRange = 'daily' | 'weekly' | 'monthly';

export function useAnalytics(timeRange: TimeRange = 'weekly') {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Load sessions from Supabase
  useEffect(() => {
    let mounted = true;

    const loadSessions = async () => {
      try {
        setLoading(true);
        const data = await storageService.getSessions();
        if (mounted) {
          setSessions(data || []);
        }
      } catch (error) {
        console.error('Failed to load sessions:', error);
        if (mounted) {
          setSessions([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSessions();

    return () => {
      mounted = false;
    };
  }, [lastUpdated]);

  // Calculate metrics from sessions
  const calculateMetrics = (sessions: FocusSession[]): AnalyticsMetrics => {
    if (!sessions || sessions.length === 0) {
      return {
        deepWorkRatio: 0,
        cognitiveLoad: 0,
        focusScore: 0,
        totalDeepWorkHours: 0,
        totalShallowWorkHours: 0,
        averageSessionDuration: 0,
        contextSwitches: 0,
        peakPerformanceTime: '09:00',
        interruptions: { email: 0, slack: 0, meetings: 0 },
        trends: { deepWorkChange: 0, focusScoreChange: 0 }
      };
    }
    
    // Filter sessions based on time range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        startDate.setDate(now.getDate() + diffToMonday);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
    }
    
    const filteredSessions = sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= startDate;
    });

    // Calculate total hours
    const totalMinutes = filteredSessions.reduce((acc, session) => {
      const duration = session.actualDuration 
        ? session.actualDuration / (1000 * 60)
        : session.plannedDuration || 0;
      return acc + duration;
    }, 0);
    const totalHours = totalMinutes / 60;
    
    // Deep work is sessions with focusScore >= 70
    const deepWorkSessions = filteredSessions.filter(s => (s.focusScore || 0) >= 70);
    const deepWorkMinutes = deepWorkSessions.reduce((acc, s) => {
      const duration = s.actualDuration 
        ? s.actualDuration / (1000 * 60)
        : s.plannedDuration || 0;
      return acc + duration;
    }, 0);
    const deepWorkHours = deepWorkMinutes / 60;
    
    const shallowWorkHours = totalHours - deepWorkHours;
    const deepWorkRatio = totalHours > 0 ? (deepWorkHours / totalHours) * 100 : 0;
    
    // Calculate average cognitive load (based on focus scores)
    const avgFocusScore = filteredSessions.length > 0
      ? filteredSessions.reduce((acc, s) => acc + (s.focusScore || 0), 0) / filteredSessions.length
      : 0;
    const cognitiveLoad = (avgFocusScore / 100) * 10; // Convert to 0-10 scale
    
    // Calculate focus score (arbitrary metric based on productivity)
    const focusScore = Math.round(deepWorkHours * 100 + avgFocusScore * 5);
    
    // Average session duration
    const averageSessionDuration = filteredSessions.length > 0
      ? totalMinutes / filteredSessions.length
      : 0;
    
    // Context switches (sum from all sessions)
    const contextSwitches = filteredSessions.reduce((acc, s) => acc + (s.contextSwitches || 0), 0);
    
    // Find peak performance time (hour with most deep work)
    const hourCounts = new Map<number, number>();
    filteredSessions.forEach(session => {
      const hour = new Date(session.startTime).getHours();
      const duration = session.actualDuration 
        ? session.actualDuration / (1000 * 60)
        : session.plannedDuration || 0;
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + duration);
    });
    
    let peakHour = 9; // Default
    let maxMinutes = 0;
    hourCounts.forEach((minutes, hour) => {
      if (minutes > maxMinutes) {
        maxMinutes = minutes;
        peakHour = hour;
      }
    });
    
    const peakPerformanceTime = `${String(peakHour).padStart(2, '0')}:00`;
    
    // Mock interruption data (would be tracked from real data in production)
    const interruptions = {
      email: Math.round(contextSwitches * 0.45), // 45% from email
      slack: Math.round(contextSwitches * 0.25), // 25% from slack
      meetings: Math.round(contextSwitches * 0.30) // 30% from meetings
    };
    
    // Calculate trends (compare to previous period)
    const previousStartDate = new Date(startDate);
    switch (timeRange) {
      case 'daily':
        previousStartDate.setDate(previousStartDate.getDate() - 1);
        break;
      case 'weekly':
        previousStartDate.setDate(previousStartDate.getDate() - 7);
        break;
      case 'monthly':
        previousStartDate.setMonth(previousStartDate.getMonth() - 1);
        break;
    }
    
    const previousSessions = sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= previousStartDate && sessionDate < startDate;
    });
    
    const previousDeepWorkSessions = previousSessions.filter(s => (s.focusScore || 0) >= 70);
    const previousDeepWorkMinutes = previousDeepWorkSessions.reduce((acc, s) => {
      const duration = s.actualDuration 
        ? s.actualDuration / (1000 * 60)
        : s.plannedDuration || 0;
      return acc + duration;
    }, 0);
    const previousTotalMinutes = previousSessions.reduce((acc, s) => {
      const duration = s.actualDuration 
        ? s.actualDuration / (1000 * 60)
        : s.plannedDuration || 0;
      return acc + duration;
    }, 0);
    const previousDeepWorkRatio = previousTotalMinutes > 0 ? (previousDeepWorkMinutes / previousTotalMinutes) * 100 : 0;
    
    const previousFocusScore = Math.round((previousDeepWorkMinutes / 60) * 100 + 
      (previousSessions.length > 0 ? previousSessions.reduce((acc, s) => acc + (s.focusScore || 0), 0) / previousSessions.length : 0) * 5);
    
    const deepWorkChange = previousDeepWorkRatio > 0 
      ? ((deepWorkRatio - previousDeepWorkRatio) / previousDeepWorkRatio) * 100 
      : deepWorkRatio > 0 ? 100 : 0;
    
    const focusScoreChange = previousFocusScore > 0
      ? ((focusScore - previousFocusScore) / previousFocusScore) * 100
      : focusScore > 0 ? 100 : 0;

    return {
      deepWorkRatio: Math.round(deepWorkRatio),
      cognitiveLoad: Math.round(cognitiveLoad * 10) / 10,
      focusScore,
      totalDeepWorkHours: Math.round(deepWorkHours * 10) / 10,
      totalShallowWorkHours: Math.round(shallowWorkHours * 10) / 10,
      averageSessionDuration: Math.round(averageSessionDuration),
      contextSwitches,
      peakPerformanceTime,
      interruptions,
      trends: {
        deepWorkChange: Math.round(deepWorkChange),
        focusScoreChange: Math.round(focusScoreChange)
      }
    };
  };

  // Generate chart data for the week
  const getChartData = (sessions: FocusSession[]): ChartDataPoint[] => {
    if (!sessions || sessions.length === 0) {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const now = new Date();
      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMonday);
      monday.setHours(0, 0, 0, 0);

      return days.map((day, i) => {
        const currentDay = new Date(monday);
        currentDay.setDate(monday.getDate() + i);
        return {
          day,
          deepWork: 0,
          shallowWork: 0,
          date: currentDay
        };
      });
    }

    const dataPoints: ChartDataPoint[] = [];
    
    const now = new Date();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Get Monday of current week
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + i);
      currentDay.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(currentDay);
      nextDay.setDate(currentDay.getDate() + 1);
      
      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate >= currentDay && sessionDate < nextDay;
      });
      
      // Calculate deep work vs shallow work hours
      const deepWorkMinutes = daySessions
        .filter(s => (s.focusScore || 0) >= 70)
        .reduce((acc, s) => {
          const duration = s.actualDuration 
            ? s.actualDuration / (1000 * 60)
            : s.plannedDuration || 0;
          return acc + duration;
        }, 0);
      
      const totalMinutes = daySessions.reduce((acc, s) => {
        const duration = s.actualDuration 
          ? s.actualDuration / (1000 * 60)
          : s.plannedDuration || 0;
        return acc + duration;
      }, 0);
      const shallowWorkMinutes = totalMinutes - deepWorkMinutes;
      
      dataPoints.push({
        day: days[i],
        deepWork: Math.round((deepWorkMinutes / 60) * 10) / 10,
        shallowWork: Math.round((shallowWorkMinutes / 60) * 10) / 10,
        date: currentDay
      });
    }
    
    return dataPoints;
  };

  // Generate SVG path for chart
  const generateChartPath = (dataPoints: ChartDataPoint[], type: 'deepWork' | 'shallowWork'): string => {
    if (dataPoints.length === 0) return '';
    
    const width = 800;
    const height = 300;
    const maxValue = Math.max(...dataPoints.map(d => Math.max(d.deepWork, d.shallowWork)), 5);
    
    const xStep = width / (dataPoints.length - 1 || 1);
    
    const points = dataPoints.map((point, index) => {
      const x = index * xStep;
      const value = type === 'deepWork' ? point.deepWork : point.shallowWork;
      const y = height - (value / maxValue) * (height - 50); // Leave 50px padding
      return { x, y };
    });
    
    // Create smooth curve
    let path = `M${points[0].x},${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;
      
      path += ` C${controlX},${current.y} ${controlX},${next.y} ${next.x},${next.y}`;
    }
    
    return path;
  };

  // Get cognitive load bars (7 days)
  const getCognitiveLoadBars = (chartData: ChartDataPoint[]): number[] => {
    return chartData.map(day => {
      const totalHours = day.deepWork + day.shallowWork;
      // Normalize to 0-100 range, assuming 8 hours is 100%
      return Math.min(100, (totalHours / 8) * 100);
    });
  };

  // Refresh analytics
  const refresh = () => {
    setLastUpdated(new Date());
  };

  const metrics = useMemo(() => calculateMetrics(sessions), [sessions, timeRange]);
  const chartData = useMemo(() => getChartData(sessions), [sessions]);
  const cognitiveLoadBars = useMemo(() => getCognitiveLoadBars(chartData), [chartData]);

  return {
    metrics,
    chartData,
    cognitiveLoadBars,
    generateChartPath,
    lastUpdated,
    refresh,
    loading
  };
}
