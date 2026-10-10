'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckSquare, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flame, 
  Compass, 
  RotateCcw, 
  Calendar, 
  ArrowRight,
  Sun,
  Sparkles
} from 'lucide-react';
import { 
  loadStoredPlan, 
  loadCompletedTasks, 
  saveCompletedTasks 
} from '@/lib/storage';
import { GardenPlan, WeeklyTask } from '@/types';

export default function TasksPage() {
  const [plan, setPlan] = useState<GardenPlan | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    const savedPlan = loadStoredPlan();
    setPlan(savedPlan);
    const tasks = loadCompletedTasks();
    setCompletedTasks(tasks);
  }, []);

  const toggleTask = (taskId: string) => {
    const updated = { ...completedTasks, [taskId]: !completedTasks[taskId] };
    setCompletedTasks(updated);
    saveCompletedTasks(updated);
  };

  const resetAllTasks = () => {
    if (confirm('Reset all task checkmarks for this week?')) {
      setCompletedTasks({});
      saveCompletedTasks({});
    }
  };

  const tasks = plan?.weekly_tasks || [];
  const completedCount = tasks.filter(t => completedTasks[t.id]).length;
  const totalOutdoorMins = tasks
    .filter(t => completedTasks[t.id])
    .reduce((acc, t) => acc + (t.estimated_minutes || 15), 0);

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !completedTasks[t.id];
    if (filter === 'completed') return !!completedTasks[t.id];
    return true;
  });

  // Calculate consistency streak
  const streakDays = completedCount > 0 ? Math.min(completedCount, 7) : 0;

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e8ebe4] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1b4332] flex items-center gap-2">
            <CheckSquare className="w-8 h-8 text-[#52796f]" /> Garden Task Calendar
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Actionable daily steps and screen-free outdoor missions connecting you with your garden.
          </p>
        </div>

        {tasks.length > 0 && (
          <button
            onClick={resetAllTasks}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-600 hover:text-red-700 hover:bg-gray-50 self-start md:self-auto transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Week
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="garden-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#bc6c25] flex items-center justify-center">
            <Flame className="w-6 h-6 text-[#bc6c25]" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#1b4332]">{streakDays} Day{streakDays === 1 ? '' : 's'}</span>
            <p className="text-xs text-gray-500 font-medium">Outdoor Garden Streak</p>
          </div>
        </div>

        <div className="garden-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Sun className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#1b4332]">{totalOutdoorMins} Mins</span>
            <p className="text-xs text-gray-500 font-medium">Screen-Free Outdoor Time</p>
          </div>
        </div>

        <div className="garden-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#1b4332]">{completedCount} / {tasks.length || 7}</span>
            <p className="text-xs text-gray-500 font-medium">Weekly Tasks Completed</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e8ebe4] pb-3">
        {(['all', 'pending', 'completed'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setFilter(mode)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              filter === mode
                ? 'bg-[#1b4332] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-[#f4f4ea]'
            }`}
          >
            {mode} ({mode === 'all' ? tasks.length : mode === 'pending' ? tasks.length - completedCount : completedCount})
          </button>
        ))}
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="garden-card p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#2d6a4f]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-[#1b4332] text-lg">No active garden plan found</h3>
            <p className="text-xs text-gray-500">
              Generate your personalized weekly plan to unlock your 7-day outdoor calendar.
            </p>
          </div>
          <Link
            href="/planner"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f]"
          >
            Generate Garden Plan <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const isDone = !!completedTasks[task.id];
            return (
              <div
                key={task.id}
                className={`garden-card p-6 border transition-all ${
                  isDone
                    ? 'bg-[#f8faf8] border-emerald-200'
                    : 'bg-white border-[#e8ebe4] hover:border-[#84a98c]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-1 p-1 text-gray-400 hover:text-emerald-700 transition-colors focus:outline-none"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300" />
                      )}
                    </button>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1b4332] text-white">
                          {task.day_label}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {task.estimated_minutes} mins
                        </span>
                        {isDone && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Completed ✓
                          </span>
                        )}
                      </div>

                      <h3 className={`text-lg font-bold ${isDone ? 'line-through text-gray-500' : 'text-[#1b4332]'}`}>
                        {task.title}
                      </h3>

                      <p className={`text-xs leading-relaxed ${isDone ? 'text-gray-500' : 'text-gray-700'}`}>
                        {task.description}
                      </p>

                      {/* Screen-Free Outdoor Mission */}
                      <div className="mt-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                        <span className="font-bold flex items-center gap-1.5 text-[#bc6c25]">
                          Outdoor Observation Mission:
                        </span>
                        <p className="italic leading-relaxed">{task.outdoor_mission}</p>
                      </div>

                      {task.materials && task.materials.length > 0 && (
                        <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
                          <span className="font-semibold text-gray-700">Supplies:</span>
                          {task.materials.map((m, idx) => (
                            <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded-md">
                              {m}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:self-center shrink-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isDone
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-[#1b4332] text-white hover:bg-[#2d6a4f]'
                      }`}
                    >
                      {isDone ? 'Undo' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
