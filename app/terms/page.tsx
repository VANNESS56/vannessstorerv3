import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Terms() {
    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 pb-12">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">Syarat & Ketentuan</h1>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6 text-slate-600 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Pendahuluan</h2>
                            <p>Selamat datang di VANNESS STORE. Dengan mengakses dan menggunakan layanan kami, Anda menyetujui untuk terikat oleh syarat dan ketentuan berikut.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Layanan</h2>
                            <p>Kami menyediakan layanan nomor virtual untuk verifikasi berbagai aplikasi (OTP). Nomor yang kami sediakan adalah nomor sekali pakai atau sewa jangka waktu tertentu sesuai paket yang dipilih.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Pembayaran & Saldo</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Pembayaran dilakukan di muka sebelum nomor diberikan.</li>
                                <li>Saldo yang sudah didepositkan tidak dapat ditarik kembali (no refund), namun dapat digunakan untuk pembelian produk apapun di platform kami.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Garansi</h2>
                            <p>Kami memberikan garansi penggantian nomor baru atau refund saldo jika kode OTP tidak masuk dalam waktu yang ditentukan (biasanya 5-10 menit). Garansi hangus jika nomor berhasil menerima OTP.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Larangan Penggunaan</h2>
                            <p>Dilarang keras menggunakan layanan kami untuk tindakan ilegal, penipuan, spam, atau aktivitas yang melanggar hukum di Indonesia maupun hukum internasional.</p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
