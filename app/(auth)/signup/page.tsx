import AuthForm from "@/components/auth-form"
import { signUp } from "@/lib/actions/auth.actions"
import { Suspense } from "react";

const Signup = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm mode="Sign Up" onSubmit={signUp} />
    </Suspense>
  )
}

export default Signup