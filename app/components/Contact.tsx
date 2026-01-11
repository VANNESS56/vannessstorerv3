'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleWhatsAppSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const text = `Halo Admin, saya ada pertanyaan:\n\nNama: ${formState.name}\nEmail: ${formState.email}\nPesan: ${formState.message}`;
        const waUrl = `https://wa.me/628999991950?text=${encodeURIComponent(text)}`;

        window.open(waUrl, '_blank');
    };

    return (
        <section id="kontak" className="py-20 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -z-10 skew-x-12 translate-x-20" />

            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                            Butuh Bantuan? <br />
                            <span className="text-blue-600">Hubungi Kami</span>
                        </h2>
                        <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                            Tim support kami siap membantu Anda 24/7 jika mengalami kendala saat penerimaan OTP atau penggunaan layanan kami.
                        </p>

                        <div className="space-y-6">
                            <a href="https://wa.me/628999991950" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group cursor-pointer">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">WhatsApp</h4>
                                    <p className="text-slate-500">+62 899-9991-950</p>
                                </div>
                            </a>

                            <div className="flex items-start gap-4 group cursor-pointer">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Email</h4>
                                    <p className="text-slate-500">support@vannessstore.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">Lokasi</h4>
                                    <p className="text-slate-500">Jakarta, Indonesia</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100"
                    >
                        <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Masukkan nama Anda"
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="nama@email.com"
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Pesan</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Tulis kendala atau pertanyaan Anda..."
                                    value={formState.message}
                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all resize-none"
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <Send className="w-5 h-5" />
                                Kirim Pesan via WhatsApp
                            </button>
                        </form>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
