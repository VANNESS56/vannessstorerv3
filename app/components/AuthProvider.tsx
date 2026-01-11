'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { checkSession } = useAuthStore();

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    return <>{children}</>;
}
