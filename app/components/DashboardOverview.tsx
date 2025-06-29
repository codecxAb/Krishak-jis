"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Calendar,
  Wheat,
  Droplets,
  Thermometer,
  Award,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  Leaf,
  Sun,
  CloudRain,
  BarChart3,
  PieChart as PieChartIcon,
  AlertTriangle,
  CheckCircle,
  Zap,
  Users,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  Sprout,
  FileText,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from './LanguageProvider';
import { useTranslation } from '../utils/translation';

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Hardcoded user data for demonstration
const hardcodedUserData = {
  name: "Rajesh Kumar",
  location: "Amritsar, Punjab",
  farmSize: "15.5 acres",
  primaryCrop: "Wheat",
  joinedDate: "March 2023",
  avatar: "/logo1.jpeg",
  totalProfit: "₹2,45,000",
  monthlyGrowth: "+12.5%",
  cropsGrown: 8,
  activeSeason: "Rabi",
};

// Sample data for charts
const cropYieldData = [
  { month: "Jan", wheat: 45, rice: 30, corn: 25 },
  { month: "Feb", wheat: 52, rice: 35, corn: 28 },
  { month: "Mar", wheat: 48, rice: 32, corn: 30 },
  { month: "Apr", wheat: 55, rice: 40, corn: 35 },
  { month: "May", wheat: 60, rice: 45, corn: 40 },
  { month: "Jun", wheat: 58, rice: 48, corn: 42 },
];

const soilHealthData = [
  { name: "Nitrogen", value: 75, color: "#10B981" },
  { name: "Phosphorus", value: 68, color: "#3B82F6" },
  { name: "Potassium", value: 82, color: "#8B5CF6" },
  { name: "pH Level", value: 7.2, color: "#F59E0B" },
];

const revenueData = [
  { month: "Jan", revenue: 45000, expenses: 28000 },
  { month: "Feb", revenue: 52000, expenses: 30000 },
  { month: "Mar", revenue: 48000, expenses: 29000 },
  { month: "Apr", revenue: 65000, expenses: 35000 },
  { month: "May", revenue: 70000, expenses: 38000 },
  { month: "Jun", revenue: 75000, expenses: 40000 },
];

const upcomingTasks = [
  { id: 1, task: "Wheat harvesting", date: "Next week", priority: "high" },
  { id: 2, task: "Soil testing", date: "In 3 days", priority: "medium" },
  { id: 3, task: "Irrigation maintenance", date: "Tomorrow", priority: "high" },
  { id: 4, task: "Fertilizer application", date: "In 5 days", priority: "low" },
];

const weatherData = [
  { day: "Mon", temp: 28, humidity: 65 },
  { day: "Tue", temp: 30, humidity: 70 },
  { day: "Wed", temp: 32, humidity: 68 },
  { day: "Thu", temp: 29, humidity: 72 },
  { day: "Fri", temp: 27, humidity: 75 },
  { day: "Sat", temp: 31, humidity: 69 },
  { day: "Sun", temp: 33, humidity: 64 },
];

const CHART_COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"];

