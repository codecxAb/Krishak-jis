"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { User } from "firebase/auth";
import { useLanguage } from "./LanguageProvider";

interface NavbarProps {
  user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  // Get language context
  const { language, setLanguage, t } = useLanguage();

  const toggleMobileMenu = () => setMobileMenuOpen((v) => !v);

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      router.push("/home");
    });
  };

  return (
    <>
      <nav
        className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-6xl backdrop-blur-lg border-2 rounded-full px-4 py-2 flex justify-between items-center bg-background-secondary shadow-lg"
        style={{
          borderColor: "var(--current-border-color)",
          boxShadow: "0 4px 6px var(--current-shadow-color)",
          minHeight: 56,
          marginTop: 12,
        }}
      >
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo1.jpeg"
            width={40}
            height={40}
            className="rounded-full"
            alt="Krishak Logo"
            priority
          />
          <span className="font-bold text-xl text-text-primary">Krishak</span>
        </div>

        {/* Language Selector */}
        {/* <div className="hidden md:flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-brand-accent rounded-full px-3 py-1 text-brand-primary font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div> */}

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center text-text-primary">
          <Link
            href="/"
            className="hover:text-brand-accent transition-colors text-lg"
          >
            {t('nav.home', 'Home')}
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-brand-accent transition-colors text-lg"
          >
            {t('nav.dashboard', 'Dashboard')}
          </Link>
          <Link
            href="/recomendation"
            className="hover:text-brand-accent transition-colors text-lg"
          >
            {t('nav.recommendations', 'Recommendations')}
          </Link>
          {/* <Link
            href="/voice-agent"
            className="hover:text-brand-accent transition-colors text-lg"
          >
            🎤 {t('nav.voice_agent', 'Voice Assistant')}
          </Link> */}
          {user ? (
            <button
              onClick={handleLogout}
              className="hover:opacity-80 transition-colors text-red-400 text-lg"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/signin"
              className="font-bold bg-brand-accent rounded-full px-6 py-3 text-brand-primary text-base w-fit flex items-center gap-2"
            >
              {t('nav.sign_in', 'Sign In')}
            </Link>
          )}
        </div>

        {/* Mobile: Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <motion.button
            {...{
              onClick: toggleMobileMenu,
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              className: "px-3 py-2 rounded-full bg-brand-primary text-background-primary",
              "aria-label": "Menu",
            }}
          >
            <FiMenu size={24} />
          </motion.button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            {...{
              initial: { opacity: 0, y: -50 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -50 },
              className: "fixed top-0 left-0 right-0 z-40 pt-20 pb-6 px-6 md:hidden bg-background-secondary",
            }}
          >
            <div className="flex justify-end mb-4">
              <button onClick={toggleMobileMenu} className="text-text-primary">
                <FiX size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="py-3 px-4 rounded-lg hover:bg-brand-accent/10 transition-colors text-text-primary"
                onClick={toggleMobileMenu}
              >
                {t('nav.home', 'Home')}
              </Link>
              <Link
                href="/dashboard"
                className="py-3 px-4 rounded-lg hover:bg-brand-accent/10 transition-colors text-text-primary"
                onClick={toggleMobileMenu}
              >
                {t('nav.dashboard', 'Dashboard')}
              </Link>
              <Link
                href="/recomendation"
                className="py-3 px-4 rounded-lg hover:bg-brand-accent/10 transition-colors text-text-primary"
                onClick={toggleMobileMenu}
              >
                {t('nav.recommendations', 'Recommendations')}
              </Link>
              <Link
                href="/voice-agent"
                className="py-3 px-4 rounded-lg hover:bg-brand-accent/10 transition-colors text-text-primary"
                onClick={toggleMobileMenu}
              >
                🎤 {t('nav.voice_agent', 'Voice Assistant')}
              </Link>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="py-3 px-4 rounded-lg text-left flex items-center gap-2 mt-4 text-red-400 bg-red-100/20"
                >
                  <FiLogOut size={18} /> <span>Logout</span>
                </button>
              ) : (
                <Link
                  href="/signin"
                  className="py-3 px-4 rounded-lg text-left flex items-center gap-2 mt-4 text-text-primary hover:bg-brand-accent/10"
                  onClick={toggleMobileMenu}
                >
                  <span>{t('nav.sign_in', 'Sign In')}</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
