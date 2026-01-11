import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// PENTING: Ganti ini di .env.local dengan ADMIN_PASSWORD=PasswordRahasiaAnda
// Jika tidak diset, defaultnya adalah 'admin123' (TIDAK AMAN untuk production)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const MAX_RETRIES = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// Simple in-memory store for rate limiting (reset on server restart)
// In production, use Redis or Database
const rateLimit = new Map<string, { count: number, lastAttempt: number }>();

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // Get IP for rate limiting (Approximation)
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const now = Date.now();
        const record = rateLimit.get(ip);

        // Check Rate Limit
        if (record) {
            if (record.count >= MAX_RETRIES) {
                const timePassed = now - record.lastAttempt;
                if (timePassed < LOCKOUT_TIME) {
                    const remaining = Math.ceil((LOCKOUT_TIME - timePassed) / 60000);
                    return NextResponse.json(
                        { success: false, message: `Terlalu banyak percobaan. Coba lagi dalam ${remaining} menit.` },
                        { status: 429 }
                    );
                } else {
                    // Reset after lockout expiry
                    rateLimit.set(ip, { count: 0, lastAttempt: now });
                }
            }
        }

        // Verify Password
        if (password === ADMIN_PASSWORD) {
            // Reset rate limit on success
            rateLimit.delete(ip);

            // Set HTTP-only Cookie for security
            // This prevents client-side JS from reading it, mitigating XSS
            (await cookies()).set('admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 1 day
            });

            return NextResponse.json({ success: true });
        } else {
            // Update rate limit
            const currentCount = record ? record.count + 1 : 1;
            rateLimit.set(ip, { count: currentCount, lastAttempt: now });

            return NextResponse.json(
                { success: false, message: 'Kode akses tidak valid.' },
                { status: 401 }
            );
        }

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
