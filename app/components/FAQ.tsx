"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "Apakah saldo akan hangus jika OTP tidak masuk?",
        answer: "Tidak. Saldo Anda aman. Sistem kami hanya memotong saldo jika kode OTP berhasil diterima. Jika dalam batas waktu (biasanya 20 menit) OTP tidak masuk, pemesanan akan batal otomatis dan saldo kembali utuh.",
    },
    {
        question: "Berapa lama nomor aktif?",
        answer: "Nomor virtual ini bersifat sementara (sekali pakai) khusus untuk menerima kode verifikasi. Durasi aktif nomor biasanya sekitar 15-20 menit untuk menunggu SMS masuk.",
    },
    {
        question: "Apakah bisa untuk WhatsApp / Telegram?",
        answer: "Ya, kami menyediakan layanan khusus untuk berbagai aplikasi populer termasuk WhatsApp, Telegram, Google, Facebook, dan ratusan aplikasi lainnya.",
    },
    {
        question: "Apakah nomor ini bisa dipakai ulang?",
        answer: "Secara default tidak. Nomor ini 'One Time Use'. Namun untuk beberapa layanan tertentu mungkin ada fitur sewa (rent) jangka panjang, silakan cek ketersediaan di menu.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                        Pertanyaan Umum
                    </h2>
                    <p className="text-lg text-gray-600">
                        Jawaban untuk hal yang sering ditanyakan.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={false}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="flex items-center justify-between w-full p-6 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-lg font-medium text-gray-900">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            <AnimatePresence initial={false}>
                                {openIndex === index && (
                                    <motion.div
                                        initial="collapsed"
                                        animate="open"
                                        exit="collapsed"
                                        variants={{
                                            open: { opacity: 1, height: "auto" },
                                            collapsed: { opacity: 0, height: 0 },
                                        }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
