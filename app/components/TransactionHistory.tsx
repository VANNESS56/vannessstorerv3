'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { useAuthStore } from '@/app/store/useAuthStore';
import { Clock, CheckCircle, XCircle, Copy, RefreshCcw } from 'lucide-react';

interface Order {
    id: number;
    created_at: string;
    service_name: string;
    number: string;
    otp_code: string | null;
    price: number;
    status: 'pending' | 'success' | 'cancelled' | 'failed';
    order_id_provider: string;
}

export default function TransactionHistory() {
    const { currentUser, updateBalance } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        if (currentUser) {
            fetchOrders();
        }
    }, [currentUser]);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', currentUser?.id)
                .order('created_at', { ascending: false });

            if (data) {
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckStatus = async (order: Order) => {
        if (!order.order_id_provider) return;
        setProcessingId(order.id);

        try {
            const res = await fetch('/api/jasaotp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: 'sms',
                    params: { id: order.order_id_provider }
                })
            });
            const result = await res.json();

            if (result && (result.success || result.status === true)) {
                const apiStatus = result.data?.status?.toUpperCase();
                const cancelStatuses = ['CANCELED', 'CANCELLED', 'CANCEL', 'FAILURE', 'REFUND', 'DIBATALKAN', 'GAGAL', 'TIMEOUT'];

                if (result.data?.otp && !cancelStatuses.includes(apiStatus)) {
                    // Update to Success with OTP
                    await supabase.from('orders')
                        .update({ status: 'success', otp_code: result.data.otp })
                        .eq('id', order.id);
                    alert("Status diperbarui: OTP Diterima!");
                } else if (cancelStatuses.includes(apiStatus)) {
                    // It is CANCELLED/TIMEOUT on server
                    if (order.status === 'pending' || order.status === 'success') {
                        const refundAmount = currentUser!.balance + order.price;
                        await updateBalance(currentUser!.id, refundAmount);

                        await supabase.from('orders')
                            .update({ status: 'cancelled', otp_code: null })
                            .eq('id', order.id);

                        const msg = order.status === 'success'
                            ? "Koreksi: Order timeout/batal. Saldo dikembalikan."
                            : "Status diperbarui: Order dibatalkan oleh server. Saldo dikembalikan.";
                        alert(msg);
                    } else {
                        alert(`Status server: ${apiStatus}. (Sudah tercatat batal/gagal)`);
                    }
                } else {
                    // Waiting state
                    alert(`Server: ${apiStatus || 'Menunggu'} (Belum ada OTP).`);
                }
                fetchOrders();
            } else {
                // API returns success: false
                const msg = (result.message || result.data || '').toLowerCase();
                if (msg.includes('tidak ditemukan') || msg.includes('not found') || msg.includes('data kosong')) {
                    // Order is gone from server history -> Assume Cancelled/Expired
                    const refundAmount = currentUser!.balance + order.price;
                    await updateBalance(currentUser!.id, refundAmount);

                    await supabase.from('orders')
                        .update({ status: 'cancelled', otp_code: null })
                        .eq('id', order.id);

                    alert("Data order sudah tidak ada di server (Kadaluarsa). Saldo dikembalikan.");
                } else {
                    alert(`Gagal cek status: ${msg || 'Unknown Error'}`);
                }
            }
        } catch (error) {
            console.error("Check status failed", error);
            alert("Gagal menghubungi server.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleCancelOrder = async (order: Order) => {
        if (!currentUser) return;
        const confirmCancel = confirm("Yakin ingin membatalkan pesanan ini? Saldo akan dikembalikan.");
        if (!confirmCancel) return;

        setProcessingId(order.id);

        try {
            // 1. Try to cancel at Provider using 'cancle' endpoint
            if (order.order_id_provider) {
                const res = await fetch('/api/jasaotp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        endpoint: 'cancel',
                        params: { id: order.order_id_provider }
                    })
                });
                const result = await res.json();
                console.log("Cancel Result:", result);

                // Expect success: true or data: true
                if (result && (result.success === true || result.status === true || result.data === true)) {
                    // 2. Refund User
                    const refundAmount = currentUser.balance + order.price;
                    await updateBalance(currentUser.id, refundAmount);

                    // 3. Update DB Status
                    await supabase.from('orders')
                        .update({ status: 'cancelled' })
                        .eq('id', order.id);

                    alert("Pesanan berhasil dibatalkan. Saldo telah dikembalikan.");
                    fetchOrders();
                } else {
                    // Failed to cancel.
                    // It might be because it's already cancelled, or API error.
                    // Let's force a Status Check.
                    const serverMsg = result?.message || (typeof result?.data === 'string' ? result.data : JSON.stringify(result));
                    alert(`Cancel Gagal: ${serverMsg}. Sistem akan cek status (jika timeout/batal di server = auto refund).`);

                    // Fallback to check status
                    await handleCheckStatus(order);
                }
            }
        } catch (error) {
            console.error("Cancellation failed", error);
            alert(`Gagal membatalkan pesanan (Network/Server Error). Coba Refresh Status.`);
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'success':
                return <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Sukses</span>;
            case 'pending':
                return <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Proses</span>;
            case 'cancelled':
            case 'failed':
                return <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Gagal</span>;
            default:
                return <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-xs font-bold">{status}</span>;
        }
    };

    if (loading) return <div className="text-center py-8 text-slate-400 dark:text-slate-500">Memuat riwayat...</div>;

    if (orders.length === 0) {
        return (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors duration-300">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-medium">Belum ada transaksi</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Riwayat pembelian Anda akan muncul di sini.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-colors duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">Riwayat Transaksi</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-medium">
                        <tr>
                            <th className="px-6 py-4">Waktu</th>
                            <th className="px-6 py-4">Layanan</th>
                            <th className="px-6 py-4">Nomor HP</th>
                            <th className="px-6 py-4">Kode OTP</th>
                            <th className="px-6 py-4">Harga</th>
                            <th className="px-6 py-4">Status & Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                    {formatDate(order.created_at)}
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                    {order.service_name}
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                                    {order.number}
                                </td>
                                <td className="px-6 py-4">
                                    {order.otp_code && order.otp_code !== 'Menunggu' ? (
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-lg text-blue-600 dark:text-blue-400 tracking-wider bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                                                {order.otp_code}
                                            </span>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(order.otp_code!)}
                                                className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                title="Salin OTP"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 dark:text-slate-500 italic">
                                            {order.otp_code === 'Menunggu' ? 'Menunggu OTP...' : '-'}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                    Rp {order.price.toLocaleString('id-ID')}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(order.status)}

                                        {(order.status === 'pending' || (order.status === 'success' && (!order.otp_code || order.otp_code === 'Menunggu'))) && (
                                            <>
                                                <button
                                                    onClick={() => handleCheckStatus(order)}
                                                    disabled={processingId === order.id}
                                                    className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                                                    title="Refresh Status / Cek Ulang"
                                                >
                                                    <RefreshCcw className={`w-4 h-4 ${processingId === order.id ? 'animate-spin' : ''}`} />
                                                </button>

                                                {(order.status === 'pending' || (order.status === 'success' && (!order.otp_code || order.otp_code === 'Menunggu'))) && (
                                                    <button
                                                        onClick={() => handleCancelOrder(order)}
                                                        disabled={processingId === order.id}
                                                        className="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
