'use client';

import { useState, useEffect } from 'react';
import { X, Megaphone, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/app/lib/supabaseClient';

// Instruction for User:
// Please create a table in your Supabase database named 'information_board' with the following columns:
// - id (int8, primary key)
// - title (text)
// - content (text)
// - type (text) - 'info', 'warning', 'urgent', 'success'
// - is_active (boolean, default true)
// - created_at (timestamptz)

interface InfoItem {
    id: number;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success' | 'urgent';
    is_active: boolean;
}

export default function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [announcement, setAnnouncement] = useState<InfoItem | null>(null);

    useEffect(() => {
        setIsMounted(true);
        fetchAnnouncement();
    }, []);

    const fetchAnnouncement = async () => {
        try {
            const { data, error } = await supabase
                .from('information_board')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setAnnouncement(data);
            }
        } catch (error) {
            console.error('Error fetching announcement:', error);
        }
    };

    if (!isMounted || !isVisible || !announcement) return null;

    // Dynamic styles based on type
    const getStyles = (type: string) => {
        switch (type) {
            case 'urgent':
                return { bg: 'bg-red-600', icon: <AlertTriangle className="w-4 h-4 text-white animate-pulse" /> };
            case 'warning':
                return { bg: 'bg-yellow-600', icon: <AlertTriangle className="w-4 h-4 text-white" /> };
            case 'success':
                return { bg: 'bg-green-600', icon: <CheckCircle className="w-4 h-4 text-white" /> };
            default:
                return { bg: 'bg-indigo-600', icon: <Megaphone className="w-4 h-4 text-yellow-300 animate-pulse" /> };
        }
    };

    const style = getStyles(announcement.type);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`${style.bg} text-white relative z-50 overflow-hidden shadow-md`}
            >
                <div className="container mx-auto px-4 py-2.5 flex items-center justify-between text-xs md:text-sm">
                    <div className="flex items-center gap-3 mx-auto md:mx-0 w-full md:w-auto overflow-hidden">
                        <div className="shrink-0">
                            {style.icon}
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2 truncate md:overflow-visible text-left">
                            {announcement.title && (
                                <span className="font-bold uppercase tracking-wide opacity-90 text-[10px] md:text-xs">
                                    {announcement.title}:
                                </span>
                            )}
                            <span className="font-medium truncate md:whitespace-normal">
                                {announcement.content}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsVisible(false)}
                        className="hidden md:block text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors shrink-0 ml-4"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
