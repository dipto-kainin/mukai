"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export const Redirect = () => {
    const session = useSession();
    const Router = useRouter();
    useEffect(() => {
        if (session.data?.user) {
            Router.push(`/dashboard${session.data.user.id}`);
        }
    }, [session, Router]);
    return null
}
