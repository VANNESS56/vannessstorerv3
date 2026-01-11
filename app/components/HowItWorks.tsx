"use client";

import { Search, CreditCard, MessageSquareMore, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
    {
        icon: <Search className="w-6 h-6 text-blue-600" />,
        title: "1. Pilih Layanan",
        description: "Cari aplikasi yang ingin diverifikasi dan pilih negara asal nomor.",
    },
    {
        icon: <CreditCard className="w-6 h-6 text-blue-600" />,
        title: "2. Pembayaran",
        description: "Lakukan pembayaran instan via QRIS, E-Wallet, atau Transfer Bank.",
    },
    {
        icon: <MessageSquareMore className="w-6 h-6 text-blue-600" />,
        title: "3. Terima OTP",
        description: "Nomor muncul otomatis. Gunakan nomor, dan kode OTP akan masuk di riwayat.",
    },
];

export default function HowItWorks() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4"
                    >
                        Cara Kerja
                    </motion.h2>
                    <p className="text-lg text-gray-600">3 Langkah mudah mendapatkan nomor virtual.</p>
                </div>

                <div className="relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[2.5rem] left-0 right-0 h-0.5 bg-blue-100 -z-10 mx-auto w-3/4" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative flex flex-col items-center text-center bg-white"
                            >
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm z-10">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed max-w-xs">{step.description}</p>

                                {index < steps.length - 1 && (
                                    <div className="lg:hidden mt-8 text-blue-200">
                                        <ArrowRight className="w-8 h-8 rotate-90" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
