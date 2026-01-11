'use client';

import { useState } from 'react';
import { RefreshCcw, CheckCircle, AlertCircle } from 'lucide-react';

export default function ApiTester() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [responseData, setResponseData] = useState<any>(null);

    const checkConnection = async () => {
        setStatus('loading');
        setMessage('');
        setResponseData(null);

        try {
            // Test balance check (paling dasar)
            const res = await fetch('/api/jasaotp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endpoint: 'balance' })
            });

            const result = await res.json();

            // JasaOTP returns success: true/false
            if (result.success) {
                setStatus('success');
                setMessage(`Koneksi Sukses! Saldo: Rp ${result.data?.saldo?.toLocaleString('id-ID')}`);
                setResponseData(result.data);
            } else {
                setStatus('error');
                setMessage(`Gagal: ${result.message || 'Respon API Error'}`);
            }
        } catch (error) {
            setStatus('error');
            setMessage('Error: Gagal menghubungi server internal.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                Status Koneksi API Ditznesia
            </h3>

            <div className="flex items-center gap-4 mb-4">
                <button
                    onClick={checkConnection}
                    disabled={status === 'loading'}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                    <RefreshCcw className={`w-4 h-4 ${status === 'loading' ? 'animate-spin' : ''}`} />
                    {status === 'loading' ? 'Mengecek...' : 'Test Koneksi Sekarang'}
                </button>

                {status === 'success' && (
                    <span className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                        <CheckCircle className="w-4 h-4" /> {message}
                    </span>
                )}

                {status === 'error' && (
                    <span className="flex items-center gap-2 text-red-600 font-medium bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                        <AlertCircle className="w-4 h-4" /> {message}
                    </span>
                )}
            </div>

            {responseData && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs font-mono overflow-auto max-h-40">
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
