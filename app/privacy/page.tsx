import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Privacy() {
    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 pb-12">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">Kebijakan Privasi</h1>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6 text-slate-600 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Informasi yang Kami Kumpulkan</h2>
                            <p>Kami hanya mengumpulkan informasi dasar yang diperlukan untuk transaksi, seperti nomor WhatsApp (untuk notifikasi) dan riwayat transaksi pembelian. Kami tidak menyimpan data kartu kredit atau informasi sensitif pembayaran Anda.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Penggunaan Informasi</h2>
                            <p>Data yang kami kumpulkan digunakan semata-mata untuk:</p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>Memproses pesanan nomor virtual Anda.</li>
                                <li>Menghubungi Anda terkait status pesanan atau kendala teknis.</li>
                                <li>Meningkatkan kualitas layanan kami.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Keamanan Data</h2>
                            <p>Kami menjaga kerahasiaan data pribadi Anda dan tidak akan menjual, menyewakan, atau memberikannya kepada pihak ketiga tanpa persetujuan Anda, kecuali diwajibkan oleh hukum.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Cookies</h2>
                            <p>Website ini mungkin menggunakan cookies untuk menyimpan preferensi pengguna dan sesi login demi kenyamanan penggunaan.</p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
