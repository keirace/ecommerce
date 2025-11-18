'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

type Props = {
  mode: 'Sign In' | 'Sign Up' | 'Lookup';
  onSubmit: (formData: FormData) => Promise<{ ok: boolean; userId?: string; exists?: boolean } | void>;
}

export default function AuthForm({ mode, onSubmit }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      router.push('/lookup');
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const result = await onSubmit(formData);

      if (mode === 'Lookup' && result?.ok) {
        const email = String(formData.get('email') ?? '');
        if (result.exists) {
          router.push(`/signin?email=${encodeURIComponent(email)}`);
        } else {
          router.push(`/signup?email=${encodeURIComponent(email)}`);
        }
        return;
      }

      if (result?.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Invalid email or password");
      setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
    }
  }

  return (
      <div className="min-h-screen mx-auto max-w-xl space-y-6">
        <div className="flex flex-col items-center gap-10 p-10">
          {error && (<div className="fixed top-4 right-4 bg-red-700 text-white px-4 py-2 rounded-2xl">
            {error}
          </div>)}

          <Image src="/Logo_NIKE.svg" alt="Nike Logo" width={60} height={60} />
          <h2 className="text-heading-3">{mode === 'Lookup' ? 'Enter your email to join us or sign in.' : mode === 'Sign In' ? 'Welcome back!' : 'Create an account'}</h2>

          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            {mode !== 'Lookup' ? (
              <div className="inline-flex items-center gap-2 mb-4">
                <p className="text-body">{email}</p><Link href="/lookup" className="font-caption text-dark-700 underline hover:cursor-pointer hover:text-dark-500">edit</Link>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  type="hidden"
                  name="email"
                  value={email}
                />
              </div>
            ) : (
              <>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email address"
                  required
                  className="rounded-md border border-gray-300 p-4 focus:border-black focus:outline-none"
                />
              </>
            )}
            {mode === 'Sign Up' && (
              <>
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  required
                  className="rounded-md border border-gray-300 p-4 focus:border-black focus:outline-none"
                />
              </>
            )}

            {mode !== 'Lookup' && (
              <div className="relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  type={show ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="minimum 8 characters"
                  minLength={8}
                  required
                  autoComplete={mode === 'Sign Up' ? 'new-password' : 'current-password'}
                  className="w-full rounded-md border border-gray-300 p-4 focus:border-black focus:outline-none"
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center font-semibold" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} >
                  {show ? 'Hide' : 'Show'}
                </button>
              </div>
            )}

            {mode === 'Lookup' && (
              <p className="text-dark-700 py-5">By continuing, I agree to Nike&apos;s <span className="font-bold underline hover:cursor-pointer">Privacy Policy</span> and <span className="font-bold underline hover:cursor-pointer">Terms of Use</span>.</p>
            )}

            {mode === 'Sign In' && (
              <div className="flex justify-between items-center py-5">
                <Link href="/reset-password" className="font-caption text-dark-700 underline hover:cursor-pointer hover:text-dark-500">Forgot password?</Link>
              </div>
            )}

            {mode === 'Sign Up' && (
              <div className="flex flex-row items-start gap-3 py-5">
                <input type="checkbox" id="terms" name="terms" className="mt-0.5 h-5 w-5 rounded-2xl accent-black" />
                <p className="">I agree to Nike&apos;s <span className="font-bold underline hover:cursor-pointer">Privacy Policy</span> and <span className="font-bold underline hover:cursor-pointer">Terms of Use</span>.</p>
              </div>
            )}

            <div className="flex justify-end">
              <button type="submit" className="rounded-full bg-black px-7 py-3 text-white font-semibold hover:bg-dark-700 hover:cursor-pointer">
                {mode === 'Lookup' ? 'Continue' : mode === 'Sign In' ? 'Sign In' : 'Sign Up'}
              </button>
            </div>

            {/* </div> */}
          </form>
        </div>
      </div>
  );
}
