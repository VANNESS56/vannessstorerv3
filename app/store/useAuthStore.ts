import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/app/lib/supabaseClient';

export interface User {
    id: string;
    name: string;
    email: string;
    balance: number;
    role: 'user' | 'admin';
}

interface AuthStore {
    currentUser: User | null;
    isLoading: boolean;

    // Actions
    login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    checkSession: () => Promise<void>;

    // Admin Actions
    getUsers: () => Promise<User[]>;
    updateBalance: (userId: string, newBalance: number) => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            currentUser: null,
            isLoading: true, // Initial state

            login: async (email, password, rememberMe = true) => {
                try {
                    const { data, error } = await supabase
                        .from('users')
                        .select('*')
                        .eq('email', email)
                        .eq('password', password);

                    if (data && data.length > 0 && !error) {
                        const user = data[0];
                        set({ currentUser: user, isLoading: false });

                        if (rememberMe) {
                            localStorage.setItem('vanness_user_id', user.id);
                            sessionStorage.removeItem('vanness_user_id');
                        } else {
                            sessionStorage.setItem('vanness_user_id', user.id);
                            localStorage.removeItem('vanness_user_id');
                        }
                        return true;
                    }
                    if (error) {
                        alert(`Login Gagal: ${error.message}`);
                    }
                    return false;
                } catch (e: any) {
                    alert(`System Error: ${e.message || e}`);
                    return false;
                }
            },

            register: async (name, email, password) => {
                try {
                    const { data, error } = await supabase
                        .from('users')
                        .insert([{ name, email, password, role: 'user', balance: 0 }])
                        .select()
                        .single();

                    if (data && !error) {
                        set({ currentUser: data, isLoading: false });
                        localStorage.setItem('vanness_user_id', data.id);
                        return true;
                    }
                    if (error) {
                        alert(`Register Gagal: ${error.message}`);
                    }
                    return false;
                } catch (e: any) {
                    alert(`System Error: ${e.message || e}`);
                    return false;
                }
            },

            logout: () => {
                set({ currentUser: null });
                localStorage.removeItem('vanness_user_id');
                sessionStorage.removeItem('vanness_user_id');
            },

            checkSession: async () => {
                // Re-validate with server to ensure balance is fresh
                let id = null;
                if (typeof window !== 'undefined') {
                    id = localStorage.getItem('vanness_user_id') || sessionStorage.getItem('vanness_user_id');
                }

                if (id) {
                    const { data } = await supabase.from('users').select('*').eq('id', id).single();
                    if (data) {
                        set({ currentUser: data, isLoading: false });
                        return;
                    }
                }
                set({ isLoading: false });
            },

            getUsers: async () => {
                const { data } = await supabase.from('users').select('*');
                return data || [];
            },

            updateBalance: async (userId, newBalance) => {
                const { error } = await supabase
                    .from('users')
                    .update({ balance: newBalance })
                    .eq('id', userId);

                if (!error) {
                    const { currentUser } = get();
                    if (currentUser?.id === userId) {
                        set({ currentUser: { ...currentUser, balance: newBalance } });
                    }
                    return true;
                }
                return false;
            }
        }),
        {
            name: 'vanness-auth-storage', // key in localStorage
            storage: createJSONStorage(() => localStorage), // utilize localStorage
            partialize: (state) => ({ currentUser: state.currentUser }),
        }
    )
);
