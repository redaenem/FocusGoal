'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/lib/store';
import { Play, Pause, RotateCcw, Clock, Trophy } from 'lucide-react';
import { format } from 'date-fns';

export const FocusView: React.FC = () => {
  const { addFocusSession, focusSessions } = useStore();
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(25 * 60);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Use a timeout to avoid synchronous state update in effect
      const timeoutId = setTimeout(() => {
        setIsActive(false);
        
        // Save session
        addFocusSession({
          duration: Math.floor(initialTime / 60),
          timestamp: new Date().toISOString(),
        });
        
        // Notify
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('FocusGoal', {
            body: 'Sessão de foco concluída! Hora de um descanso.',
            icon: 'https://picsum.photos/seed/focusgoal/192/192'
          });
        }
      }, 0);
      
      if (timerRef.current) clearInterval(timerRef.current);
      return () => clearTimeout(timeoutId);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, addFocusSession, initialTime]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const setDuration = (mins: number) => {
    setIsActive(false);
    setInitialTime(mins * 60);
    setTimeLeft(mins * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todaySessions = focusSessions.filter(s => s.timestamp.startsWith(todayStr));
  const totalTodayMins = todaySessions.reduce((acc, s) => acc + s.duration, 0);

  return (
    <div className="space-y-12 pb-24 flex flex-col items-center">
      <header className="w-full text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Foco</h1>
        <p className="text-[#b3b3b3] text-sm">Mantenha a concentração no que importa</p>
      </header>

      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Progress Circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="144"
            cy="144"
            r="130"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          <motion.circle
            cx="144"
            cy="144"
            r="130"
            fill="none"
            stroke="#6C63FF"
            strokeWidth="8"
            strokeDasharray="816.8"
            initial={{ strokeDashoffset: 816.8 }}
            animate={{ strokeDashoffset: 816.8 - (816.8 * progress) / 100 }}
            strokeLinecap="round"
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>

        <div className="text-center space-y-1 z-10">
          <span className="text-6xl font-black tracking-tighter tabular-nums">
            {formatTime(timeLeft)}
          </span>
          <p className="text-[#b3b3b3] text-xs font-bold uppercase tracking-widest">
            {isActive ? 'Focando...' : 'Pronto?'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={resetTimer}
          className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-[#b3b3b3] hover:text-white transition-colors"
        >
          <RotateCcw size={24} />
        </button>
        
        <button
          onClick={toggleTimer}
          className="w-20 h-20 rounded-full bg-[#6C63FF] flex items-center justify-center text-white shadow-xl shadow-[#6C63FF]/30 active:scale-95 transition-transform"
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>

        <div className="w-14 h-14" /> {/* Spacer for symmetry */}
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {[25, 45, 60].map((mins) => (
          <button
            key={mins}
            onClick={() => setDuration(mins)}
            className={cn(
              "py-3 rounded-2xl text-xs font-bold transition-all duration-300 border",
              initialTime === mins * 60 
                ? "bg-[#6C63FF]/10 border-[#6C63FF] text-[#6C63FF]" 
                : "bg-white/5 border-transparent text-[#b3b3b3] hover:bg-white/10"
            )}
          >
            {mins}m
          </button>
        ))}
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        <div className="bg-[#1a1a1a] p-5 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#6C63FF]/10 flex items-center justify-center text-[#6C63FF]">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] text-[#b3b3b3] uppercase font-bold tracking-wider">Hoje</p>
            <p className="text-lg font-bold">{totalTodayMins}m</p>
          </div>
        </div>
        <div className="bg-[#1a1a1a] p-5 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-400/10 flex items-center justify-center text-orange-400">
            <Trophy size={20} />
          </div>
          <div>
            <p className="text-[10px] text-[#b3b3b3] uppercase font-bold tracking-wider">Sessões</p>
            <p className="text-lg font-bold">{todaySessions.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
