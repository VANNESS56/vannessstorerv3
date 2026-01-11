'use client';

export default function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-100 py-12">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
                <p>&copy; {new Date().getFullYear()} VANNESS STORE. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="/terms" className="hover:text-primary">Syarat & Ketentuan</a>
                    <a href="/privacy" className="hover:text-primary">Kebijakan Privasi</a>
                    <a href="#kontak" className="hover:text-primary">Bantuan</a>
                </div>
            </div>
        </footer>
    )
}
