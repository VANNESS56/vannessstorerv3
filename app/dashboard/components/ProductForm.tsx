'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Product } from '@/app/types';

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: Omit<Product, 'id'>) => void;
    initialData?: Product | null;
}

export default function ProductForm({ isOpen, onClose, onSubmit, initialData }: ProductFormProps) {
    const [formData, setFormData] = useState({
        platform: '',
        country: '',
        price: '',
        stock: '',
        icon: 'whatsapp',
        flag: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                platform: initialData.platform,
                country: initialData.country,
                price: initialData.price.toString(),
                stock: initialData.stock.toString(),
                icon: initialData.icon,
                flag: initialData.flag,
            });
        } else {
            setFormData({
                platform: '',
                country: '',
                price: '',
                stock: '',
                icon: 'whatsapp',
                flag: '',
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            platform: formData.platform,
            country: formData.country,
            price: Number(formData.price),
            stock: Number(formData.stock),
            icon: formData.icon,
            flag: formData.flag,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-lg text-slate-800">
                        {initialData ? 'Edit Produk' : 'Tambah Produk Baru'}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Aplikasi</label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: WhatsApp"
                            value={formData.platform}
                            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Negara</label>
                            <input
                                type="text"
                                required
                                placeholder="Indo"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Bendera (Emoji)</label>
                            <input
                                type="text"
                                required
                                placeholder="🇮🇩"
                                value={formData.flag}
                                onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Harga (Rp)</label>
                            <input
                                type="number"
                                required
                                placeholder="2500"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Stok</label>
                            <input
                                type="number"
                                required
                                placeholder="10"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Icon ID</label>
                        <select
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="whatsapp">WhatsApp</option>
                            <option value="telegram">Telegram</option>
                            <option value="google">Google</option>
                            <option value="facebook">Facebook</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            {initialData ? 'Simpan Perubahan' : 'Tambah Produk'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
