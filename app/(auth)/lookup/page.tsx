'use client';
import AuthForm from "@/components/auth-form"
import { doesEmailExist } from "@/lib/actions/auth.actions";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.actions";

const Lookup = () => {
    const router = useRouter();
    useEffect(() => {
        const checkUser = async () => {
            const userResp = await getCurrentUser();
            if (userResp.ok) {
                router.push('/');
            }
        };
        checkUser();
    }, []);

    return (
        <Suspense>
            <AuthForm
                mode="Lookup"
                onSubmit={doesEmailExist}
            />
        </Suspense>
    )
}

export default Lookup;