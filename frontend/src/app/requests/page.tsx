'use client';

import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';

interface Connection {
    id: number;
    professional: { id: number; name: string; email: string };
    client: { id: number; name: string; email: string };
    status: string;
    initiated_by: number;
}

export default function RequestsPage() {
    const { user, loading } = useAuth();
    const [connections, setConnections] = useState<Connection[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const { register, handleSubmit, reset } = useForm();

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
            const err = error as { response?: { data?: any }; message?: string };
            if (!(err as any).response) {
                // Network-level failure, run health check
                try {
                    const h = await fetch('http://127.0.0.1:5000/api/health/', { method: 'GET', mode: 'cors', credentials: 'include' });
                    if (h.ok) {
                        toast.error('Backend reachable but request failed (likely auth/CORS). Check server logs');
                    } else {
                        toast.error('Health check failed; backend returned non-OK');
                    }
                } catch (he) {
                    console.error('Health check failed', he);
                    toast.error('Network Error: backend unreachable or CORS blocked');
                }
            } else {
                toast.error('Failed to load requests');
            }
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleRespond = async (connectionId: number, action: 'accept' | 'reject') => {
        try {
            await api.post('/connection/respond', { connection_id: connectionId, action });
            toast.success(`Request ${action}ed`);
            fetchConnections();
        } catch (error) {
            console.error(error);
            toast.error('Failed to respond to request');
        }
    };

    const onSubmitInvite = async (data: Record<string, unknown>) => {
        try {
            await api.post('/connection/invite-client', { client_email: data.email });
            toast.success('Invitation sent');
            reset();
            fetchConnections();
        } catch (error: unknown) {
            console.error(error);
            const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
            const msg = err.response?.data?.message || err.message || 'Failed to send invitation';
            if (err.response?.status === 403) {
                toast.error(msg || 'You are not authorized to perform this action');
            } else {
                toast.error(msg);
            }
        }
    };

    if (loading || isLoadingData) return <div>Loading...</div>;

    const pendingConnections = connections.filter(c => c.status === 'pending');

    // Normalize comparison (backend sometimes returns string IDs) so that
    // requests show in the correct column regardless of type.
    // Incoming: I did NOT initiate it
    const incomingRequests = pendingConnections.filter(
        (c) => String(c.initiated_by) !== String(user?.id)
    );

    // Outgoing: I initiated it
    const outgoingRequests = pendingConnections.filter(
        (c) => String(c.initiated_by) === String(user?.id)
    );

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
                <Navbar />
                <main className="py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Requests & Invitations</h1>

                        {/* Action Section - Only for Professionals */}
                        {user?.role === 'professional' && (
                            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Invite a Client</h2>
                                <form onSubmit={handleSubmit(onSubmitInvite)} className="flex gap-4">
                                    <input
                                        type="email"
                                        placeholder="Client Email"
                                        required
                                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        {...register('email')}
                                    />
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Send
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* List Section */}
                        {
                            // Show a single-column layout when only one side is visible
                        }
                        <div className="mt-8 grid gap-8 grid-cols-1">
                            {/* Incoming Requests (visible for clients) */}
                            {user?.role !== 'professional' && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Incoming Requests</h2>
                                    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md transition-colors">
                                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {incomingRequests.map((connection) => {
                                                const otherUser = user?.role === 'professional' ? connection.client : connection.professional;

                                                // Defensive: if otherUser is missing (backend might not populate it),
                                                // show a simple placeholder instead of crashing the UI.
                                                if (!otherUser) {
                                                    return (
                                                        <li key={connection.id} className="px-6 py-4 text-gray-500">
                                                            User information unavailable
                                                        </li>
                                                    );
                                                }

                                                return (
                                                    <li key={connection.id} className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{otherUser.name}</p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">{otherUser.email}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleRespond(connection.id, 'accept')}
                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleRespond(connection.id, 'reject')}
                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                            {incomingRequests.length === 0 && (
                                                <li className="px-6 py-4 text-center text-gray-500">No incoming requests</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Outgoing Requests (visible for professionals) */}
                            {user?.role === 'professional' && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Outgoing Requests</h2>
                                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                        <ul className="divide-y divide-gray-200">
                                            {outgoingRequests.map((connection) => {
                                                const otherUser = user?.role === 'professional' ? connection.client : connection.professional;

                                                if (!otherUser) {
                                                    return (
                                                        <li key={connection.id} className="px-6 py-4 text-gray-500">
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
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            Pending
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                            {outgoingRequests.length === 0 && (
                                                <li className="px-6 py-4 text-center text-gray-500">No outgoing requests</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
