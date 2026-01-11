'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { Megaphone, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoItem {
    id: number;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success' | 'urgent';
    created_at: string;
}

export default function InfoBoard() {
    const [infos, setInfos] = useState<InfoItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInfos = async () => {
            const { data } = await supabase
                .from('information_board')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (data) setInfos(data as any);
            setLoading(false);
        };

        fetchInfos();

        // Optional: Subscribe to realtime changes if needed
        const channel = supabase
            .channel('public:information_board')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'information_board' }, () => {
                fetchInfos();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (loading) return null; // Or a skeleton
    if (infos.length === 0) return null;

    return (
        <div className="mb-8 space-y-4">
            <div className="flex items-center gap-2 mb-2 px-1">
                <Megaphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-slate-700 dark:text-slate-200">Papan Informasi</h3>
            </div>

            <div className="grid gap-4">
                <AnimatePresence>
                    {infos.map((info) => (
                        <motion.div
                            key={info.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`relative p-5 rounded-2xl border shadow-sm transition-colors duration-300 ${info.type === 'urgent' ? 'bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-900/50' :
                                    info.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-900/50' :
                                        info.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 border-green-100 dark:border-green-900/50' :
                                            'bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700'
                                }`}
                        >
                            <div className="flex gap-4">
                                <div className={`p-3 rounded-full shrink-0 h-fit ${info.type === 'urgent' ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' :
                                        info.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400' :
                                            info.type === 'success' ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' :
                                                'bg-indigo-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400'
                                    }`}>
                                    {info.type === 'urgent' && <AlertTriangle className="w-6 h-6" />}
                                    {info.type === 'warning' && <AlertTriangle className="w-6 h-6" />}
                                    {info.type === 'success' && <CheckCircle className="w-6 h-6" />}
                                    {info.type === 'info' && <Info className="w-6 h-6" />}
                                </div>

                                <div className="flex-1">
                                    <h4 className={`font-bold text-lg mb-1 ${info.type === 'urgent' ? 'text-red-900 dark:text-red-200' :
                                            info.type === 'warning' ? 'text-amber-900 dark:text-amber-200' :
                                                info.type === 'success' ? 'text-green-900 dark:text-green-200' :
                                                    'text-indigo-900 dark:text-white'
                                        }`}>
                                        {info.title}
                                    </h4>
                                    <p className={`text-sm leading-relaxed ${info.type === 'urgent' ? 'text-red-700 dark:text-red-300' :
                                            info.type === 'warning' ? 'text-amber-800 dark:text-amber-300' :
                                                info.type === 'success' ? 'text-green-800 dark:text-green-300' :
                                                    'text-indigo-800 dark:text-slate-300'
                                        }`}>
                                        {info.content}
                                    </p>
                                    <p className={`text-xs mt-3 opacity-60 font-medium ${info.type === 'urgent' ? 'text-red-600 dark:text-red-400' :
                                            info.type === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                                                'text-slate-500 dark:text-slate-500'
                                        }`}>
                                        {new Date(info.created_at).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
