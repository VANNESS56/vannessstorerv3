'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { useAuthStore } from '@/app/store/useAuthStore';
import { Ticket, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoucherInput() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const { currentUser, updateBalance } = useAuthStore();

    const handleRedeem = async () => {
        if (!code.trim() || !currentUser) return;
        setLoading(true);
        setMessage(null);

        try {
            // 1. Check Voucher
            const { data: voucher, error } = await supabase
                .from('vouchers')
                .select('*')
                .eq('code', code.trim())
                .eq('is_used', false)
                .single();

            if (error || !voucher) {
                setMessage({ type: 'error', text: 'Kode voucher tidak valid atau sudah digunakan.' });
                return;
            }

            // 2. Mark as Used (Optimistic approach mainly, strict checking would need strict RLS/Functions)
            const { error: updateError } = await supabase
                .from('vouchers')
                .update({ is_used: true })
                .eq('id', voucher.id)
                .is('is_used', false); // Safety check condition

            if (updateError) {
                console.error('Voucher Update Error:', updateError);
                setMessage({ type: 'error', text: 'Gagal menggunakan voucher. Coba lagi.' });
                return;
            }

            // 3. Add Balance
            const newBalance = (currentUser.balance || 0) + voucher.amount;
            await updateBalance(currentUser.id, newBalance);

            setMessage({
                type: 'success',
                text: `Berhasil! Saldo Rp ${voucher.amount.toLocaleString('id-ID')} ditambahkan.`
            });
            setCode('');

        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Terjadi kesalahan sistem.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-300 mb-8">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                    <Ticket className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">Klaim Voucher Saldo</h3>
            </div>

            <div className="flex gap-3">
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Masukkan Kode Voucher..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white placeholder:text-slate-400 transition-all font-mono tracking-wider uppercase"
                />
                <button
                    onClick={handleRedeem}
                    disabled={loading || !code}
                    className="px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 dark:hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Klaim'}
                </button>
            </div>

            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`mt-4 p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${message.type === 'success'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
