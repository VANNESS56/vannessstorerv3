'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Rian Saputra",
        role: "Digital Marketer",
        content: "Layanan sangat cepat! Code OTP langsung masuk dalam hitungan detik. Sangat membantu untuk verifikasi akun bisnis saya.",
        rating: 5
    },
    {
        name: "Dinda Kirana",
        role: "Reseller",
        content: "Admin fast respon, harga juga bersaing banget. Udah langganan beli nomor luar negeri disini gapernah kecewa.",
        rating: 5
    },
    {
        name: "Budi Santoso",
        role: "Freelancer",
        content: "Awalnya ragu, tapi ternyata trusted parah. Nomor US nya work 100% buat daftar Telegram. Thanks VANNESS STORE!",
        rating: 4
    }
];

export default function Testimonials() {
    return (
        <section className="py-20 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
                    >
                        Apa Kata Mereka?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-600 max-w-2xl mx-auto"
                    >
                        Ribuan pelanggan telah mempercayai kami untuk kebutuhan nomor virtual mereka.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative group hover:shadow-md transition-all duration-300"
                        >
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-blue-100 group-hover:text-blue-50 transition-colors" />

                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                                    />
                                ))}
                            </div>

                            <p className="text-slate-600 mb-6 italic leading-relaxed">
                                "{item.content}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                    {item.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">{item.name}</h4>
                                    <p className="text-xs text-slate-500 font-medium">{item.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
