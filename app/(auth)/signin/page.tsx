'use client';

import AuthForm from "@/components/auth-form"
import { signIn } from "@/lib/auth.actions"
import { useSearchParams } from 'next/navigation';

const Signin = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  return (
    <AuthForm mode="Sign In" email={email} onSubmit={signIn} />
  )
}

export default Signin