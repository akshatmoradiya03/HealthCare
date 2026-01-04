'use client';

import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Connection {
    id: number;
    professional: { id: number; name: string; email: string };
    client: { id: number; name: string; email: string };
    status: string;
}

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const [connections, setConnections] = useState<Connection[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (user) {
            fetchConnections();
        }
    }, [user]);

    const fetchConnections = async () => {
        try {
            const response = await api.get('/connection/list');
            setConnections(response.data);
        } catch (error) {
            console.error('Failed to fetch connections', error);
            toast.error('Failed to load connections');
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleRemove = async (connectionId: number) => {
        if (!window.confirm('Remove this connection? This action cannot be undone.')) return;
        try {
            await api.delete(`/connection/${connectionId}`);
            toast.success('Connection removed');
            fetchConnections();
        } catch (error) {
            console.error('Failed to remove connection', error);
            toast.error('Failed to remove connection');
        }
    };

    if (loading || isLoadingData) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // Filter only accepted connections for the main list, maybe?
    // Requirements say "List of connected Professionals/Clients"
    const activeConnections = connections.filter(c => c.status === 'accepted');

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
                <Navbar />
                <main className="py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

                        {/* User Info */}
                        <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center justify-between transition-colors">
                            <div>
                                <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email} • <span className="capitalize">{user?.role}</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Active connections</p>
                                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{activeConnections.length}</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Connections</h2>
                                <button
                                    onClick={fetchConnections}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Refresh
                                </button>
                            </div>
                            {activeConnections.length === 0 ? (
                                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md p-6 text-center text-gray-500 dark:text-gray-400 transition-colors">
                                    No active connections found. Go to Requests to connect.
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md transition-colors">
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {activeConnections.map((connection) => {
                                            const otherUser = user?.role === 'professional' ? connection.client : connection.professional;

                                            if (!otherUser) {
                                                return (
                                                    <li key={connection.id} className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                                        User information unavailable
                                                    </li>
                                                );
                                            }

                                            return (
                                                <li key={connection.id} className="px-6 py-4 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{otherUser.name}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{otherUser.email}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            Connected
                                                        </span>
                                                        <button
                                                            onClick={() => handleRemove(connection.id)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
