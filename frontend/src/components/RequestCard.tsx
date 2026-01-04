'use client';

interface User {
    id: number;
    name: string;
    email: string;
}

interface RequestCardProps {
    connectionId: number;
    otherUser: User | null;
    status: string;
    initiatedBy: number;
    currentUserId: number;
    onAccept?: (id: number) => void;
    onReject?: (id: number) => void;
    onRemove?: (id: number) => void;
    showActions?: boolean;
}

export default function RequestCard({
    connectionId,
    otherUser,
    status,
    initiatedBy,
    currentUserId,
    onAccept,
    onReject,
    onRemove,
    showActions = true,
}: RequestCardProps) {
    if (!otherUser) {
        return (
            <li className="px-6 py-4 text-gray-500">
                User information unavailable
            </li>
        );
    }

    const isPending = status === 'pending';
    const isOutgoing = String(initiatedBy) === String(currentUserId);
    const isAccepted = status === 'accepted';

    return (
        <li className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <p className="text-sm font-medium text-indigo-600">{otherUser.name}</p>
                <p className="text-sm text-gray-500">{otherUser.email}</p>
            </div>
            <div className="flex items-center gap-4">
                {isPending && !isOutgoing && showActions && (
                    <div className="flex gap-2">
                        {onAccept && (
                            <button
                                onClick={() => onAccept(connectionId)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                            >
                                Accept
                            </button>
                        )}
                        {onReject && (
                            <button
                                onClick={() => onReject(connectionId)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                            >
                                Reject
                            </button>
                        )}
                    </div>
                )}
                {isPending && isOutgoing && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                    </span>
                )}
                {isAccepted && (
                    <>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Connected
                        </span>
                        {onRemove && (
                            <button
                                onClick={() => onRemove(connectionId)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                                Remove
                            </button>
                        )}
                    </>
                )}
                {status === 'rejected' && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Rejected
                    </span>
                )}
            </div>
        </li>
    );
}

