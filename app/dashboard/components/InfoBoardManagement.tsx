'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { Trash2, Plus, Info, AlertTriangle, CheckCircle, Megaphone } from 'lucide-react';

interface InfoItem {
    id: number;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success' | 'urgent';
    is_active: boolean;
    created_at: string;
}

export default function InfoBoardManagement() {
    const [infos, setInfos] = useState<InfoItem[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newType, setNewType] = useState('info');
    const [loading, setLoading] = useState(false);

    const fetchInfos = async () => {
        const { data } = await supabase
            .from('information_board')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setInfos(data as any);
    };

    useEffect(() => {
        fetchInfos();
    }, []);

    const handleCreate = async () => {
        if (!newTitle || !newContent) return;
        setLoading(true);
        const { error } = await supabase.from('information_board').insert({
            title: newTitle,
            content: newContent,
            type: newType,
            is_active: true
        });

        if (!error) {
            setNewTitle('');
            setNewContent('');
            setNewType('info');
            fetchInfos();
        } else {
            alert('Gagal menambah info: ' + error.message);
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus info ini?')) return;
        await supabase.from('information_board').delete().eq('id', id);
        fetchInfos();
    };

    const toggleActive = async (id: number, currentStatus: boolean) => {
        await supabase.from('information_board').update({ is_active: !currentStatus }).eq('id', id);
        fetchInfos();
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Manajemen Pengumuman</h3>

            {/* Create Form */}
            <div className="flex flex-col gap-4 mb-8 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Judul</label>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Judul Pengumuman"
                            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        />
                    </div>
                    <div className="w-1/3">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Tipe</label>
                        <select
                            value={newType}
                            onChange={(e) => setNewType(e.target.value)}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        >
                            <option value="info">Info (Biru)</option>
                            <option value="warning">Warning (Kuning)</option>
                            <option value="urgent">Urgent (Merah)</option>
                            <option value="success">Success (Hijau)</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Konten</label>
                    <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="Isi pengumuman..."
                        rows={3}
                        className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <Megaphone className="w-4 h-4" /> Publish
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {infos.map((info) => (
                    <div key={info.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/50">
                        <div className={`p-2 rounded-full shrink-0 ${info.type === 'urgent' ? 'bg-red-100 text-red-600' :
                                info.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                    info.type === 'success' ? 'bg-green-100 text-green-600' :
                                        'bg-indigo-100 text-indigo-600'
                            }`}>
                            {info.type === 'urgent' && <AlertTriangle className="w-5 h-5" />}
                            {info.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                            {info.type === 'success' && <CheckCircle className="w-5 h-5" />}
                            {info.type === 'info' && <Info className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-slate-900 dark:text-white">{info.title}</h4>
                                {!info.is_active && (
                                    <span className="px-2 py-0.5 bg-slate-200 text-slate-500 text-[10px] font-bold rounded uppercase">Hidden</span>
                                )}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{info.content}</p>
                            <p className="text-xs text-slate-400">
                                {new Date(info.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => toggleActive(info.id, info.is_active)}
                                className={`px-3 py-1 rounded text-xs font-bold ${info.is_active
                                        ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                                    }`}
                            >
                                {info.is_active ? 'Sembunyikan' : 'Tampilkan'}
                            </button>
                            <button
                                onClick={() => handleDelete(info.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
