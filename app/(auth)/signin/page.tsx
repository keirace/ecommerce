'use client';

import AuthForm from "@/components/auth-form"
import { signIn } from "@/lib/actions/auth.actions"
import { useSearchParams } from 'next/navigation';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Signin = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const router = useRouter();

  useEffect(() => {
    if (!email) {
      router.push('/lookup');
    }
  }, [email, router]);

  return (
    <AuthForm mode="Sign In" email={email} onSubmit={signIn} />
  )
}

export default Signin