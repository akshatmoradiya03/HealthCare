'use client';

import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';

interface Activity {
    id: number;
    title: string;
    description: string;
    created_by: number;
    created_at: string;
}

interface Invite {
    id: number;
    activity: Activity;
    status: string;
}

interface Connection {
    id: number;
    professional: { id: number; name: string; email: string };
    client: { id: number; name: string; email: string };
    status: string;
}

export default function ActivitiesPage() {
    const { user, loading } = useAuth();
    const [activities, setActivities] = useState<Activity[]>([]); // For Pro
    const [invites, setInvites] = useState<Invite[]>([]); // For Client
    const [connections, setConnections] = useState<Connection[]>([]); // For Pro to invite
    const [isLoadingData, setIsLoadingData] = useState(true);
    const { register, handleSubmit, reset } = useForm();
    const { register: registerInvite, handleSubmit: handleSubmitInvite, reset: resetInvite } = useForm();



    const fetchData = async () => {
        try {
            const response = await api.get('/activities/list');
            if (user?.role === 'professional') {
                setActivities(response.data);
                // Also fetch connections to invite
                const connRes = await api.get('/connection/list');
                setConnections(connRes.data.filter((c: Connection) => c.status === 'accepted'));
            } else {
                setInvites(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch activities', error);
            toast.error('Failed to load activities');
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const onCreateActivity = async (data: Record<string, unknown>) => {
        try {
            await api.post('/activities/', data);
            toast.success('Activity created');
            reset();
            fetchData();
        } catch (error) {
            console.error(error);
            const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
            const msg = err.response?.data?.message || err.message || 'Failed to create activity';
            if (err.response?.status === 403) {
                toast.error(msg || 'Only professionals can create activities');
            } else {
                toast.error(msg);
            }
        }
    };

    const onInviteClient = async (data: Record<string, unknown>) => {
        try {
            await api.post('/activities/invite', {
                activity_id: data.activity_id,
                client_id: data.client_id
            });
            toast.success('Client invited');
            resetInvite();
        } catch (error: unknown) {
            console.error(error);
            const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
            const msg = err.response?.data?.message || err.message || 'Failed to invite client';
            if (err.response?.status === 403) {
                toast.error(msg || 'Only professionals can invite clients');
            } else {
                toast.error(msg);
            }
        }
    };

    const handleDeleteActivity = async (activityId: number) => {
        if (!window.confirm('Delete this activity? This will remove all invites.')) return;
        try {
            await api.delete(`/activities/${activityId}`);
            toast.success('Activity deleted');
            fetchData();
        } catch (error) {
            console.error('Failed to delete activity', error);
            const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
            const msg = err.response?.data?.message || err.message || 'Failed to delete activity';
            if (err.response?.status === 403) {
                toast.error(msg || 'Only the creator can delete this activity');
            } else {
                toast.error(msg);
            }
        }
    };

    const handleRespond = async (inviteId: number, action: 'accept' | 'decline') => {
        try {
            await api.post('/activities/respond', { invite_id: inviteId, action });
            toast.success(`Invite ${action}ed`);
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error('Failed to respond to invite');
        }
    };

    if (loading || isLoadingData) return <div>Loading...</div>;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
                <Navbar />
                <main className="py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activities</h1>

                        {user?.role === 'professional' ? (
                            <>
                                {/* Create Activity Form */}
                                <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Activity</h2>
                                    <form onSubmit={handleSubmit(onCreateActivity)} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                            <input
                                                type="text"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                {...register('title')}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                            <textarea
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                {...register('description')}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                                        >
                                            Create Activity
                                        </button>
                                    </form>
                                </div>

                                {/* Invite Client Form */}
                                <div className="mt-8 bg-white p-6 rounded-lg shadow">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Invite Client to Activity</h2>
                                    <form onSubmit={handleSubmitInvite(onInviteClient)} className="flex gap-4">
                                        <select
                                            required
                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            {...registerInvite('activity_id')}
                                        >
                                            <option value="">Select Activity</option>
                                            {activities.map(a => (
                                                <option key={a.id} value={a.id}>{a.title}</option>
                                            ))}
                                        </select>
                                        <select
                                            required
                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            {...registerInvite('client_id')}
                                        >
                                            <option value="">Select Client</option>
                                            {connections.map(c => (
                                                <option key={c.id} value={c.client.id}>{c.client.name} ({c.client.email})</option>
                                            ))}
                                        </select>
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                                        >
                                            Invite
                                        </button>
                                    </form>
                                </div>

                                {/* List Activities */}
                                <div className="mt-8">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Your Activities</h2>
                                    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md transition-colors">
                                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {activities.map((activity) => (
                                                <li key={activity.id} className="px-6 py-4">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-lg font-medium text-indigo-600 dark:text-indigo-400">{activity.title}</h3>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(activity.created_at).toLocaleDateString()}</span>
                                                            <button
                                                                onClick={() => handleDeleteActivity(activity.id)}
                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
                                                </li>
                                            ))}
                                            {activities.length === 0 && (
                                                <li className="px-6 py-4 text-center text-gray-500">No activities created</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </>
                        ) : (
                            // Client View
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Activity Invitations</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Note: Creating activities and inviting clients is available to professionals only. Here you can view and respond to invitations sent to you.</p>
                                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md transition-colors">
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {invites.map((invite) => (
                                            <li key={invite.id} className="px-6 py-4 flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-medium text-indigo-600 dark:text-indigo-400">{invite.activity.title}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">{invite.activity.description}</p>
                                                    <p className="text-xs text-gray-400 mt-1">Status: {invite.status}</p>
                                                </div>
                                                {invite.status === 'pending' ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleRespond(invite.id, 'accept')}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleRespond(invite.id, 'decline')}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invite.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                        {invites.length === 0 && (
                                            <li className="px-6 py-4 text-center text-gray-500">No activity invitations</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
