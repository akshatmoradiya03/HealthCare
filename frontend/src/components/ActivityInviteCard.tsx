'use client';

interface Activity {
    id: number;
    title: string;
    description: string;
    created_at: string;
}

interface ActivityInviteCardProps {
    inviteId: number;
    activity: Activity;
    status: string;
    onAccept?: (id: number) => void;
    onDecline?: (id: number) => void;
}

export default function ActivityInviteCard({
    inviteId,
    activity,
    status,
    onAccept,
    onDecline,
}: ActivityInviteCardProps) {
    const isPending = status === 'pending';

    return (
        <li className="px-6 py-4 flex items-center justify-between">
            <div className="flex-1">
                <h3 className="text-lg font-medium text-indigo-600">{activity.title}</h3>
                {activity.description && (
                    <p className="text-sm text-gray-600">{activity.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">Status: {status}</p>
            </div>
            {isPending ? (
                <div className="flex gap-2">
                    {onAccept && (
                        <button
                            onClick={() => onAccept(inviteId)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                        >
                            Accept
                        </button>
                    )}
                    {onDecline && (
                        <button
                            onClick={() => onDecline(inviteId)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                        >
                            Decline
                        </button>
                    )}
                </div>
            ) : (
                <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
            )}
        </li>
    );
}

