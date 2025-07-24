"use client";

import React, { useState } from "react";
import BuyCard from "./components/BuyCard";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function BuyPage() {
  const allItems = useQuery(api.listings.getListings);
  const myItems = useQuery(api.listings.getUserListings);
  const deleteListing = useMutation(api.listings.deleteListing);

  const [showOnlyMine, setShowOnlyMine] = useState(false);

  const items = showOnlyMine ? myItems : allItems;

  const handleDelete = async (id: Id<"listings">) => {
    await deleteListing({ id });
  };

  return (
    <div className="pl-27 p-6 bg-[#f5e3d2] min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-[#5c3b27]">
        Items for Sale
      </h1>

      <button
        className="mb-6 px-4 py-2 bg-[#5c3b27] text-white rounded-md hover:bg-[#40281a] cursor-pointer"
        onClick={() => setShowOnlyMine((prev) => !prev)}
      >
        {showOnlyMine ? "Show All Listings" : "Show My Listings"}
      </button>

      {!items ? (
        <p className="text-[#5c3b27]">Loading listings...</p>
      ) : items.length === 0 ? (
        <p className="text-[#5c3b27]">
          No items {showOnlyMine ? "from you" : "yet"}.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <BuyCard
              key={item._id}
              name={item.name}
              price={`${item.price}`}
              location={item.location}
              description={item.description}
              image={item.image}
              isOwner={item.userId === myItems?.[0]?.userId}
              onDelete={() => handleDelete(item._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
