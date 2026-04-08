'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '@/lib/store';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Target, CheckCircle2, Clock } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { goals, checklists, focusSessions } = useStore();
  
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  
  const activeGoals = goals.filter(g => g.endDate >= todayStr);
  const completedGoals = goals.filter(g => g.progress === 100).length;
  
  const totalTasks = checklists.reduce((acc, c) => acc + c.tasks.length, 0);
  const completedTasks = checklists.reduce((acc, c) => acc + c.tasks.filter(t => t.completed).length, 0);
  
  const todayFocusTime = focusSessions
    .filter(s => s.timestamp.startsWith(todayStr))
    .reduce((acc, s) => acc + s.duration, 0);

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h${m}m` : `${m}m`;
  };

  return (
    <div className="space-y-8 pb-24">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">FocusGoal</h1>
        <p className="text-[#b3b3b3] text-sm">
          {format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a1a] p-6 rounded-3xl border border-white/5 space-y-4"
        >
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#6C63FF]" />
            Progresso de Hoje
          </h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] text-[#b3b3b3] uppercase tracking-wider">Metas</p>
              <p className="text-xl font-bold">{completedGoals}/{goals.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-[#b3b3b3] uppercase tracking-wider">Tarefas</p>
              <p className="text-xl font-bold">{completedTasks}/{totalTasks}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-[#b3b3b3] uppercase tracking-wider">Foco</p>
              <p className="text-xl font-bold">{formatTime(todayFocusTime)}</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Metas Ativas</h2>
          <span className="text-xs text-[#6C63FF] font-medium">{activeGoals.length} ativas</span>
        </div>
        
        <div className="space-y-3">
          {activeGoals.length > 0 ? (
            activeGoals.slice(0, 3).map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#1a1a1a] p-4 rounded-2xl border border-white/5 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <h3 className="font-medium">{goal.title}</h3>
                  <p className="text-xs text-[#b3b3b3]">Até {format(new Date(goal.endDate), 'dd/MM')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold">{goal.progress}%</p>
                    <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                      <div 
                        className="h-full bg-[#6C63FF] transition-all duration-500" 
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-[#b3b3b3] py-4 text-center">Nenhuma meta ativa para hoje.</p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Tarefas Pendentes</h2>
        <div className="space-y-3">
          {checklists.flatMap(c => c.tasks).filter(t => !t.completed).length > 0 ? (
            checklists.flatMap(c => c.tasks).filter(t => !t.completed).slice(0, 5).map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#1a1a1a] p-4 rounded-2xl border border-white/5 flex items-center gap-4"
              >
                <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{task.name}</h3>
                  {task.deadline && (
                    <p className="text-[10px] text-[#b3b3b3] mt-0.5">{task.deadline}</p>
                  )}
                </div>
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  task.priority === 'high' ? "bg-[#FF5252]" : 
                  task.priority === 'medium' ? "bg-orange-400" : "bg-[#00C853]"
                )} />
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-[#b3b3b3] py-4 text-center">Tudo limpo por aqui!</p>
          )}
        </div>
      </section>
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
