'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Heart } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import PurchaseModal from './PurchaseModal';
import { useProductStore } from '../store/useProductStore';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const SkeletonCard = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 h-full animate-pulse">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 w-full">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                </div>
            </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700 mt-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
        </div>
    </div>
);

export default function ProductList() {
    const { products, fetchProducts, isLoading } = useProductStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [localLoading, setLocalLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [hydrated, setHydrated] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        setHydrated(true);
        fetchProducts();

        // Load favorites
        const saved = localStorage.getItem('product_favorites');
        if (saved) {
            setFavorites(JSON.parse(saved));
        }
    }, []);

    const toggleFavorite = (id: string) => {
        const newFavorites = favorites.includes(id)
            ? favorites.filter(fid => fid !== id)
            : [...favorites, id];

        setFavorites(newFavorites);
        localStorage.setItem('product_favorites', JSON.stringify(newFavorites));
    };

    // Debounce search
    useEffect(() => {
        setLocalLoading(true);
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setLocalLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.platform.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            p.country.toLowerCase().includes(debouncedSearch.toLowerCase());

        let matchesCategory = true;
        if (activeCategory === 'Favorites') {
            matchesCategory = favorites.includes(p.id);
        } else if (activeCategory !== 'All') {
            matchesCategory = p.platform.toLowerCase().includes(activeCategory.toLowerCase());
        }

        return matchesSearch && matchesCategory;
    });

    const handleBuy = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    if (!hydrated) return null;

    return (
        <section id="layanan" className="py-24 bg-white dark:bg-slate-900 relative transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Layanan Populer</h2>
                        <p className="text-slate-500 dark:text-slate-400">Pilih layanan nomor virtual yang Anda butuhkan.</p>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <input
                            type="text"
                            placeholder="Cari negara atau aplikasi..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all group-hover:bg-white dark:group-hover:bg-slate-800"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 transition-colors w-5 h-5" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg">
                            <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Categories / Filter Chips */}
                <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                    {['All', 'Favorites', 'WhatsApp', 'Telegram', 'Google', 'Facebook', 'TikTok', 'Shopee', 'Instagram', 'GoJek'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveCategory(cat);
                                setSearchTerm(''); // Clear manual search when picking category for clarity
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${activeCategory === cat
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                        >
                            {cat === 'Favorites' && <Heart className={`w-4 h-4 ${activeCategory === cat ? 'fill-white' : 'fill-slate-600 dark:fill-slate-300'}`} />}
                            {cat === 'Favorites' ? 'Favorit Saya' : cat}
                        </button>
                    ))}
                </div>

                <div className="min-h-[300px]">
                    {isLoading || localLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            key={debouncedSearch + activeCategory}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <motion.div key={product.id} variants={item}>
                                        <ProductCard
                                            product={product}
                                            onBuy={handleBuy}
                                            isFavorite={favorites.includes(product.id)}
                                            onToggleFavorite={toggleFavorite}
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400"
                                >
                                    {activeCategory === 'Favorites'
                                        ? "Belum ada layanan favorit. Klik ikon hati pada layanan untuk menambahkannya ke sini."
                                        : "Tidak ada layanan yang ditemukan untuk pencarian Anda."}
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>

            <PurchaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
            />
        </section>
    );
}
