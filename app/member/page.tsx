'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Wallet, ShoppingCart, LogOut, User as UserIcon, Activity, Server } from 'lucide-react';
import Link from 'next/link';
import ProductList from '../components/ProductList';
import TransactionHistory from '../components/TransactionHistory';
import InfoBoard from './components/InfoBoard';
import VoucherInput from './components/VoucherInput';
import DepositModal from '@/app/components/DepositModal';
import { supabase } from '@/app/lib/supabaseClient';
import ThemeToggle from '@/app/components/ThemeToggle';

export default function MemberDashboard() {
    const { currentUser, logout } = useAuthStore();
    const router = useRouter();
    const [hydrated, setHydrated] = useState(false);
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [totalSpent, setTotalSpent] = useState(0);

    useEffect(() => {
        setHydrated(true);
        if (!currentUser && hydrated) {
            router.push('/auth/login');
        }

        // Fetch Member Stats
        if (currentUser) {
            fetchMemberStats();
        }
    }, [currentUser, router, hydrated]);

    const fetchMemberStats = async () => {
        if (!currentUser) return;

        // Get successful orders to calculate total spent
        const { data, error } = await supabase
            .from('orders')
            .select('price')
            .eq('user_id', currentUser.id)
            .eq('status', 'success');

        if (data) {
            const total = data.reduce((acc, curr) => acc + (curr.price || 0), 0);
            setTotalSpent(total);
        }
    };

    if (!hydrated) return null;
    if (!currentUser) return null; // Wait for redirect

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Navbar Member */}
            <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
                <div className="container mx-auto px-6 h-16 flex justify-between items-center">
                    <Link href="/" className="font-bold text-xl text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        VANNESS MEMBER
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:block">
                            <ThemeToggle />
                        </div>
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">{currentUser.name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{currentUser.email}</span>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                router.push('/');
                            }}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-8">
                {/* Saldo Card */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <Wallet className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Saldo Anda</p>
                                <h2 className="text-3xl font-bold">Rp {currentUser.balance.toLocaleString('id-ID')}</h2>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsDepositOpen(true)}
                            className="w-full py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            + Isi Saldo
                        </button>
                    </div>

                    {/* Membership Level Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group transition-colors duration-300">
                        <div className="absolute top-0 right-0 p-4 -mr-4 -mt-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity className="w-24 h-24 rotate-12 text-slate-900 dark:text-white" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Level Member</p>
                                    {(() => {
                                        let level = {
                                            name: 'Newbie',
                                            icon: '👶',
                                            color: 'text-slate-600 dark:text-slate-200',
                                            bg: 'bg-slate-100 dark:bg-slate-700',
                                            next: 100000,
                                            nextName: 'Reseller'
                                        };

                                        if (totalSpent >= 1000000) level = { name: 'SULTAN', icon: '👑', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', next: 999999999, nextName: 'Max' };
                                        else if (totalSpent >= 350000) level = { name: 'Juragan', icon: '💰', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', next: 1000000, nextName: 'Sultan' };
                                        else if (totalSpent >= 100000) level = { name: 'Reseller', icon: '💼', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', next: 350000, nextName: 'Juragan' };

                                        const progress = Math.min(100, (totalSpent / level.next) * 100);
                                        const remaining = level.next - totalSpent;

                                        return (
                                            <>
                                                <div className={`flex items-center gap-2 ${level.bg} ${level.color} px-3 py-1 rounded-lg w-fit mb-3 transition-colors duration-300`}>
                                                    <span className="text-xl">{level.icon}</span>
                                                    <span className="font-bold text-lg">{level.name}</span>
                                                </div>

                                                <div className="mb-2">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-slate-600 dark:text-slate-300 font-medium">Total: Rp {totalSpent.toLocaleString('id-ID')}</span>
                                                        {level.name !== 'SULTAN' && <span className="text-slate-400 dark:text-slate-500">Target: Rp {level.next.toLocaleString('id-ID')}</span>}
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-1000 ${level.name === 'SULTAN' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                                                            style={{ width: `${level.name === 'SULTAN' ? 100 : progress}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {level.name !== 'SULTAN' ? (
                                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                                        Belanja <span className="font-bold text-slate-600 dark:text-slate-300">Rp {remaining.toLocaleString('id-ID')}</span> lagi menuju <span className="font-bold text-blue-600 dark:text-blue-400">{level.nextName}</span>
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-yellow-600 dark:text-yellow-400 font-bold">
                                                        Level Tertinggi! Terima kasih, Sultan! 🎉
                                                    </p>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm text-sm transition-colors duration-300">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <Activity className="w-4 h-4" />
                                <span>Server Status</span>
                            </div>
                            <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full text-xs">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Online
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <Server className="w-4 h-4" />
                                <span>Layanan OTP</span>
                            </div>
                            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full text-xs">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                Normal
                            </span>
                        </div>
                    </div>
                </div>

                <InfoBoard />

                <VoucherInput />

                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Beli Nomor Baru</h2>
                    <div className="mt-4">
                        <ProductList />
                    </div>
                </div>

                <TransactionHistory />
            </main>
            <DepositModal
                isOpen={isDepositOpen}
                onClose={() => setIsDepositOpen(false)}
                userEmail={currentUser.email}
            />
        </div>
    );
}
