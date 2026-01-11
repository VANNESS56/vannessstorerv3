'use client';

import { useState } from 'react';
import { X, Copy, Check, CreditCard, Wallet, QrCode, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string;
}

export default function DepositModal({ isOpen, onClose, userEmail }: DepositModalProps) {
    const [amount, setAmount] = useState<string>('');
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // Konfigurasi Metode Pembayaran (Bisa diubah/ditambah)
    const paymentMethods = [
        {
            id: 1,
            name: 'BCA',
            number: '8530565972',
            holder: 'VANNESS',
            icon: <CreditCard className="w-5 h-5 text-blue-600" />,
            bgColor: 'bg-blue-50'
        },
        {
            id: 2,
            name: 'DANA',
            number: '088287677384',
            holder: 'VANNESS',
            icon: <Wallet className="w-5 h-5 text-blue-500" />,
            bgColor: 'bg-sky-50'
        },
        {
            id: 3,
            name: 'GOPAY',
            number: '08999991950',
            holder: 'VANNESS',
            icon: <Wallet className="w-5 h-5 text-green-500" />,
            bgColor: 'bg-green-50'
        },
        {
            id: 4,
            name: 'QRIS',
            number: 'Coming Soon',
            holder: 'All Payment',
            icon: <QrCode className="w-5 h-5 text-slate-800" />,
            bgColor: 'bg-slate-50'
        }
    ];

    // Format Rupiah
    const formatRupiah = (val: string) => {
        const numberString = val.replace(/[^,\d]/g, '').toString();
        const split = numberString.split(',');
        const sisa = split[0].length % 3;
        let rupiah = split[0].substr(0, sisa);
        const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        if (ribuan) {
            const separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        return split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(formatRupiah(e.target.value));
    };

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleConfirm = () => {
        if (!amount) return alert("Masukkan nominal deposit!");

        const message = `Halo Admin, saya ingin konfirmasi deposit saldo.\n\nEmail: ${userEmail}\nNominal: Rp ${amount}\n\nMohon dicek. Terima kasih!`;
        const whatsappUrl = `https://wa.me/628999991950?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Isi Saldo</h2>
                            <p className="text-sm text-slate-500">Pilih metode pembayaran</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        {/* Input Amount */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Mau deposit berapa?
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    className="w-full pl-12 pr-4 py-4 text-lg font-bold text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:font-normal"
                                    placeholder="0"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-none">
                                {['10.000', '25.000', '50.000', '100.000'].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setAmount(val)}
                                        className="px-4 py-1.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors whitespace-nowrap border border-transparent hover:border-blue-200"
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">
                                Transfer ke salah satu rekening ini:
                            </label>
                            <div className="space-y-3">
                                {paymentMethods.map((method, idx) => (
                                    <div key={method.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-200 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 ${method.bgColor} rounded-xl flex items-center justify-center shrink-0`}>
                                                {method.icon}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">{method.name}</p>
                                                <p className="font-mono text-slate-600 font-medium">{method.number}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{method.holder}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(method.number, idx)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            title="Salin Nomor"
                                        >
                                            {copiedIndex === idx ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                        <button
                            onClick={handleConfirm}
                            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Konfirmasi Deposit via WhatsApp
                        </button>
                        <p className="text-center text-xs text-slate-500 mt-3">
                            Admin akan memproses deposit Anda setelah bukti transfer dikirim.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
