"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Leaf, 
  TrendingUp, 
  Calendar,
  Activity
} from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { useTranslation } from '../utils/translation';

interface TabsProps {
  children: React.ReactNode;
  defaultTab?: string;
}

interface TabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextType>({
  activeTab: '',
  setActiveTab: () => {},
});

export const Tabs: React.FC<TabsProps> = ({ children, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || '');

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="w-full">
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-wrap gap-2 mb-8 bg-background-primary p-2 rounded-xl shadow-md border border-brand-accent/20">
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<{ id: string; label: string; icon: React.ReactNode }> = ({ 
  id, 
  label, 
  icon 
}) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  const isActive = activeTab === id;
  
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`relative flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
        isActive
          ? 'bg-brand-primary text-white shadow-md'
          : 'text-text-secondary hover:text-text-primary hover:bg-brand-accent/10'
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

export const TabsContent: React.FC<{ id: string; children: React.ReactNode }> = ({ 
  id, 
  children 
}) => {
  const { activeTab } = React.useContext(TabsContext);
  
  if (activeTab !== id) return null;
  
  return (
    <div className="w-full">
      {children}
    </div>
  );
};

export const DASHBOARD_TABS = {
  OVERVIEW: 'overview',
  PLANT_DOCTOR: 'plant-doctor',
  ANALYTICS: 'analytics',
  TASKS: 'tasks',
} as const;
