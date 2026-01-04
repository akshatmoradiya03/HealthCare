'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false);
            }
        };

        if (profileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileMenuOpen]);

    if (!user) return null;

    const navigation = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Requests', href: '/requests' },
        { name: 'Activities', href: '/activities' },
    ];

    // Get user initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-sm transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            {/* <img src="" alt="HealthCare Logo" className="h-8 w-auto" /> */}
                            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">HealthCare</span>
                        </div>
                        {/* Desktop Navigation */}
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        pathname === item.href
                                            ? 'border-indigo-500 text-gray-900 dark:text-white'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200',
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors'
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    {/* Desktop Profile Menu */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>

                        <div className="ml-3 relative" ref={profileMenuRef}>
                            <button
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                                id="user-menu-button"
                                aria-expanded="false"
                                aria-haspopup="true"
                            >
                                <span className="sr-only">Open user menu</span>
                                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm hover:bg-indigo-700 transition-colors">
                                    {getInitials(user.name)}
                                </div>
                            </button>

                            {/* Profile Dropdown Menu */}
                            {profileMenuOpen && (
                                <div className="absolute right-0 z-50 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">{user.role}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setProfileMenuOpen(false);
                                                logout();
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            role="menuitem"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!mobileMenuOpen ? (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden bg-white dark:bg-gray-900 shadow-lg">
                    <div className="pt-2 pb-3 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    pathname === item.href
                                        ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                                        : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-800 dark:hover:text-white',
                                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors'
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="px-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                                    {getInitials(user.name)}
                                </div>
                                <div className="space-y-1">
                                    <div className="text-base font-medium text-gray-800 dark:text-white">
                                        {user.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                        {user.role}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                            >
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>
                        </div>
                        <div className="mt-3 px-2">
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    logout();
                                }}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
