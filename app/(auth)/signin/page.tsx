import AuthForm from "@/components/auth-form"
import { signIn } from "@/lib/actions/auth.actions"
import { Suspense } from "react";

const Signin = () => {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm mode="Sign In" onSubmit={signIn} />
    </Suspense>
  )
}

export default Signin