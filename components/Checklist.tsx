'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, Priority } from '@/lib/store';
import { Plus, X, Check, Trash2, Filter } from 'lucide-react';

export const ChecklistView: React.FC = () => {
  const { checklists, addChecklist, deleteChecklist, toggleTask, addTaskToChecklist, removeTaskFromChecklist } = useStore();
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState('');

  const handleAddList = () => {
    if (!newListTitle) return;
    addChecklist({ title: newListTitle, tasks: [] });
    setNewListTitle('');
    setIsAddingList(false);
  };

  const handleAddTask = (listId: string) => {
    if (!newTaskName) return;
    addTaskToChecklist(listId, {
      name: newTaskName,
      priority: 'medium',
    });
    setNewTaskName('');
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Checklist</h1>
        <button
          onClick={() => setIsAddingList(true)}
          className="w-10 h-10 rounded-full bg-[#6C63FF] flex items-center justify-center shadow-lg shadow-[#6C63FF]/20"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="space-y-6">
        {checklists.map((list) => (
          <motion.div
            key={list.id}
            layout
            className="bg-[#1a1a1a] rounded-3xl border border-white/5 overflow-hidden"
          >
            <div className="p-5 flex justify-between items-center bg-white/5">
              <h3 className="font-bold text-lg">{list.title}</h3>
              <button 
                onClick={() => deleteChecklist(list.id)}
                className="text-white/20 hover:text-[#FF5252] transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              {list.tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  className="flex items-center gap-4 group"
                >
                  <button
                    onClick={() => toggleTask(list.id, task.id)}
                    className={cn(
                      "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                      task.completed 
                        ? "bg-[#00C853] border-[#00C853]" 
                        : "border-white/20 hover:border-[#6C63FF]"
                    )}
                  >
                    {task.completed && <Check size={14} className="text-white" />}
                  </button>
                  <span className={cn(
                    "flex-1 text-sm transition-all duration-300",
                    task.completed ? "text-[#b3b3b3] line-through" : "text-white"
                  )}>
                    {task.name}
                  </span>
                  <button
                    onClick={() => removeTaskFromChecklist(list.id, task.id)}
                    className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-[#FF5252] transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}

              <div className="pt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Nova tarefa..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#6C63FF]"
                  value={activeListId === list.id ? newTaskName : ''}
                  onFocus={() => setActiveListId(list.id)}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask(list.id)}
                />
                <button
                  onClick={() => handleAddTask(list.id)}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAddingList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a1a] w-full max-w-sm rounded-[40px] p-8 border border-white/10 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Nova Lista</h2>
                <button onClick={() => setIsAddingList(false)} className="text-[#b3b3b3]">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#b3b3b3]">Nome da Lista</label>
                  <input
                    type="text"
                    placeholder="Ex: Compras, Trabalho..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-[#6C63FF] transition-colors"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              <button
                onClick={handleAddList}
                className="w-full bg-[#6C63FF] text-white font-bold p-5 rounded-2xl shadow-lg shadow-[#6C63FF]/30 active:scale-95 transition-transform"
              >
                Criar Lista
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