const DashboardOverview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  useEffect(() => {
    if (containerRef.current) {
      // GSAP animations
      const tl = gsap.timeline();
      
      // Header animation
      tl.fromTo(
        ".hero-section",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      // Stats cards animation
      tl.fromTo(
        ".stats-card",
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.5"
      );

      // Charts animation
      tl.fromTo(
        ".chart-container",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // Quick actions animation
      tl.fromTo(
        ".quick-action",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.5"
      );
    }
  }, []);

  return (
    <div ref={containerRef}>
      {/* Hero Section */}
      <div className="hero-section mb-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4 mb-6">
            <img
              src={hardcodedUserData.avatar}
              alt="User Avatar"
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
            />
            <div className="text-left">
              <h1 className="text-4xl font-bold text-text-primary">
                Welcome back, {hardcodedUserData.name}!
              </h1>
              <p className="text-lg text-gray-600 flex items-center gap-2 mt-2">
                <MapPin className="w-5 h-5" />
                {hardcodedUserData.location} • {hardcodedUserData.farmSize}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {hardcodedUserData.joinedDate}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="stats-card bg-background-primary rounded-xl p-6 shadow-md border border-brand-accent/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-accent/10 rounded-lg">
                <DollarSign className="w-8 h-8 text-brand-primary" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Total Profit</p>
                <p className="text-2xl font-bold text-text-primary">{hardcodedUserData.totalProfit}</p>
                <p className="text-sm text-brand-primary flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  {hardcodedUserData.monthlyGrowth}
                </p>
              </div>
            </div>
          </div>

          <div className="stats-card bg-background-primary rounded-xl p-6 shadow-md border border-brand-accent/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-accent/10 rounded-lg">
                <Wheat className="w-8 h-8 text-brand-primary" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Primary Crop</p>
                <p className="text-2xl font-bold text-text-primary">{hardcodedUserData.primaryCrop}</p>
                <p className="text-sm text-brand-accent">Active Season: {hardcodedUserData.activeSeason}</p>
              </div>
            </div>
          </div>

          <div className="stats-card bg-background-primary rounded-xl p-6 shadow-md border border-brand-accent/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-accent/10 rounded-lg">
                <Sprout className="w-8 h-8 text-brand-primary" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Crops Grown</p>
                <p className="text-2xl font-bold text-text-primary">{hardcodedUserData.cropsGrown}</p>
                <p className="text-sm text-brand-accent">This year</p>
              </div>
            </div>
          </div>

          <div className="stats-card bg-background-primary rounded-xl p-6 shadow-md border border-brand-accent/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-accent/10 rounded-lg">
                <Activity className="w-8 h-8 text-brand-primary" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Farm Health</p>
                <p className="text-2xl font-bold text-text-primary">Excellent</p>
                <p className="text-sm text-brand-primary flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  All systems good
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority CTA - Get Recommendations */}
      <div className="mb-12">
        <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-8 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-text-primary">Ready for your next crop?</h2>
              <p className="text-lg text-text-secondary mb-4">
                Get personalized crop recommendations based on your farm conditions
              </p>
              <Link href="/recomendation">
                <button className="bg-brand-primary text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-brand-primary/90 transition-all duration-300 shadow-md">
                  Get Recommendations →
                </button>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="p-6 bg-brand-accent/20 rounded-lg">
                <Target className="w-16 h-16 text-brand-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Crop Yield Chart */}
        <div className="chart-container bg-background-primary rounded-xl p-6 shadow-md border border-brand-accent/20">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-primary" />
            Crop Yield Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={cropYieldData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="wheat"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="rice"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="corn"
                stackId="1"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="chart-container bg-background-primary rounded-xl p-6 shadow-md border border-brand-accent/20">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-brand-primary" />
            Revenue vs Expenses
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10B981" name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Soil Health */}
        <div className="chart-container bg-background-primary rounded-xl p-6 shadow-md border border-brand-accent/20">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <PieChartIcon className="w-6 h-6 text-brand-primary" />
            Soil Health Metrics
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={soilHealthData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}${name === 'pH Level' ? '' : '%'}`}
              >
                {soilHealthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weather Forecast */}
        <div className="chart-container bg-background-primary rounded-xl p-6 shadow-md border border-brand-accent/20">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Sun className="w-6 h-6 text-brand-primary" />
            Weather Forecast
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weatherData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#F59E0B"
                strokeWidth={3}
                name="Temperature (°C)"
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#3B82F6"
                strokeWidth={3}
                name="Humidity (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Quick Actions */}
        <div className="bg-background-primary rounded-xl p-6 shadow-md border border-brand-accent/20">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-brand-primary" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/voice-agent">
              <div className="quick-action p-4 bg-brand-accent/10 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer group border border-brand-accent/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-primary rounded-lg group-hover:scale-110 transition-transform">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-brand-primary">AI Assistant</span>
                </div>
              </div>
            </Link>

            <div className="quick-action p-4 bg-brand-accent/10 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer group border border-brand-accent/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-primary rounded-lg group-hover:scale-110 transition-transform">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-brand-primary">Irrigation</span>
              </div>
            </div>

            <div className="quick-action p-4 bg-brand-accent/10 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer group border border-brand-accent/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-primary rounded-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-brand-primary">Reports</span>
              </div>
            </div>

            <div className="quick-action p-4 bg-brand-accent/10 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer group border border-brand-accent/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-primary rounded-lg group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-brand-primary">Calendar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-background-primary rounded-xl p-6 shadow-md border border-brand-accent/20">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-brand-primary" />
            Upcoming Tasks
          </h3>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-background-secondary rounded-lg hover:bg-brand-accent/5 transition-colors border border-brand-accent/10"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      task.priority === "high"
                        ? "bg-red-500"
                        : task.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-brand-primary"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-text-primary">{task.task}</p>
                    <p className="text-sm text-text-secondary">{task.date}</p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.priority === "high"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : task.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                      : "bg-brand-accent/20 text-brand-primary border border-brand-accent/30"
                  }`}
                >
                  {task.priority}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
