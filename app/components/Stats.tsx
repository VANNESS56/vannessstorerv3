"use client";

import { motion } from "framer-motion";
import { CheckCircle, Globe, Smartphone, Star } from "lucide-react";

const stats = [
    {
        label: "Order Sukses",
        value: "15.000+",
        icon: CheckCircle,
        description: "Transaksi berhasil diproses"
    },
    {
        label: "Negara Tersedia",
        value: "50+",
        icon: Globe,
        description: "Pilihan negara seluruh dunia"
    },
    {
        label: "Layanan Aplikasi",
        value: "100+",
        icon: Smartphone,
        description: "Support berbagai platform"
    },
    {
        label: "Kepuasan Pelanggan",
        value: "99.9%",
        icon: Star,
        description: "Review bintang 5 dari user"
    },
];

export default function Stats() {
    return (
        <section className="relative py-20 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700"></div>
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

            {/* Floating bubbles for decoration */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/20 rounded-lg text-white group-hover:scale-110 transition-transform">
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="text-3xl font-bold text-white tracking-tight">
                                    {stat.value}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">
                                    {stat.label}
                                </h3>
                                <p className="text-blue-100 text-sm">
                                    {stat.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
