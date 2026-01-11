'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { Trash2, Plus, Copy, CheckCircle } from 'lucide-react';

interface Voucher {
    id: number;
    code: string;
    amount: number;
    is_used: boolean;
    created_at: string;
}

export default function VoucherManager() {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [newCode, setNewCode] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchVouchers = async () => {
        const { data } = await supabase
            .from('vouchers')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setVouchers(data as any);
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleCreate = async () => {
        if (!newCode || !newAmount) return;
        setLoading(true);
        const { error } = await supabase.from('vouchers').insert({
            code: newCode.toUpperCase(),
            amount: parseInt(newAmount),
            is_used: false
        });

        if (!error) {
            setNewCode('');
            setNewAmount('');
            fetchVouchers();
        } else {
            alert('Gagal membuat voucher: ' + error.message);
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus voucher ini?')) return;
        await supabase.from('vouchers').delete().eq('id', id);
        fetchVouchers();
    };

    const generateRandomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewCode(result);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Manajemen Voucher</h3>

            {/* Create Form */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                <div className="flex-1">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Kode Voucher</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newCode}
                            onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                            placeholder="ex: MERDEKA45"
                            className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        />
                        <button
                            onClick={generateRandomCode}
                            className="px-3 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 text-xs font-bold"
                        >
                            Auto
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-48">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nominal Saldo</label>
                    <input
                        type="number"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        placeholder="ex: 10000"
                        className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                </div>
                <div className="flex items-end">
                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center"
                    >
                        <Plus className="w-4 h-4" /> Buat
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">Kode</th>
                            <th className="px-4 py-3">Saldo</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 rounded-r-lg text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {vouchers.map((v) => (
                            <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    {v.code}
                                    <button
                                        onClick={() => navigator.clipboard.writeText(v.code)}
                                        className="text-slate-300 hover:text-blue-500"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                    Rp {v.amount.toLocaleString('id-ID')}
                                </td>
                                <td className="px-4 py-3">
                                    {v.is_used ? (
                                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full font-bold">
                                            Sudah Dipakai
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full font-bold flex w-fit items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Tersedia
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => handleDelete(v.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {vouchers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-slate-400">
                                    Belum ada voucher.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
