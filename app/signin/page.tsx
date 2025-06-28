"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import Head from "next/head";
import Image from "next/image";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "../utils/firebase";
import { useRouter } from "next/navigation";

const auth = getAuth(app);

const handleGoogleSignIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const LoginPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/recomendation");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Type motion components
  const MotionDiv: any = motion.div;
  const MotionButton: any = motion.button;
  const MotionH1: any = motion.h1;
  const MotionP: any = motion.p;

  return (
    <div className="flex min-h-screen bg-brand-primary text-white overflow-hidden">
      <Head>
        <title>Login | Krishak</title>
        <meta
          name="description"
          content="Login to Krishak agriculture crop recommendation system"
        />
      </Head>

      {/* Background Pattern - Same as hero section */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-green-fibers.png')` }}></div>

      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 relative z-10">
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <MotionDiv
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <Image
                  src="/logo1.jpeg"
                  alt="Krishak Logo"
                  width={100}
                  height={100}
                  className="mx-auto rounded-full shadow-2xl border-4 border-white/20"
                  priority
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent to-white/30 rounded-full blur opacity-30"></div>
              </div>
            </MotionDiv>
            <MotionH1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl font-extrabold mb-3 text-white drop-shadow-lg"
            >
              Welcome to Krishak
            </MotionH1>
            <MotionP
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-white/80 leading-relaxed"
            >
              Your intelligent farming companion for smarter agriculture
            </MotionP>
          </div>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30"></div>
              </div>
              <div className="relative flex justify-center text-base">
                <span className="px-4 bg-brand-primary text-white/70 font-medium">
                  Sign in to continue
                </span>
              </div>
            </div>

            <MotionButton
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-2xl transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-3 group border border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FaGoogle className="text-red-500 text-xl relative z-10" />
              <span className="text-lg relative z-10">Sign in with Google</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </MotionButton>

            <MotionP
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center text-white/60 text-sm mt-6 leading-relaxed"
            >
              By signing in, you agree to our Terms of Service and Privacy Policy
            </MotionP>
          </MotionDiv>
        </MotionDiv>
      </div>

      {/* Right side - Image with green tint overlay */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <MotionDiv
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Green filter overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/80 via-brand-primary/70 to-brand-primary/60 z-20"></div>
          
          {/* Additional darker green overlay for enhanced text contrast */}
          <div className="absolute inset-0 bg-brand-primary/40 z-21"></div>
          
          {/* Optimized Image with priority loading */}
          <Image
            src="/signin.jpg"
            alt="Agriculture Field"
            fill
            sizes="50vw"
            className="object-cover"
            priority
            quality={85}
          />

          {/* Content overlay */}
          <div className="absolute inset-0 z-40 flex flex-col justify-center items-center p-12 text-center">
            <MotionDiv
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-lg"
            >
              <h2 className="text-5xl font-extrabold mb-6 text-white drop-shadow-2xl leading-tight">
                Grow Smarter With Data
              </h2>
              <p className="text-xl text-white/90 mb-10 leading-relaxed drop-shadow-lg">
                Get personalized crop recommendations based on soil conditions, climate data, and market trends for maximum profitability.
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { icon: "📊", label: "Data-driven", desc: "AI Analytics" },
                  { icon: "🌱", label: "Sustainable", desc: "Eco-friendly" },
                  { icon: "💰", label: "Profitable", desc: "Max Returns" }
                ].map((item, i) => (
                  <MotionDiv
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                    className="flex flex-col items-center group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:bg-white/30 transition-all duration-300 border border-white/30">
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <span className="text-white font-semibold text-sm mb-1">{item.label}</span>
                    <span className="text-white/70 text-xs">{item.desc}</span>
                  </MotionDiv>
                ))}
              </div>
            </MotionDiv>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-brand-accent/20 rounded-full blur-3xl z-10"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl z-10"></div>
        </MotionDiv>
      </div>
    </div>
  );
};

export default LoginPage;
