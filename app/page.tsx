'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation } from '@/components/Navigation';
import { HomeView } from '@/components/Home';
import { GoalsView } from '@/components/Goals';
import { ChecklistView } from '@/components/Checklist';
import { FocusView } from '@/components/Focus';

export default function Page() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    
    // Request notification permission
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <HomeView />;
      case 'metas': return <GoalsView />;
      case 'checklist': return <ChecklistView />;
      case 'foco': return <FocusView />;
      default: return <HomeView />;
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white selection:bg-[#6C63FF]/30">
      <div className="max-w-md mx-auto px-6 pt-12 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* PWA Install Prompt (Simplified) */}
      <InstallPrompt />
    </main>
  );
}

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-28 left-6 right-6 bg-[#6C63FF] p-4 rounded-2xl flex items-center justify-between shadow-2xl shadow-[#6C63FF]/40 z-[100]"
    >
      <div className="flex-1">
        <p className="text-sm font-bold">Instalar FocusGoal</p>
        <p className="text-[10px] opacity-80">Acesse mais rápido do seu celular</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setShow(false)} className="px-3 py-2 text-xs font-bold opacity-60">Agora não</button>
        <button onClick={handleInstall} className="bg-white text-[#6C63FF] px-4 py-2 rounded-xl text-xs font-bold">Instalar</button>
      </div>
    </motion.div>
  );
}
