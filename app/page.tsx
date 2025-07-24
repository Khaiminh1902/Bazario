"use client";

import React from "react";
import BuyCard from "./components/BuyCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function BuyPage() {
  const items = useQuery(api.listings.getListings);

  return (
    <div className="pl-27 p-6 bg-[#f5e3d2] min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-[#5c3b27]">
        Items for Sale
      </h1>

      {!items ? (
        <p className="text-[#5c3b27]">Loading listings...</p>
      ) : items.length === 0 ? (
        <p className="text-[#5c3b27]">
          No items yet. Be the first to list something!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <BuyCard
              key={item._id}
              name={item.name}
              price={`${item.price}`}
              location={item.location}
              image={item.image}
            />
          ))}
        </div>
      )}
    </div>
  );
}
