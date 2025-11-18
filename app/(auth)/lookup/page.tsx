import AuthForm from "@/components/auth-form"
import { doesEmailExist } from "@/lib/actions/auth.actions";

const Lookup = () => {
    return (
        <AuthForm
            mode="Lookup"
            onSubmit={doesEmailExist}
        />
    )
}

export default Lookup;