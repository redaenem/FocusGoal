'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, Priority, Category } from '@/lib/store';
import { Plus, X, Calendar, Tag, AlertCircle, Trash2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

export const GoalsView: React.FC = () => {
  const { goals, addGoal, deleteGoal, updateGoal } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    category: 'work' as Category,
    priority: 'medium' as Priority,
  });

  const handleAdd = () => {
    if (!newGoal.title) return;
    addGoal({
      ...newGoal,
      tasks: []
    });
    setIsAdding(false);
    setNewGoal({
      title: '',
      description: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      category: 'work',
      priority: 'medium',
    });
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Metas</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="w-10 h-10 rounded-full bg-[#6C63FF] flex items-center justify-center shadow-lg shadow-[#6C63FF]/20"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {goals.map((goal) => {
          const daysLeft = differenceInDays(new Date(goal.endDate), new Date());
          
          return (
            <motion.div
              key={goal.id}
              layout
              className="bg-[#1a1a1a] p-5 rounded-3xl border border-white/5 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6C63FF]">
                      {goal.category}
                    </span>
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      goal.priority === 'high' ? "bg-[#FF5252]" : 
                      goal.priority === 'medium' ? "bg-orange-400" : "bg-[#00C853]"
                    )} />
                  </div>
                  <h3 className="text-lg font-bold">{goal.title}</h3>
                </div>
                <button 
                  onClick={() => deleteGoal(goal.id)}
                  className="text-white/20 hover:text-[#FF5252] transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#b3b3b3]">Progresso</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    className="h-full bg-[#6C63FF]"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2 text-[#b3b3b3]">
                  <Calendar size={14} />
                  <span className="text-xs">{daysLeft > 0 ? `${daysLeft} dias restantes` : 'Prazo encerrado'}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={goal.progress}
                  onChange={(e) => updateGoal(goal.id, { progress: parseInt(e.target.value) })}
                  className="w-24 accent-[#6C63FF]"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-[#1a1a1a] w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 border border-white/10 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Nova Meta</h2>
                <button onClick={() => setIsAdding(false)} className="text-[#b3b3b3]">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#b3b3b3]">Título</label>
                  <input
                    type="text"
                    placeholder="Ex: Estudar Programação"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-[#6C63FF] transition-colors"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#b3b3b3]">Início</label>
                    <input
                      type="date"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-[#6C63FF] transition-colors text-sm"
                      value={newGoal.startDate}
                      onChange={(e) => setNewGoal({ ...newGoal, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#b3b3b3]">Fim</label>
                    <input
                      type="date"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-[#6C63FF] transition-colors text-sm"
                      value={newGoal.endDate}
                      onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#b3b3b3]">Categoria</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-[#6C63FF] transition-colors text-sm appearance-none"
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Category })}
                    >
                      <option value="work">Trabalho</option>
                      <option value="study">Estudo</option>
                      <option value="health">Saúde</option>
                      <option value="personal">Pessoal</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#b3b3b3]">Prioridade</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-[#6C63FF] transition-colors text-sm appearance-none"
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as Priority })}
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="w-full bg-[#6C63FF] text-white font-bold p-5 rounded-2xl shadow-lg shadow-[#6C63FF]/30 active:scale-95 transition-transform"
              >
                Criar Meta
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
