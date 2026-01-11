"use client";

import { ShieldCheck, Zap, Globe2, Coins } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
        title: "Privasi Terjaga",
        description: "Lindungi nomor pribadi Anda dengan menggunakan nomor virtual untuk verifikasi aplikasi.",
    },
    {
        icon: <Zap className="w-8 h-8 text-blue-500" />,
        title: "Proses Instan",
        description: "Sistem otomatis 24/7. OTP diterima dalam hitungan detik setelah pemesanan.",
    },
    {
        icon: <Coins className="w-8 h-8 text-blue-500" />,
        title: "Harga Termurah",
        description: "Kami menawarkan harga paling kompetitif mulai dari Rp 1.000 per layanan.",
    },
    {
        icon: <Globe2 className="w-8 h-8 text-blue-500" />,
        title: "Support Global",
        description: "Tersedia nomor dari 150+ negara untuk berbagai kebutuhan verifikasi lintas negara.",
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function Features() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4"
                    >
                        Mengapa Memilih Kami?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                    >
                        Layanan nomor virtual (NoKos) terbaik dan terpercaya untuk kebutuhan verifikasi digital Anda.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                        >
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
