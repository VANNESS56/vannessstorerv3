'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Smartphone, AlertCircle, Loader2, Copy, Info } from 'lucide-react';
import { Product } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabaseClient';

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

export default function PurchaseModal({ isOpen, onClose, product }: PurchaseModalProps) {
    const { currentUser, updateBalance } = useAuthStore();
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed' | 'otp_wait'>('idle');
    const [orderData, setOrderData] = useState<{ order_id: string, number: string } | null>(null);
    const [otpCode, setOtpCode] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (orderData?.number) {
            navigator.clipboard.writeText(orderData.number);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setStatus('idle');
            setOrderData(null);
            setOtpCode(null);
            setErrorMsg('');
        }
    }, [isOpen]);

    // OTP Polling
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'otp_wait' && orderData?.order_id) {
            interval = setInterval(async () => {
                try {
                    const res = await fetch('/api/jasaotp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            endpoint: 'sms',
                            params: { id: orderData.order_id }
                        })
                    });
                    const result = await res.json();
                    const apiStatus = result?.data?.status?.toUpperCase();
                    const cancelStatuses = ['CANCELED', 'CANCELLED', 'CANCEL', 'FAILURE', 'REFUND', 'DIBATALKAN', 'GAGAL', 'TIMEOUT'];

                    if (result && result.success && result.data?.otp && !cancelStatuses.includes(apiStatus)) {
                        setOtpCode(result.data.otp);
                        setStatus('success'); // Found OTP, Success!

                        // Update Order Status in DB
                        await supabase.from('orders')
                            .update({ status: 'success', otp_code: result.data.otp })
                            .eq('order_id_provider', orderData.order_id);

                        clearInterval(interval);
                    } else if (result.data && cancelStatuses.includes(apiStatus)) {
                        setStatus('failed');
                        // Refund immediately on system cancel (use latest state if possible, but dep array handles it)
                        await updateBalance(currentUser!.id, currentUser!.balance + product!.price);

                        // Update Order Status in DB
                        await supabase.from('orders')
                            .update({ status: 'cancelled' })
                            .eq('order_id_provider', orderData.order_id);

                        setErrorMsg('Order dibatalkan oleh server. Saldo dikembalikan.');
                        clearInterval(interval);
                    }
                } catch (e) {
                    console.error("OTP check failed");
                }
            }, 5000); // Check every 5 seconds
        }
        return () => clearInterval(interval);
    }, [status, orderData, currentUser, product, updateBalance]);

    const handlePurchase = async () => {
        if (!currentUser || !product) return;

        if (currentUser.balance < product.price) {
            alert('Saldo tidak cukup!');
            return;
        }

        // Processing state
        setStatus('processing');

        // Deduct balance in DB first
        const newBalance = currentUser.balance - product.price;
        const balanceUpdated = await updateBalance(currentUser.id, newBalance);

        if (!balanceUpdated) {
            setStatus('failed');
            setErrorMsg('Gagal memproses pembayaran. Cek koneksi.');
            return;
        }

        try {
            const res = await fetch('/api/jasaotp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: 'order',
                    params: {
                        negara: product.countryId || '6', // Default indo if missing
                        layanan: product.serviceCode || 'wa', // Default wa if missing
                        operator: 'any'
                    }
                })
            });

            const result = await res.json();

            if (result.success) {
                setOrderData(result.data);
                setStatus('otp_wait');

                // Save Order to Database (History)
                await supabase.from('orders').insert([{
                    user_id: currentUser.id,
                    order_id_provider: result.data.order_id,
                    number: result.data.number,
                    service_name: `${product.platform} ${product.country}`,
                    price: product.price,
                    status: 'pending',
                    otp_code: null
                }]);

            } else {
                // Auto Refund Logic
                // newBalance IS the deducted balance. So safe to add price back.
                const refundAmount = newBalance + product.price;
                await updateBalance(currentUser.id, refundAmount);

                setStatus('failed');
                // Inspect result deeply for error message
                const serverMsg = result.message || (result.data ? JSON.stringify(result.data) : 'Gagal membuat order.');
                setErrorMsg(`${serverMsg}. Saldo Anda telah dikembalikan otomatis.`);
            }
        } catch (error) {
            setStatus('failed');
            setErrorMsg('Kesalahan jaringan.');
        }
    };

    const handleManualCancel = async () => {
        if (!orderData || !currentUser || !product) return;

        const confirmCancel = confirm("Yakin ingin membatalkan pesanan? Saldo akan dikembalikan.");
        if (!confirmCancel) return;

        setStatus('processing');

        try {
            // 1. Try to cancel at Provider (Strict)
            const res = await fetch('/api/jasaotp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: 'cancel',
                    params: { id: orderData.order_id }
                })
            });
            const result = await res.json();

            // Only refund if success
            if (result.success === true) {
                // 2. Refund User
                await updateBalance(currentUser.id, currentUser.balance + product.price);

                // 3. Update DB
                await supabase.from('orders')
                    .update({ status: 'cancelled' })
                    .eq('order_id_provider', orderData.order_id);

                setStatus('failed');
                setErrorMsg('Pesanan dibatalkan manual. Saldo telah dikembalikan.');
            } else {
                // If cancel failed, maybe it's already success? Or server error.
                // We should probably check the status here to be thorough, but for now showing error is safer than blind refund.
                setStatus('failed');
                setErrorMsg(`Gagal membatalkan: ${result.message || 'Server menolak pembatalan.'}. Cek Riwayat Transaksi.`);
            }

        } catch (e) {
            console.error("API Cancel failed", e);
            setStatus('failed');
            setErrorMsg("Gagal menghubungi server.");
        }
    };

    if (!isOpen || !product) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden z-10"
                >
                    {/* Header */}
                    <div className="bg-slate-50 p-6 flex items-center justify-between border-b border-slate-100">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">
                                {status === 'idle' ? 'Konfirmasi Pembelian' :
                                    status === 'processing' ? 'Memproses...' :
                                        status === 'otp_wait' ? 'Menunggu OTP...' :
                                            status === 'success' ? 'Pesanan Selesai' : 'Gagal'}
                            </h3>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    <div className="p-6">
                        {status === 'idle' && (
                            <>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                                        {product.flag}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-900">{product.platform}</h4>
                                        <p className="text-slate-500">{product.country}</p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <p className="text-sm text-slate-400">Harga</p>
                                        <p className="text-xl font-bold text-blue-600">Rp {product.price.toLocaleString()}</p>
                                    </div>
                                </div>

                                {currentUser ? (
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-slate-600 font-medium">Saldo Anda</span>
                                            <span className="font-bold text-slate-900">Rp {currentUser.balance.toLocaleString()}</span>
                                        </div>
                                        {currentUser.balance < product.price && (
                                            <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                                                <AlertCircle className="w-4 h-4" /> Saldo tidak mencukupi.
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-6 text-center">
                                        <p className="text-yellow-800 font-medium mb-2">Anda belum login</p>
                                        <Link href="/auth/login" className="text-sm bg-yellow-600 text-white px-4 py-2 rounded-lg inline-block">
                                            Login untuk membeli
                                        </Link>
                                    </div>
                                )}

                                <button
                                    onClick={handlePurchase}
                                    disabled={!currentUser || currentUser.balance < product.price}
                                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                >
                                    Bayar Sekarang
                                </button>
                            </>
                        )}

                        {status === 'processing' && (
                            <div className="py-12 text-center">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                                <p className="text-slate-600 font-medium">Sedang menghubungi server...</p>
                            </div>
                        )}

                        {(status === 'otp_wait' || status === 'success') && orderData && (
                            <div className="text-center">
                                {/* Professional Number Display Card */}
                                <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm mb-6 text-left">
                                    <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 flex flex-col gap-4">
                                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                                <Smartphone className="w-3 h-3" /> Nomor Virtual
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                                ID: {orderData.order_id}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-2">
                                            <h2 className="text-3xl font-mono font-bold text-slate-900 tracking-tight">
                                                {orderData.number}
                                            </h2>
                                            <button
                                                onClick={handleCopy}
                                                className={`group flex items-center gap-2 px-3 py-2 rounded-lg transition-all border shadow-sm active:scale-95 ${copied
                                                    ? 'bg-green-50 border-green-200 text-green-700'
                                                    : 'bg-white border-slate-200 hover:border-blue-500 hover:text-blue-600'
                                                    }`}
                                            >
                                                {copied ? (
                                                    <>
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span className="text-xs font-bold">Disalin</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                                                        <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600">Salin</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3 items-start">
                                            <div className="bg-white p-1 rounded-full shadow-sm mt-0.5">
                                                <Info className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="text-xs text-slate-600 leading-relaxed">
                                                <span className="font-bold text-blue-700 block mb-0.5">Instruksi:</span>
                                                Masukkan nomor di atas ke aplikasi <span className="font-bold text-slate-900">{product.platform}</span>.
                                                Kode OTP akan muncul otomatis di bawah ini.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative py-4">
                                    {status === 'otp_wait' ? (
                                        <div className="animate-pulse">
                                            <Smartphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-500">Menunggu kode OTP masuk...</p>
                                            <p className="text-xs text-slate-400 mt-1 mb-6">Jangan tutup halaman ini (Auto-refresh)</p>

                                            <button
                                                onClick={handleManualCancel}
                                                className="text-red-500 text-sm font-medium hover:bg-red-50 px-4 py-2 rounded-lg border border-red-200 transition-colors"
                                            >
                                                Batalkan & Refund Saldo
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-white border-2 border-blue-500 p-6 rounded-xl shadow-lg">
                                            <p className="text-blue-600 font-bold uppercase tracking-wider text-xs mb-2">KODE OTP DITERIMA</p>
                                            <h1 className="text-4xl font-mono font-black text-slate-900 tracking-[0.5em]">{otpCode}</h1>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {status === 'failed' && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <X className="w-8 h-8 text-red-600" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">Transaksi Gagal</h4>
                                <p className="text-red-500 bg-red-50 p-3 rounded-lg text-sm">{errorMsg}</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800"
                                >
                                    Coba Lagi
                                </button>
                            </div>
                        )}

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
