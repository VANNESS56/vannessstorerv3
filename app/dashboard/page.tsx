'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, Lock, Settings, LogOut, Users, MessageSquare, Terminal, Ticket, Eye, EyeOff, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardTable from './components/DashboardTable';
import ApiTester from './components/ApiTester';
import ProductSyncer from './components/ProductSyncer';
import UserManagement from './components/UserManagement';
import InfoBoardManagement from './components/InfoBoardManagement';
import VoucherManager from './components/VoucherManager';
import Link from 'next/link';
import ThemeToggle from '@/app/components/ThemeToggle';

export default function DashboardPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [hydrated, setHydrated] = useState(false);
    const [activeView, setActiveView] = useState('products');

    // Login UI States
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setHydrated(true);
        const storedAuth = localStorage.getItem('isAdminAuthenticated');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                localStorage.setItem('isAdminAuthenticated', 'true');
                setIsAuthenticated(true);
            } else {
                setError(data.message || 'Akses ditolak.');
                setPassword('');
            }
        } catch (err) {
            setError('Gagal menghubungi server.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        if (confirm('Akhiri sesi admin?')) {
            localStorage.removeItem('isAdminAuthenticated');
            setIsAuthenticated(false);
            setPassword('');
        }
    };

    if (!hydrated) return null;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
                {/* Abstract Background Effects */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />

                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl border border-white/10 dark:border-slate-700 shadow-2xl rounded-3xl w-full max-w-md overflow-hidden relative z-10"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                    <div className="p-8 pt-12">
                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                                className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 rotate-3"
                            >
                                <ShieldCheck className="w-10 h-10 text-white" />
                            </motion.div>
                            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Admin Portal</h1>
                            <p className="text-slate-400">Verifikasi identitas diperlukan untuk akses.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Kode Akses</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="●●●●●●●●"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-12 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-500/10 border border-red-500/50 rounded-lg p-3"
                                    >
                                        <p className="text-red-400 text-sm text-center flex items-center justify-center gap-2">
                                            <ShieldCheck className="w-4 h-4" /> {error}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={isLoading || !password}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Verifikasi...
                                    </>
                                ) : (
                                    <>
                                        Masuk Dashboard <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                    <div className="bg-slate-900/50 p-4 border-t border-white/5 text-center">
                        <Link href="/" className="text-sm text-slate-500 hover:text-white transition-colors inline-flex items-center gap-2">
                            &larr; Kembali ke Halaman Utama
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden md:flex flex-col fixed h-full z-10 transition-colors duration-300 shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <ShieldCheck className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">VANNESS</h2>
                            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Admin Panel</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {[
                        { id: 'products', label: 'Produk', icon: LayoutGrid },
                        { id: 'users', label: 'Pengguna', icon: Users },
                        { id: 'vouchers', label: 'Vouchers', icon: Ticket },
                        { id: 'info', label: 'Informasi', icon: MessageSquare },
                        { id: 'api', label: 'API Tester', icon: Terminal },
                        { id: 'settings', label: 'Pengaturan', icon: Settings },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 group ${activeView === item.id
                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeView === item.id ? 'fill-blue-600/10' : ''}`} />
                            {item.label}
                            {activeView === item.id && (
                                <ChevronRight className="w-4 h-4 ml-auto text-blue-400" />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-xl font-medium transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Selamat datang kembali, Administrator.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <ThemeToggle />
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700" />
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="font-bold text-slate-900 dark:text-white text-sm">Super Admin</p>
                                <div className="flex items-center justify-end gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Online</p>
                                </div>
                            </div>
                            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center">
                                <Users className="w-5 h-5 text-slate-400 dark:text-slate-300" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="min-h-[500px]">
                    {activeView === 'products' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ProductSyncer />
                            <DashboardTable />
                        </div>
                    )}

                    {activeView === 'users' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><UserManagement /></div>}

                    {activeView === 'vouchers' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><VoucherManager /></div>}

                    {activeView === 'info' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><InfoBoardManagement /></div>}

                    {activeView === 'api' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><ApiTester /></div>}

                    {activeView === 'settings' && (
                        <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl border border-slate-200 dark:border-slate-700 text-center text-slate-500 dark:text-slate-400 animate-in fade-in zoom-in-95 duration-300 shadow-sm">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Settings className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Pengaturan Sistem</h3>
                            <p className="max-w-md mx-auto">Modul pengaturan sedang dalam pengembangan tahap lanjut. Silakan gunakan tab lain untuk manajemen konten.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
