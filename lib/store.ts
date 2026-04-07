import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Priority = 'low' | 'medium' | 'high';
export type Category = 'study' | 'health' | 'work' | 'personal';

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  deadline?: string;
  priority: Priority;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  category: Category;
  priority: Priority;
  progress: number; // 0 to 100
  tasks: Task[];
}

export interface Checklist {
  id: string;
  title: string;
  tasks: Task[];
}

export interface FocusSession {
  id: string;
  duration: number; // in minutes
  timestamp: string;
}

interface AppState {
  goals: Goal[];
  checklists: Checklist[];
  focusSessions: FocusSession[];
  
  // Actions
  addGoal: (goal: Omit<Goal, 'id' | 'progress'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  addChecklist: (checklist: Omit<Checklist, 'id'>) => void;
  updateChecklist: (id: string, updates: Partial<Checklist>) => void;
  deleteChecklist: (id: string) => void;
  
  addFocusSession: (session: Omit<FocusSession, 'id'>) => void;
  
  toggleTask: (checklistId: string, taskId: string) => void;
  addTaskToChecklist: (checklistId: string, task: Omit<Task, 'id' | 'completed'>) => void;
  removeTaskFromChecklist: (checklistId: string, taskId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      goals: [],
      checklists: [],
      focusSessions: [],

      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { ...goal, id: crypto.randomUUID(), progress: 0 }]
      })),

      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map((g) => g.id === id ? { ...g, ...updates } : g)
      })),

      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id)
      })),

      addChecklist: (checklist) => set((state) => ({
        checklists: [...state.checklists, { ...checklist, id: crypto.randomUUID() }]
      })),

      updateChecklist: (id, updates) => set((state) => ({
        checklists: state.checklists.map((c) => c.id === id ? { ...c, ...updates } : c)
      })),

      deleteChecklist: (id) => set((state) => ({
        checklists: state.checklists.filter((c) => c.id !== id)
      })),

      addFocusSession: (session) => set((state) => ({
        focusSessions: [...state.focusSessions, { ...session, id: crypto.randomUUID() }]
      })),

      toggleTask: (checklistId, taskId) => set((state) => ({
        checklists: state.checklists.map((c) => {
          if (c.id === checklistId) {
            return {
              ...c,
              tasks: c.tasks.map((t) => t.id === taskId ? { ...t, completed: !t.completed } : t)
            };
          }
          return c;
        })
      })),

      addTaskToChecklist: (checklistId, task) => set((state) => ({
        checklists: state.checklists.map((c) => {
          if (c.id === checklistId) {
            return {
              ...c,
              tasks: [...c.tasks, { ...task, id: crypto.randomUUID(), completed: false }]
            };
          }
          return c;
        })
      })),

      removeTaskFromChecklist: (checklistId, taskId) => set((state) => ({
        checklists: state.checklists.map((c) => {
          if (c.id === checklistId) {
            return {
              ...c,
              tasks: c.tasks.filter((t) => t.id !== taskId)
            };
          }
          return c;
        })
      })),
    }),
    {
      name: 'focusgoal-storage',
    }
  )
);
