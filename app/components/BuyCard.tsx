"use client";

import Image from "next/image";
import React from "react";

interface BuyCardProps {
  name: string;
  price: string;
  location: string;
  image?: string;
}

export default function BuyCard({
  name,
  price,
  location,
  image,
}: BuyCardProps) {
  return (
    <div className="bg-white w-72 rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
      <div className="relative w-full h-40 mb-4">
        <Image
          src={image || "https://via.placeholder.com/150"}
          alt={name}
          fill
          className="object-cover rounded-md"
        />
      </div>

      <h2 className="text-lg font-bold text-[#5c3b27]">{name}</h2>
      <p className="text-sm text-gray-600">Meet at: {location}</p>
      <p className="text-md font-semibold text-[#5c3b27] mt-2">${price}</p>
    </div>
  );
}
