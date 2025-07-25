"use client";

import Image from "next/image";
import React, { useState, memo } from "react";
import { Trash2, X, Heart } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface BuyCardProps {
  listingId: Id<"listings">;
  name: string;
  price: string;
  location: string;
  description: string;
  image?: string;
  onDelete?: () => void;
  isOwner?: boolean;
  onContact?: () => void;
}

const BuyCard = memo(function BuyCard({
  listingId,
  name,
  price,
  location,
  description,
  image,
  onDelete,
  isOwner = false,
  onContact,
}: BuyCardProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Wishlist functionality
  const isInWishlist = useQuery(api.wishlist.isInWishlist, { listingId });
  const addToWishlist = useMutation(api.wishlist.addToWishlist);
  const removeFromWishlist = useMutation(api.wishlist.removeFromWishlist);
  
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isInWishlist) {
        await removeFromWishlist({ listingId });
      } else {
        await addToWishlist({ listingId });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  return (
    <>
      <div
        className="bg-white w-full rounded-xl shadow-md p-4 hover:shadow-lg transition-all relative cursor-pointer"
        onClick={() => setShowDetailsModal(true)}
      >
        <div className="relative w-full h-48 mb-4">
          <Image
            src={image || "https://via.placeholder.com/150"}
            alt={name}
            fill
            className="object-cover rounded-md"
          />
        </div>

        <h2 className="text-lg font-bold text-[#5c3b27]">{name}</h2>
        <p className="text-sm text-gray-600">
          Description: {description.split(" ").slice(0, 10).join(" ")}
          {description.split(" ").length > 10 && "..."}
        </p>
        <p className="text-md font-semibold text-[#5c3b27] mt-2">${price}</p>

        {/* Action buttons */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {/* Wishlist button for non-owners */}
          {!isOwner && (
            <button
              onClick={handleWishlistToggle}
              className={`p-1.5 rounded-full transition-all duration-200 ${
                isInWishlist 
                  ? "bg-[#5c3b27] text-white shadow-md hover:bg-[#3f2a1b]" 
                  : "bg-white/80 text-[#5c3b27] hover:bg-[#5c3b27] hover:text-white shadow-md backdrop-blur-sm"
              }`}
              title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`} />
            </button>
          )}
          
          {/* Delete button for owners */}
          {isOwner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirmModal(true);
              }}
              className="p-1.5 rounded-full bg-white/80 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 shadow-md backdrop-blur-sm"
              title="Delete Listing"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4 text-[#5c3b27]">
              Are you sure you want to delete this listing?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  onDelete?.();
                  setShowConfirmModal(false);
                }}
                className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <X className="w-5 h-5 cursor-pointer" />
            </button>

            <div className="relative w-full h-82 mb-4">
              <Image
                src={image || "https://via.placeholder.com/300"}
                alt={name}
                fill
                className="object-cover rounded-md"
              />
            </div>

            <h2 className="text-xl font-bold text-[#5c3b27] mb-2">{name}</h2>
            <p className="text-gray-700 mb-2">
              <strong>Description:</strong> {description}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Location:</strong> {location}
            </p>
            <p className="text-md font-semibold text-[#5c3b27] mb-6">
              <strong>Price:</strong> ${price}
            </p>

            {!isOwner && (
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  onContact?.();
                }}
                className="cursor-pointer w-full py-2 bg-[#5c3b27] text-white rounded-md hover:bg-[#3f2a1b] transition"
              >
                Contact Seller
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
});

export default BuyCard;
