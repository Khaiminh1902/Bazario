/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import BuyCard from "../components/BuyCard";
import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const wishlistItems = useQuery(api.wishlist.getUserWishlist);
  const createConversation = useMutation(api.messages.getOrCreateConversation);

  const handleContact = async (listing: any) => {
    try {
      const conversationId = await createConversation({
        otherUserId: listing.userId,
        listingId: listing._id,
      });
      router.push(`/message?convId=${conversationId}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-[var(--kindly-light)] p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--kindly-dark)] mx-auto"></div>
            <p className="mt-4 text-[var(--kindly-dark)]">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-[var(--kindly-light)] p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <p className="text-xl text-[var(--kindly-dark)]">
              Please sign in to view your wishlist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pl-20 min-h-screen bg-[#f5e3d2]">
      <div className="bg-white border-b-2 border-[#f5e3d2] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[#f5e3d2] rounded-xl">
              <Heart className="w-6 h-6 text-[#5c3b27]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#5c3b27] mb-1">
                My Wishlist
              </h1>
              <p className="text-[#5c3b27] opacity-70">
                {wishlistItems === undefined ? (
                  "Loading..."
                ) : (
                  <>
                    Items you&apos;ve saved for later ({wishlistItems.length})
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {wishlistItems === undefined ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5c3b27] mx-auto"></div>
            <p className="mt-4 text-[#5c3b27]">Loading your wishlist...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <Heart className="w-16 h-16 text-[#5c3b27] opacity-30 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#5c3b27] mb-3">
                Your wishlist is empty
              </h3>
              <p className="text-[#5c3b27] opacity-70 mb-6">
                Start browsing to add items to your wishlist!
              </p>
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#5c3b27] text-white rounded-xl hover:bg-[#3f2a1b] transition-all duration-200 shadow-md hover:shadow-lg font-medium cursor-pointer"
              >
                <Heart className="w-4 h-4" />
                Start Adding Favorites
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((item) => (
              <BuyCard
                key={item._id}
                listingId={item.listing!._id}
                name={item.listing!.name}
                price={item.listing!.price}
                location={item.listing!.location}
                description={item.listing!.description}
                image={item.listing!.image}
                isOwner={false}
                onContact={() => handleContact(item.listing!)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
