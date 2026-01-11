'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Send, Mail, Facebook, Globe, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onBuy: (product: Product) => void;
    isFavorite?: boolean;
    onToggleFavorite?: (id: string) => void;
}

const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
        case 'whatsapp': return <MessageCircle className="w-6 h-6 text-green-500" />;
        case 'telegram': return <Send className="w-6 h-6 text-blue-400" />;
        case 'google': return <Mail className="w-6 h-6 text-red-500" />;
        case 'facebook': return <Facebook className="w-6 h-6 text-blue-600" />;
        default: return <Globe className="w-6 h-6 text-slate-400" />;
    }
};

export default function ProductCard({ product, onBuy, isFavorite, onToggleFavorite }: ProductCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="relative bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group overflow-hidden"
        >
            {/* Status Indicator (Stock) */}
            <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${product.stock > 0 ? 'bg-blue-500' : 'bg-red-500'}`} />

            <div className="flex flex-col h-full justify-between relative pl-3">

                {/* Header: Icon, Info, Safe Action */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:scale-110 transition-all duration-300">
                            <div className="scale-125">
                                {getIcon(product.platform)}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight mb-1">{product.platform}</h3>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-full w-fit">
                                <span>{product.flag}</span>
                                <span className="font-medium text-slate-600 dark:text-slate-300">{product.country}</span>
                            </div>
                        </div>
                    </div>

                    {/* Favorite Button */}
                    {onToggleFavorite && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(product.id);
                            }}
                            className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 group/heart transition-colors -mr-2 -mt-2"
                        >
                            <Heart
                                className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-300 dark:text-slate-600 group-hover/heart:text-red-400'}`}
                            />
                        </button>
                    )}
                </div>

                {/* Footer: Price & Buy */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Harga</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                            <span className="text-xs text-slate-400 font-normal mr-1">Rp</span>
                            {product.price.toLocaleString('id-ID')}
                        </p>
                    </div>

                    <button
                        onClick={() => onBuy(product)}
                        disabled={product.stock === 0}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all transform active:scale-95 ${product.stock > 0
                                ? 'bg-slate-900 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {product.stock > 0 ? (
                            <>
                                Beli
                                <ShoppingCart className="w-4 h-4" />
                            </>
                        ) : (
                            'Habis'
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
