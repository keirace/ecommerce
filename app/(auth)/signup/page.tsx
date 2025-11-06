'use client';

import AuthForm from "@/components/auth-form"
import { signUp } from "@/lib/auth.actions"
import { useSearchParams } from 'next/navigation';

const Signup = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  return (
    <AuthForm mode="Sign Up" email={email} onSubmit={signUp} />
  )
}

export default Signup