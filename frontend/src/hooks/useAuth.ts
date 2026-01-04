import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'professional' | 'client';
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = () => {
            const token = Cookies.get('token');
            const storedUser = Cookies.get('user');

            if (token && storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error('Failed to parse user cookie', e);
                    Cookies.remove('user');
                    Cookies.remove('token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (data: Record<string, unknown>) => {
        try {
            const response = await api.post('/auth/login', data);
            const { token, user } = response.data;
            Cookies.set('token', token, { expires: 7 });
            Cookies.set('user', JSON.stringify(user), { expires: 7 });
            setUser(user);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (data: Record<string, unknown>) => {
        try {
            const response = await api.post('/auth/signup', data);
            const { token, user } = response.data;
            Cookies.set('token', token, { expires: 7 });
            Cookies.set('user', JSON.stringify(user), { expires: 7 });
            setUser(user);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        setUser(null);
        router.push('/login');
    };

    return { user, loading, login, signup, logout };
}
