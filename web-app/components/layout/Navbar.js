"use client";

import { Bell, LogOut } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import api from '../../lib/api';

export default function Navbar() {
    const { logout, user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return; // Prevent 401: Wait for auth
            try {
                // Assuming dashboardService is available or use raw API
                const response = await api.get('/notifications');
                if (response.data.success) {
                    const unread = response.data.data.filter(n => !n.is_read).length;
                    setUnreadCount(unread);
                }
            } catch (error) {
                // Silently fail on network errors to avoid console spam
                if (error.code !== 'ERR_NETWORK') {
                    console.error('Failed to fetch notifications:', error.message);
                }
            }
        };

        fetchNotifications();
        // Poll every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [user]); // Re-run when user logs in

    return (
        <div className="flex flex-col lg:ml-64">

            {/* Main Navbar */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                {/* Left side (Breadcrumbs or Page Title) */}
                <div className="flex items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                        My Dashboard
                    </h2>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <Link href="/dashboard/notifications">
                        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />}
                        </button>
                    </Link>

                    <div className="h-6 w-px bg-gray-200" />

                    {/* Logout */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={logout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </header>
        </div>
    );
}