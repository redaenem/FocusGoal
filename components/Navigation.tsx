'use client';

import React from 'react';
import { Home, Target, CheckSquare, Timer } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'metas', label: 'Metas', icon: Target },
  { id: 'checklist', label: 'Checklist', icon: CheckSquare },
  { id: 'foco', label: 'Foco', icon: Timer },
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a]/80 backdrop-blur-lg border-t border-white/5 px-6 pb-8 pt-3 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex flex-col items-center gap-1 transition-colors duration-300",
                isActive ? "text-[#6C63FF]" : "text-[#b3b3b3] hover:text-white"
              )}
            >
              <Icon size={24} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-3 w-12 h-1 bg-[#6C63FF] rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
