"use client";

// pages/index.js or components/KrishakLandingPage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from "next/link"; // Changed from 'next/router'
import Navbar from "../components/Navbar";
import Image from "next/image";
import { HyperText } from "../components/HyperText";

// Lucide React Icons - Select appropriate ones based on design visual
import {
  Sun, Moon, /* Home, */ Leaf, BarChart, Settings, Phone, Mail, MapPin, CheckCircle,
  Lightbulb, TrendingUp, Handshake, ShieldCheck, Database, Rocket, Laptop,
  Feather, Globe, Compass, Users, Cloud, Monitor, Zap, PiggyBank, Scale,
  LineChart, Hand, Star, Sprout, Tractor, Droplet, Search, Bell, ClipboardList,
  Layers, Grid, FileText, LayoutGrid, Award, Briefcase, ChevronRight, PlayCircle
} from 'lucide-react';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// 3D Card Component
import React, { useRef } from "react";

function ThreeDCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 15; // max 15deg for more dramatic effect
    const rotateY = ((x - centerX) / centerX) * -15;
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05,1.05,1.05)`;
    // Glow effect: place on opposite side of mouse
    const glowX = rect.width - x;
    const glowY = rect.height - y;
    glow.style.background = `radial-gradient(circle at ${glowX}px ${glowY}px, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 50%, transparent 80%)`;
    glow.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (card) card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    if (glow) glow.style.opacity = '0';
  };

  return (
    <div
      ref={cardRef}
      className="relative bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ease-out cursor-pointer"
      style={{ 
        boxShadow: "0 25px 50px 0 rgba(34, 139, 34, 0.3), 0 15px 25px 0 rgba(0,0,0,0.2)",
        transformStyle: "preserve-3d",
        border: "1px solid rgba(255,255,255,0.1)"
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500"
        style={{ opacity: 0, mixBlendMode: "overlay" }}
      />
      <div className="relative z-20 flex flex-col items-center text-center">
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const MotionDiv: any = motion.div;
  const MotionButton: any = motion.button;
  const MotionSpan: any = motion.span;
  const MotionLi: any = motion.li;
  const MotionSection: any = motion.section;
  const MotionH2: any = motion.h2;
  const MotionP: any = motion.p;

  return (
    <div className="min-h-screen bg-background-primary text-text-primary transition-colors duration-500 overflow-hidden">
      <Navbar user={null} />

      {/* Hero Section */}
      <MotionDiv
        id="hero"
        className="relative flex items-center min-h-screen py-20 lg:py-24 text-white bg-brand-primary overflow-hidden"
      >
        {/* Background Pattern - adapting from design */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-green-fibers.png')` }}></div>
        {/* Main Content Layout */}
        <div className="container mx-auto px-6 z-10 flex flex-col lg:flex-row items-center lg:items-start lg:justify-between gap-12 lg:gap-16 pt-20 lg:pt-0">
          {/* Left Column: Text Content */}
          <MotionDiv
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="lg:w-1/2 text-center lg:text-left flex flex-col justify-center"
          >
            <MotionDiv variants={itemVariants} className="mb-8 mt-7">
              <h1 className="text-5xl lg:text-7xl xl:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
                <HyperText 
                  text="Smart Solutions" 
                  className="text-brand-accent font-extrabold"
                  duration={1000}
                  animateOnLoad={true}
                /> for Modern Farmers
              </h1>
            </MotionDiv>
            <MotionDiv variants={itemVariants} className="mb-10">
              <p className="text-xl lg:text-2xl text-white opacity-90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Krishak empowers you with data-driven insights and personalized recommendations to optimize yields and boost profitability.
              </p>
            </MotionDiv>
            <MotionDiv variants={itemVariants} className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6">
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-brand-accent hover:brightness-110 text-white font-bold py-4 px-10 rounded-xl shadow-xl transition-all duration-300 text-lg"
              >
                Get Recommendations
              </MotionButton>
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-brand-primary font-bold py-4 px-10 rounded-xl shadow-xl transition-all duration-300 hover:bg-gray-100 text-lg"
              >
                Contact Experts
              </MotionButton>
            </MotionDiv>
          </MotionDiv>
          
          {/* Right Column: Hero Image with 3D Effect */}
          <MotionDiv
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:w-1/2 flex justify-center lg:justify-end md:mt-14"
          >
            <div className="relative max-w-3xl w-full">
              <ThreeDCard>
                <Image
                  src="/hero.png"
                  alt="Krishak App Hero"
                  width={1000}
                  height={750}
                  className="w-full h-auto rounded-2xl object-cover"
                  priority
                />
              </ThreeDCard>
            </div>
          </MotionDiv>
        </div>
      </MotionDiv>

      {/* Introduction/Highlight Section: "Part of future agriculture" */}
      <MotionDiv
        id="intro-highlight"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 md:py-24 bg-background-secondary"
      >
        <div className="container mx-auto px-6 text-center">
          <MotionSpan
            variants={itemVariants}
            className="block text-3xl lg:text-5xl font-extrabold mb-8 text-text-primary leading-tight"
          >
            Part of Future Agriculture: Empowering Farmers Today
          </MotionSpan>
          <MotionSpan
            variants={itemVariants}
            className="block text-lg lg:text-xl text-text-secondary max-w-3xl mx-auto mb-12"
          >
            Krishak brings cutting-edge technology to your fingertips, transforming traditional farming into a smart, sustainable, and highly profitable venture. Discover solutions that grow with you.
          </MotionSpan>
          {/* Cards - 3D effect with mouse interaction and glassy glow */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <ThreeDCard>
              <div className="p-10 text-center h-full flex flex-col justify-center items-center min-h-[320px]">
                <div className="mb-8">
                  <Layers className="w-24 h-24 text-brand-accent mx-auto" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-text-primary leading-tight">Smart Crop Selection</h3>
                  <p className="text-text-secondary text-base leading-relaxed px-2">Optimize your crop choices based on soil data, climate, and market trends for maximum profitability.</p>
                </div>
              </div>
            </ThreeDCard>
            <ThreeDCard>
              <div className="p-10 text-center h-full flex flex-col justify-center items-center min-h-[320px]">
                <div className="mb-8">
                  <BarChart className="w-24 h-24 text-brand-accent mx-auto" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-text-primary leading-tight">Precision Nutrient Management</h3>
                  <p className="text-text-secondary text-base leading-relaxed px-2">Get accurate fertilizer recommendations to ensure your crops receive exactly what they need, reducing waste.</p>
                </div>
              </div>
            </ThreeDCard>
            <ThreeDCard>
              <div className="p-10 text-center h-full flex flex-col justify-center items-center min-h-[320px]">
                <div className="mb-8">
                  <Lightbulb className="w-24 h-24 text-brand-accent mx-auto" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-text-primary leading-tight">Real-time Field Monitoring</h3>
                  <p className="text-text-secondary text-base leading-relaxed px-2">Leverage advanced analytics to monitor field conditions, pest outbreaks, and crop health proactively.</p>
                </div>
              </div>
            </ThreeDCard>
          </div>
        </div>
      </MotionDiv>

      {/* Features Section: "Elevates agricultural operations" */}
      <MotionDiv
        id="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 md:py-24 bg-background-primary"
      >
        <div className="container mx-auto px-6">
          <MotionSpan
            variants={itemVariants}
            className="block text-3xl lg:text-5xl font-extrabold mb-12 text-center text-text-primary leading-tight"
          >
            Elevating Agricultural Operations to New Heights
          </MotionSpan>
          {/* Feature Row 1: Image Left, Text Right */}
          <div className="flex flex-col lg:flex-row items-center justify-between mb-20 lg:mb-24">
            <MotionDiv variants={itemVariants} className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-16">
              <span className="text-2xl lg:text-4xl font-bold mb-4 text-brand-primary">Precision Farming with AI Insights</span>
              <span className="text-lg text-text-secondary mb-6 block">Utilize advanced AI algorithms to analyze soil health, weather patterns, and crop growth, providing you with unparalleled insights for every stage of cultivation.</span>
              <ul className="space-y-3 text-text-primary text-lg">
                <MotionLi variants={itemVariants} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-brand-accent flex-shrink-0" />
                  <span>Optimized Irrigation Schedules</span>
                </MotionLi>
                <MotionLi variants={itemVariants} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-brand-accent flex-shrink-0" />
                  <span>Early Disease Detection</span>
                </MotionLi>
                <MotionLi variants={itemVariants} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-brand-accent flex-shrink-0" />
                  <span>Smart Pest Management</span>
                </MotionLi>
              </ul>
            </MotionDiv>
            <MotionDiv variants={itemVariants} className="lg:w-1/2 flex justify-center lg:justify-end">
              <img
                src="https://placehold.co/600x400/EBF4E0/2A6B46?text=Precision+Farming"
                alt="Precision Farming Illustration"
                className="w-full max-w-xl rounded-2xl shadow-soft-xl object-cover"
              />
            </MotionDiv>
          </div>
          {/* Feature Row 2: Image Right, Text Left (Reversed order for design replication) */}
          <div className="flex flex-col lg:flex-row-reverse items-center justify-between">
            <MotionDiv variants={itemVariants} className="lg:w-1/2 mb-10 lg:mb-0 lg:pl-16">
              <span className="text-2xl lg:text-4xl font-bold mb-4 text-brand-primary">Data-Driven Decision Making</span>
              <span className="text-lg text-text-secondary mb-6 block">Access comprehensive reports and predictive analytics that simplify complex agricultural data, empowering you to make informed decisions confidently.</span>
              <ul className="space-y-3 text-text-primary text-lg">
                <MotionLi variants={itemVariants} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-brand-accent flex-shrink-0" />
                  <span>Yield Prediction & Analysis</span>
                </MotionLi>
                <MotionLi variants={itemVariants} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-brand-accent flex-shrink-0" />
                  <span>Market Trend Forecasting</span>
                </MotionLi>
                <MotionLi variants={itemVariants} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-brand-accent flex-shrink-0" />
                  <span>Resource Allocation Optimization</span>
                </MotionLi>
              </ul>
            </MotionDiv>
            <MotionDiv variants={itemVariants} className="lg:w-1/2 flex justify-center lg:justify-start">
              <img
                src="https://placehold.co/600x400/EBF4E0/2A6B46?text=Data+Driven+Decisions"
                alt="Data Driven Decisions Illustration"
                className="w-full max-w-xl rounded-2xl shadow-soft-xl object-cover"
              />
            </MotionDiv>
          </div>
        </div>
      </MotionDiv>

      {/* Why Krishak? Section: "Tested for reliability and durability" */}
      <MotionSection
        id="how-it-works"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 md:py-24 bg-background-secondary"
      >
        <div className="container mx-auto px-6 text-center">
          <MotionH2 variants={itemVariants} className="text-3xl lg:text-5xl font-extrabold mb-8 text-text-primary leading-tight">
            Why Krishak? Tested for Reliability and Durability
          </MotionH2>
          <MotionP variants={itemVariants} className="text-lg lg:text-xl text-text-secondary max-w-3xl mx-auto mb-12">
            We are committed to building trust with every farmer. Our solutions are rigorously tested in diverse agricultural conditions, ensuring they are robust, reliable, and deliver tangible results.
          </MotionP>

          {/* Feature Cards - 3 columns, similar to the design's middle section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MotionDiv variants={itemVariants} className="bg-background-primary p-8 rounded-2xl shadow-soft-md text-center flex flex-col items-center">
              <ShieldCheck className="w-16 h-16 text-brand-accent mb-4" />
              <h3 className="text-xl font-bold mb-2 text-text-primary">Proven Reliability</h3>
              <p className="text-text-secondary">Our platform has demonstrated consistent performance in various farming environments.</p>
            </MotionDiv>
            <MotionDiv variants={itemVariants} className="bg-background-primary p-8 rounded-2xl shadow-soft-md text-center flex flex-col items-center">
              <TrendingUp className="w-16 h-16 text-brand-accent mb-4" />
              <h3 className="text-xl font-bold mb-2 text-text-primary">Sustainable Growth</h3>
              <p className="text-text-secondary">Focused on methods that improve soil health and long-term farm productivity.</p>
            </MotionDiv>
            <MotionDiv variants={itemVariants} className="bg-background-primary p-8 rounded-2xl shadow-soft-md text-center flex flex-col items-center">
              <Handshake className="w-16 h-16 text-brand-accent mb-4" />
              <h3 className="text-xl font-bold mb-2 text-text-primary">Dedicated Support</h3>
              <p className="text-text-secondary">Our team of agricultural experts is always ready to assist you.</p>
            </MotionDiv>
          </div>
        </div>
      </MotionSection>

      {/* Explore Our Products/Solutions Section */}
      <MotionSection
        id="solutions"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 md:py-24 bg-background-primary"
      >
        <div className="container mx-auto px-6 text-center">
          <MotionH2 variants={itemVariants} className="text-3xl lg:text-5xl font-extrabold mb-8 text-text-primary leading-tight">
            Explore Our Diverse Agricultural Solutions
          </MotionH2>
          <MotionP variants={itemVariants} className="text-lg lg:text-xl text-text-secondary max-w-3xl mx-auto mb-12">
            From intelligent advisory systems to comprehensive farm management tools, Krishak offers a suite of products designed to meet every farmer's needs.
          </MotionP>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {/* Product Card 1 */}
            <MotionDiv variants={itemVariants} className="bg-background-secondary p-6 rounded-2xl shadow-soft-sm flex flex-col items-center text-center">
              <Tractor className="w-12 h-12 text-brand-accent mb-3" />
              <h3 className="text-lg font-semibold text-text-primary">Farm Management</h3>
            </MotionDiv>
            {/* Product Card 2 */}
            <MotionDiv variants={itemVariants} className="bg-background-secondary p-6 rounded-2xl shadow-soft-sm flex flex-col items-center text-center">
              <Droplet className="w-12 h-12 text-brand-accent mb-3" />
              <h3 className="text-lg font-semibold text-text-primary">Irrigation Optimization</h3>
            </MotionDiv>
            {/* Product Card 3 */}
            <MotionDiv variants={itemVariants} className="bg-background-secondary p-6 rounded-2xl shadow-soft-sm flex flex-col items-center text-center">
              <LineChart className="w-12 h-12 text-brand-accent mb-3" />
              <h3 className="text-lg font-semibold text-text-primary">Yield Analytics</h3>
            </MotionDiv>
            {/* Product Card 4 */}
            <MotionDiv variants={itemVariants} className="bg-background-secondary p-6 rounded-2xl shadow-soft-sm flex flex-col items-center text-center">
              <Database className="w-12 h-12 text-brand-accent mb-3" />
              <h3 className="text-lg font-semibold text-text-primary">Soil Intelligence</h3>
            </MotionDiv>
          </div>
        </div>
      </MotionSection>

      {/* News & Articles Section
      <MotionSection
        id="news"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 md:py-24 bg-background-secondary"
      >
        <div className="container mx-auto px-6">
          <MotionH2 variants={itemVariants} className="text-3xl lg:text-5xl font-extrabold mb-12 text-center text-text-primary leading-tight">
            Krishak Insights: News & Articles
          </MotionH2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Article Card 1 */}
            {/* <MotionDiv variants={itemVariants} className="bg-background-primary rounded-2xl shadow-soft-md overflow-hidden">
              <img
                src="https://placehold.co/600x350/EBF4E0/2A6B46?text=Farm+Innovation"
                alt="Farm Innovation"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-text-primary">Innovations in Vertical Farming</h3>
                <p className="text-text-secondary text-sm mb-4">June 20, 2024</p>
                <p className="text-text-secondary mb-4">Discover how vertical farming is transforming urban agriculture and its potential for sustainability.</p>
                <a href="#" className="text-brand-accent font-semibold hover:underline flex items-center">
                  Read More <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </MotionDiv> */}
            {/* Article Card 2 */}
            {/* <MotionDiv variants={itemVariants} className="bg-background-primary rounded-2xl shadow-soft-md overflow-hidden">
              <img
                src="https://placehold.co/600x350/EBF4E0/2A6B46?text=Crop+Health"
                alt="Crop Health"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-text-primary">The Future of Crop Health Monitoring</h3>
                <p className="text-text-secondary text-sm mb-4">June 15, 2024</p>
                <p className="text-text-secondary mb-4">Explore AI-driven techniques for early detection of crop diseases and nutrient deficiencies.</p>
                <a href="#" className="text-brand-accent font-semibold hover:underline flex items-center">
                  Read More <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </MotionDiv> */}
            {/* Article Card 3 */}
            {/* <MotionDiv variants={itemVariants} className="bg-background-primary rounded-2xl shadow-soft-md overflow-hidden">
              <img
                src="https://placehold.co/600x350/EBF4E0/2A6B46?text=Market+Insights"
                alt="Market Insights"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-text-primary">Market Trends Impacting Farmers</h3>
                <p className="text-text-secondary text-sm mb-4">June 10, 2024</p>
                <p className="text-text-secondary mb-4">An analysis of current market trends and how they might affect your crop prices and profits.</p>
                <a href="#" className="text-brand-accent font-semibold hover:underline flex items-center">
                  Read More <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </MotionDiv>
          </div>
        </div>
      </MotionSection> */}


      {/* CTA Banner: "Top model for agriculture" */}
      <MotionSection
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        className="py-16 md:py-24 bg-brand-primary text-white text-center relative overflow-hidden"
      >
        {/* Background Pattern - adapting from design's CTA */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-green-fibers.png')` }}></div>

        <div className="container mx-auto px-6 z-10">
          <MotionH2 variants={itemVariants} className="text-3xl lg:text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Ready to Cultivate Success? Join Krishak Today!
          </MotionH2>
          <MotionP variants={itemVariants} className="text-lg lg:text-xl opacity-90 max-w-3xl mx-auto mb-10">
            Unlock the full potential of your farm with smart, data-driven agriculture. It's time to grow smarter, not harder.
          </MotionP>
          <MotionButton
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-brand-accent hover:brightness-110 text-white font-bold py-4 px-10 rounded-xl text-xl shadow-xl transition-all duration-300"
          >
            Start Your Farming Journey
          </MotionButton>
        </div>
      </MotionSection>

      {/* Footer */}
      <footer id="contact" className="bg-background-secondary py-16 md:py-20 text-text-secondary">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo1.jpeg" alt="Krishak Logo" className="w-10 h-10 rounded-full" />
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">Empowering farmers with intelligent agricultural solutions for a prosperous future.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-text-primary">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="#features" className="hover:text-brand-accent transition-colors duration-200">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-brand-accent transition-colors duration-200">How It Works</Link></li>
              <li><Link href="#solutions" className="hover:text-brand-accent transition-colors duration-200">Solutions</Link></li>
              <li><Link href="#news" className="hover:text-brand-accent transition-colors duration-200">News</Link></li>
              <li><Link href="#" className="hover:text-brand-accent transition-colors duration-200">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-text-primary">Support</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-brand-accent transition-colors duration-200">FAQ</Link></li>
              <li><Link href="#contact" className="hover:text-brand-accent transition-colors duration-200">Support Contact</Link></li>
              <li><Link href="#" className="hover:text-brand-accent transition-colors duration-200">Documentation</Link></li>
              <li><Link href="#" className="hover:text-brand-accent transition-colors duration-200">Community</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-text-primary">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-brand-primary" />
                <span>info@krishak.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-brand-primary" />
                <span>+91 123456789</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-brand-primary mt-1" />
                <span>123 Kisan Marg, Krishi Nagar, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-6 border-t border-border-color mt-12 pt-8 text-center text-sm text-text-secondary">
          <p>© 2025 Krishak. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Removed getStaticProps as it's part of multilingual setup
// export async function getStaticProps({ locale }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ['common'])),
//       // Will be passed to the page component as props
//     },
//   };
// }
