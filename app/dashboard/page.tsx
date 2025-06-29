"use client";
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../utils/firebase";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import Navbar from "../components/Navbar";
import DashboardOverview from "../components/DashboardOverview";
import PlantDoctor from "../components/PlantDoctor";
import ElevenLabsWidget from "../components/ElevenLabsWidget";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent, 
  DASHBOARD_TABS 
} from "../components/DashboardTabs";
import {
  BarChart3,
  Leaf,
  TrendingUp,
  Calendar,
  Activity
} from "lucide-react";
import { useLanguage } from "../components/LanguageProvider";
import { useTranslation } from "../utils/translation";

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth(app);
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        router.push("/signin");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">
            {language === 'hi' ? 'आपका डैशबोर्ड लोड हो रहा है...' : 'Loading your dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-secondary">
      <Navbar user={user} />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <Tabs defaultTab={DASHBOARD_TABS.OVERVIEW}>
            <TabsList>
              <TabsTrigger 
                id={DASHBOARD_TABS.OVERVIEW} 
                label={t('dashboard.overview')}
                icon={<BarChart3 className="w-5 h-5" />}
              />
              <TabsTrigger 
                id={DASHBOARD_TABS.PLANT_DOCTOR} 
                label={t('dashboard.plant_doctor')}
                icon={<Leaf className="w-5 h-5" />}
              />
              <TabsTrigger 
                id={DASHBOARD_TABS.ANALYTICS} 
                label={t('dashboard.analytics')}
                icon={<TrendingUp className="w-5 h-5" />}
              />
              <TabsTrigger 
                id={DASHBOARD_TABS.TASKS} 
                label={t('dashboard.tasks')}
                icon={<Calendar className="w-5 h-5" />}
              />
            </TabsList>

            <TabsContent id={DASHBOARD_TABS.OVERVIEW}>
              <DashboardOverview />
            </TabsContent>

            <TabsContent id={DASHBOARD_TABS.PLANT_DOCTOR}>
              <PlantDoctor />
            </TabsContent>

            <TabsContent id={DASHBOARD_TABS.ANALYTICS}>
              <div className="bg-background-primary rounded-xl p-8 shadow-md text-center border border-brand-accent/20">
                <TrendingUp className="w-16 h-16 text-brand-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  {t('dashboard.analytics_coming_soon')}
                </h3>
                <p className="text-text-secondary">
                  {t('dashboard.analytics_description')}
                </p>
              </div>
            </TabsContent>

            <TabsContent id={DASHBOARD_TABS.TASKS}>
              <div className="bg-background-primary rounded-xl p-8 shadow-md text-center border border-brand-accent/20">
                <Calendar className="w-16 h-16 text-brand-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  {t('dashboard.task_management_coming_soon')}
                </h3>
                <p className="text-text-secondary">
                  {t('dashboard.task_management_description')}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* ElevenLabs ConvAI Widget - Chatbot Assistant */}
      <ElevenLabsWidget 
        agentId={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "your-agent-id"} 
      />
    </div>
  );
};

export default DashboardPage;
