"use client";

import React, { useState } from "react";
import BuyCard from "./components/BuyCard";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  ShoppingBag,
  Plus,
  Loader,
  Package,
} from "lucide-react";

export default function BuyPage() {
  const allItems = useQuery(api.listings.getListings);
  const myItems = useQuery(api.listings.getUserListings);
  const deleteListing = useMutation(api.listings.deleteListing);
  const getOrCreateConversation = useMutation(
    api.messages.getOrCreateConversation
  );
  const currentUserIdentity = useQuery(api.users.getCurrentUserIdentity);
  const router = useRouter();

  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const items = showOnlyMine ? myItems : allItems;

  const filteredItems =
    items?.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleDelete = async (id: Id<"listings">) => {
    await deleteListing({ id });
  };

  const handleContactSeller = async (
    otherUserId: string,
    listingId: Id<"listings">
  ) => {
    try {
      const conversationId = await getOrCreateConversation({
        otherUserId,
        listingId,
      });
      router.push(`/message?convId=${conversationId}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Error starting conversation. Please try again.");
    }
  };

  return (
    <div className="pl-20 min-h-screen bg-[#f5e3d2]">
      <div className="bg-white border-b-2 border-[#f5e3d2] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-[#f5e3d2] rounded-xl">
                <ShoppingBag className="w-6 h-6 text-[#5c3b27]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#5c3b27] mb-1">
                  {showOnlyMine ? "My Listings" : "Bazario Marketplace"}
                </h1>
                <p className="text-[#5c3b27] opacity-70">
                  {!items ? (
                    "Loading..."
                  ) : (
                    <>
                      Discover {filteredItems.length} amazing{" "}
                      {filteredItems.length === 1 ? "item" : "items"}
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/sell")}
                className="flex items-center gap-2 px-4 py-2 bg-[#5c3b27] text-white rounded-xl hover:bg-[#3f2a1b] transition-all duration-200 shadow-md hover:shadow-lg font-medium cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                List Item
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-md relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-[#5c3b27] opacity-50" />
              </div>
              <input
                type="text"
                placeholder="Search items, descriptions, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-[#f5e3d2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c3b27] focus:border-[#5c3b27] transition-all duration-200 text-[#5c3b27] placeholder-[#5c3b27] placeholder-opacity-50"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowOnlyMine((prev) => !prev)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                  showOnlyMine
                    ? "bg-[#5c3b27] text-white shadow-md"
                    : "bg-[#f5e3d2] text-[#5c3b27] hover:bg-[#5c3b27] hover:text-white"
                }`}
              >
                <Filter className="w-4 h-4" />
                {showOnlyMine ? "My Items" : "All Items"}
              </button>
            </div>
          </div>
        </div>

        {!items ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="w-12 h-12 text-[#5c3b27] animate-spin mx-auto mb-4" />
              <p className="text-[#5c3b27] text-lg font-medium">
                Loading amazing items...
              </p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <Package className="w-16 h-16 text-[#5c3b27] opacity-30 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#5c3b27] mb-3">
                {searchTerm
                  ? "No items found"
                  : showOnlyMine
                    ? "No listings yet"
                    : "No items available"}
              </h3>
              <p className="text-[#5c3b27] opacity-70 mb-6">
                {searchTerm
                  ? `Try adjusting your search for "${searchTerm}"`
                  : showOnlyMine
                    ? "Start by creating your first listing!"
                    : "Be the first to list an item!"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => router.push("/sell")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#5c3b27] text-white rounded-xl hover:bg-[#3f2a1b] transition-all duration-200 shadow-md hover:shadow-lg font-medium cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  List Your First Item
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
              <BuyCard
                key={item._id}
                listingId={item._id}
                name={item.name}
                price={`${item.price}`}
                location={item.location}
                description={item.description}
                image={item.image}
                isOwner={
                  currentUserIdentity
                    ? item.userId === currentUserIdentity.subject
                    : false
                }
                onDelete={() => handleDelete(item._id)}
                onContact={() => handleContactSeller(item.userId, item._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
