'use client';

import Link from "next/link";
import { ShoppingCart, Menu, X, LayoutGrid, User, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all">
            <LayoutGrid className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600 dark:from-blue-400 dark:to-blue-600">
            VANNESS STORE
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link href="#layanan" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Layanan</Link>
            <Link href="#cara-kerja" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cara Kerja</Link>
            <Link href="#kontak" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Kontak</Link>
          </div>

          <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-slate-700">
            <ThemeToggle />
            {hydrated && currentUser ? (
              <Link href="/member">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Hai, {currentUser.name.split(' ')[0]}
                </motion.button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg shadow-slate-900/20 flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk / Daftar
                </motion.button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
              <Link href="#layanan" className="text-slate-600 dark:text-slate-300 font-medium py-2" onClick={() => setIsOpen(false)}>Layanan</Link>
              <Link href="#cara-kerja" className="text-slate-600 dark:text-slate-300 font-medium py-2" onClick={() => setIsOpen(false)}>Cara Kerja</Link>
              <Link href="#kontak" className="text-slate-600 dark:text-slate-300 font-medium py-2" onClick={() => setIsOpen(false)}>Kontak</Link>
              <hr className="border-slate-100 dark:border-slate-800" />
              {hydrated && currentUser ? (
                <Link href="/member" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl">
                    Dashboard Member
                  </button>
                </Link>
              ) : (
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl">
                    Masuk / Daftar
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
