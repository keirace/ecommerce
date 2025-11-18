import CartClient from '@/components/cart-client';
import { getCart, getCartItems } from '@/lib/actions/cart.actions';
import { getCurrentUser, getGuestBySessionToken } from '@/lib/actions/auth.actions';
import { cookies } from 'next/headers';

const Cart = async () => {
    const user = await getCurrentUser();
    console.log("Current user in Cart page:", user);

    const guest = user.ok ? null : await getGuestBySessionToken((await cookies()).get("guest_session")?.value || "");

    console.log("Current guest in Cart page:", guest);

    const cart = await getCart(user.user?.id ?? null, guest ? guest.id : null);
    const cartItems = cart ? await getCartItems(cart.id) : [];

    return <CartClient items={cartItems} />;
}

export default Cart