'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-24 overflow-hidden">
            {/* Background Abstract Elements */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            />
            <motion.div
                animate={{
                    y: [0, 30, 0],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-full">
                        #1 Platform Nomor Virtual Terpercaya
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                        Verifikasi Akun <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            Tanpa Kartu Sim Fisik
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
                        Dapatkan nomor HP virtual instan untuk WhatsApp, Telegram, Google, dan ribuan aplikasi lainnya.
                        Pilih dari 50+ negara dengan harga mulai Rp 1.000.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/30 flex items-center gap-2 hover:bg-blue-700 transition-colors"
                        >
                            Mulai Sekarang <ArrowRight className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                            Lihat Tutorial
                        </motion.button>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-16 flex flex-wrap justify-center gap-8 text-slate-500">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-medium">Garansi Uang Kembali</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            <span className="text-sm font-medium">Aktivasi Instan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-purple-500" />
                            <span className="text-sm font-medium">50+ Negara Tersedia</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
