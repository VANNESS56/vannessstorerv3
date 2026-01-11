'use client';

import { useState, useEffect } from 'react';
import { useAuthStore, User } from '@/app/store/useAuthStore';
import { Search, Wallet, Plus, Minus } from 'lucide-react';

export default function UserManagement() {
    const { getUsers, updateBalance } = useAuthStore();
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [amount, setAmount] = useState('');
    const [actionType, setActionType] = useState<'add' | 'deduct'>('add');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const data = await getUsers();
        setUsers(data);
    };

    const filteredUsers = users.filter(u =>
        u.role === 'user' &&
        (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || !amount) return;

        const val = Number(amount);
        let newBalance = selectedUser.balance;

        if (actionType === 'add') {
            newBalance += val;
        } else {
            if (newBalance < val) {
                alert('Gagal: Saldo tidak cukup!');
                return;
            }
            newBalance -= val;
        }

        const success = await updateBalance(selectedUser.id, newBalance);

        if (success) {
            alert(`Berhasil update saldo ${selectedUser.name}!`);
            loadUsers(); // Reload to get fresh data
        } else {
            alert('Gagal update database.');
        }

        setAmount('');
        setSelectedUser(null);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-blue-600" />
                    Manajemen Saldo Member
                </h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari member..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3">Nama Member</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Sisa Saldo</th>
                            <th className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 font-medium text-slate-900">{user.name}</td>
                                    <td className="px-6 py-3 text-slate-500">{user.email}</td>
                                    <td className="px-6 py-3 font-bold text-blue-600">
                                        Rp {user.balance.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setActionType('add');
                                                }}
                                                className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium text-xs flex items-center gap-1"
                                            >
                                                <Plus className="w-3 h-3" /> Tambah
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setActionType('deduct');
                                                }}
                                                className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium text-xs flex items-center gap-1"
                                            >
                                                <Minus className="w-3 h-3" /> Kurang
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                    Belum ada member yang terdaftar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Topup */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6">
                        <h3 className="font-bold text-lg mb-4 text-slate-900">
                            {actionType === 'add' ? 'Tambah Saldo' : 'Kurangi Saldo'}
                        </h3>
                        <p className="text-slate-600 text-sm mb-4">
                            Member: <span className="font-semibold text-slate-800">{selectedUser.name}</span> <br />
                            Saldo Saat Ini: <span className="font-semibold text-blue-600">Rp {selectedUser.balance.toLocaleString()}</span>
                        </p>

                        <form onSubmit={handleTransaction}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah (Rp)</label>
                                <input
                                    type="number"
                                    required
                                    autoFocus
                                    placeholder="Contoh: 50000"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedUser(null)}
                                    className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className={`flex-1 py-2 text-white font-bold rounded-lg transition-colors shadow-lg ${actionType === 'add'
                                        ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20'
                                        : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                                        }`}
                                >
                                    Konfirmasi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
