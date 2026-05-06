'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, usePathname } from 'next/navigation';

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

export function AutoLogout() {
    const router = useRouter();
    const pathname = usePathname();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            return;
        }

        const supabase = createClient();

        // 1. Function to actually perform the logout
        const performLogout = async () => {
            // Use the server action route to destroy the cookie
            await fetch('/auth/logout', { method: 'POST' });

            // Redirect with an error message, but only if they are in the portal
            if (pathname.startsWith('/portal')) {
                router.push('/portal/login?error=Session+expired+due+to+inactivity');
            } else {
                router.push('/');
            }
        };

        // 2. The reset timer function
        const resetTimer = async () => {
            // First, quickly check if we even have a user session to care about
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return; // Ignore if not logged in

            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            timerRef.current = setTimeout(() => {
                performLogout();
            }, INACTIVITY_TIMEOUT);
        };

        // 3. Attach listeners
        const events = ['mousemove', 'keydown', 'scroll', 'click'];

        // Wrap the reset timer so it isn't literally firing a million promises a second
        let throttleTimer: NodeJS.Timeout | null = null;
        const handleActivity = () => {
            if (throttleTimer) return;
            throttleTimer = setTimeout(() => {
                resetTimer();
                throttleTimer = null;
            }, 5000); // Only reset the primary timer at most once every 5 seconds
        };

        events.forEach(event => window.addEventListener(event, handleActivity));

        // Initial setup
        resetTimer();

        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity));
            if (timerRef.current) clearTimeout(timerRef.current);
            if (throttleTimer) clearTimeout(throttleTimer);
        };
    }, [pathname, router]);

    return null; // This component is invisible
}
