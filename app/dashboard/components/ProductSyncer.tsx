'use client';

import { useState, useEffect } from 'react';
import { Download, Save, RefreshCw, Layers } from 'lucide-react';
import { useProductStore } from '@/app/store/useProductStore';

interface Country {
    id_negara: number;
    nama_negara: string;
}

interface Service {
    layanan: string;
    harga: number;
    stok: number;
    code: string; // key from API response (e.g. 'wa', 'go')
}

export default function ProductSyncer() {
    const { addProduct, products } = useProductStore();
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>(''); // ID
    const [foundServices, setFoundServices] = useState<Service[]>([]);
    const [profitMargin, setProfitMargin] = useState(500); // Default margin +500

    // Fetch Countries on load
    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const res = await fetch('/api/jasaotp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endpoint: 'negara' })
            });
            const result = await res.json();
            if (result.success) {
                setCountries(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch countries');
        }
    };

    const fetchServices = async () => {
        if (!selectedCountry) return;
        setLoading(true);
        try {
            const res = await fetch('/api/jasaotp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: 'layanan',
                    params: { negara: selectedCountry }
                })
            });
            const result = await res.json();

            // Transform object response to array
            // Response format: { "6": { "wa": { ... } } } -> need to access result[selectedCountry]
            // Correction: Based on user docs, response is direct object { "wa": {...}, "fb": {...} } inside the country key?
            // Actually docs say: { "6": { "wa": { ... } } }
            // Let's parse carefuly
            const servicesMap = result[selectedCountry] || {};

            const servicesList: Service[] = Object.keys(servicesMap).map(key => ({
                code: key,
                layanan: servicesMap[key].layanan,
                harga: servicesMap[key].harga,
                stok: servicesMap[key].stok
            }));

            setFoundServices(servicesList);
            setStep(2);

        } catch (error) {
            alert('Gagal mengambil layanan. Cek koneksi.');
        } finally {
            setLoading(false);
        }
    };

    const handleSync = () => {
        if (foundServices.length === 0) return;

        const countryName = countries.find(c => c.id_negara.toString() === selectedCountry)?.nama_negara || 'Unknown';

        // Map simple country names to emojis (basic mapping)
        const getFlag = (name: string) => {
            const n = name.toLowerCase();
            if (n.includes('indonesia')) return '🇮🇩';
            if (n.includes('malaysia')) return '🇲🇾';
            if (n.includes('usa') || n.includes('united states')) return '🇺🇸';
            if (n.includes('russia')) return '🇷🇺';
            if (n.includes('vietnam')) return '🇻🇳';
            if (n.includes('brazil')) return '🇧🇷';
            if (n.includes('phillipines')) return '🇵🇭';
            return '🏳️';
        };

        const flag = getFlag(countryName);

        let count = 0;
        foundServices.forEach(svc => {
            // Check formatted name
            let platformName = svc.layanan; // e.g. "whatsapp", "facebook"
            // Capitalize
            platformName = platformName.charAt(0).toUpperCase() + platformName.slice(1);

            // Icon mapping
            let icon = 'other';
            const lower = platformName.toLowerCase();
            if (lower.includes('whats')) icon = 'whatsapp';
            else if (lower.includes('tele')) icon = 'telegram';
            else if (lower.includes('goog')) icon = 'google';
            else if (lower.includes('face')) icon = 'facebook';
            else if (lower.includes('tikt')) icon = 'tiktok'; // lucide doesn't have tiktok, map to other or custom later

            // Avoid duplicates? For now just add new. 
            // Better: Check if exists in store logic (not implemented fully in store yet), so we just add.

            addProduct({
                platform: platformName,
                country: countryName.charAt(0).toUpperCase() + countryName.slice(1),
                price: svc.harga + Number(profitMargin),
                stock: svc.stok,
                icon: icon,
                flag: flag,
                countryId: selectedCountry,
                serviceCode: svc.code
            });
            count++;
        });

        alert(`Berhasil menambahkan ${count} produk ke toko!`);
        setStep(1);
        setFoundServices([]);
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                Sync Produk ke Toko
            </h3>

            {step === 1 && (
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-1/3">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Negara Sumber</label>
                        <select
                            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                        >
                            <option value="">-- Pilih Negara --</option>
                            {countries.map(c => (
                                <option key={c.id_negara} value={c.id_negara}>
                                    {c.nama_negara.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-1/3">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Margin Keuntungan (Rp)
                        </label>
                        <input
                            type="number"
                            value={profitMargin}
                            onChange={(e) => setProfitMargin(Number(e.target.value))}
                            className="w-full p-2.5 border border-slate-300 rounded-lg"
                        />
                    </div>

                    <button
                        onClick={fetchServices}
                        disabled={!selectedCountry || loading}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : 'Cek Layanan'}
                    </button>
                </div>
            )}

            {step === 2 && (
                <div>
                    <div className="flex justify-between items-center mb-4 bg-blue-50 p-4 rounded-lg">
                        <div>
                            <p className="font-semibold text-blue-900">Ditemukan {foundServices.length} Layanan</p>
                            <p className="text-sm text-blue-700">Siap ditambahkan ke VANNESS STORE dengan margin +Rp {profitMargin}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setStep(1)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSync}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 flex items-center gap-2 shadow-lg shadow-green-500/20"
                            >
                                <Save className="w-4 h-4" />
                                Sync Semua ke Toko
                            </button>
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2">Layanan</th>
                                    <th className="px-4 py-2">Harga Asli</th>
                                    <th className="px-4 py-2">Harga Jual</th>
                                    <th className="px-4 py-2">Stok</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {foundServices.map((svc) => (
                                    <tr key={svc.code} className="hover:bg-slate-50">
                                        <td className="px-4 py-2 font-medium">{svc.layanan.toUpperCase()}</td>
                                        <td className="px-4 py-2 text-slate-500">Rp {svc.harga}</td>
                                        <td className="px-4 py-2 font-bold text-green-600">Rp {svc.harga + profitMargin}</td>
                                        <td className="px-4 py-2">{svc.stok}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
