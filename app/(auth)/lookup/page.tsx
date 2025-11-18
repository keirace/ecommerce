import AuthForm from "@/components/auth-form"
import { doesEmailExist } from "@/lib/actions/auth.actions";
import { Suspense } from "react";

const Lookup = () => {
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