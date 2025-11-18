import CartClient from '@/components/cart-client';
import { getCart, getCartItems } from '@/lib/actions/cart.actions';
import { getCurrentUser, getGuestBySessionToken } from '@/lib/actions/auth.actions';
import { cookies } from 'next/headers';

const Cart = async () => {
    const user = await getCurrentUser();

    const guest = user.ok ? null : await getGuestBySessionToken((await cookies()).get("guest_session")?.value || "");

    const cart = await getCart(user.user?.id ?? null, guest ? guest.id : null);
    const cartItems = cart ? await getCartItems(cart.id) : [];

    return <CartClient items={cartItems} />;
}

export default Cart