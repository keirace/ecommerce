'use client';
import { useEffect } from "react";
import { signOut } from '@/lib/actions/auth.actions';

const SignOut = () => {
    useEffect(() => {
        const handleSignOut = async () => {
            await signOut();
            // Redirect to home page after sign out
            window.location.href = '/';
        };
        handleSignOut();
    }, []);

    return (
        <div>Signing out...</div>
    )
}

export default SignOut