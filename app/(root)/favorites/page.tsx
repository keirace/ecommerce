'use client'
import React, { useEffect } from 'react'
import { getCurrentUser } from '@/lib/actions/auth.actions'
import { useRouter } from 'next/navigation'
import Card from '@/components/card'
import { fetchUserFavorites, removeProductFromFavorites } from '@/lib/actions/wishlist.actions'
import Image from 'next/image';

const Favorites = () => {
    const router = useRouter();
    const [favorites, setFavorites] = React.useState<CardProps[]>([]);
    const [removingIds, setRemovingIds] = React.useState<string[]>([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const userResp = await getCurrentUser();
            if (userResp.ok && userResp.user) {
                // Fetch and display favorite items for the user
                const favorites = await fetchUserFavorites(userResp.user.id);
                setFavorites(favorites);
            } else {
                router.push('/lookup');
            }
        };
        fetchFavorites();
    }, [router]);

    const handleRemoveFavorite = async (productId: string) => {
        const userResp = await getCurrentUser();
        if (userResp.ok && userResp.user) {
            // Remove item from favorites
            await removeProductFromFavorites(productId, userResp.user.id);
            setFavorites(favorites.filter(item => item.id !== productId));
            setRemovingIds(prev => [...prev, productId]);
        }
    };

    return (
        <main className="min-h-screen mx-auto max-w-7xl py-32 px-8">
            <h1 className="text-2xl font-bold">Your Favorites</h1>
            {favorites.length === 0 ? (
                <p className="mt-32 flex justify-center">Items added to your Favorites will be saved here.</p>
            ) : (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {favorites.map((item, index) => (
                        <div key={index} className="relative">
                            <button className='absolute right-3 top-3 z-30 rounded-full bg-white p-2' onClick={() => handleRemoveFavorite(item.id)}>
                                <Image src={removingIds.includes(item.id) ? "/heart.svg" : "/heart-fill.svg"} alt="Remove from favorites" width={20} height={20} />
                            </button>
                            <Card {...item} />
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}

export default Favorites