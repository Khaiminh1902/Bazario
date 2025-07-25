import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Add item to wishlist
export const addToWishlist = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if already in wishlist
    const existing = await ctx.db
      .query("wishlist")
      .withIndex("by_user_listing", (q) => 
        q.eq("userId", userId).eq("listingId", args.listingId)
      )
      .first();

    if (existing) {
      throw new Error("Item already in wishlist");
    }

    await ctx.db.insert("wishlist", {
      userId,
      listingId: args.listingId,
      addedAt: Date.now(),
    });
  },
});

// Remove item from wishlist
export const removeFromWishlist = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const wishlistItem = await ctx.db
      .query("wishlist")
      .withIndex("by_user_listing", (q) => 
        q.eq("userId", userId).eq("listingId", args.listingId)
      )
      .first();

    if (!wishlistItem) {
      throw new Error("Item not in wishlist");
    }

    await ctx.db.delete(wishlistItem._id);
  },
});

// Get user's wishlist with listing details
export const getUserWishlist = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const wishlistItems = await ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const wishlistWithListings = await Promise.all(
      wishlistItems.map(async (item) => {
        const listing = await ctx.db.get(item.listingId);
        return {
          _id: item._id,
          addedAt: item.addedAt,
          listing,
        };
      })
    );

    // Filter out items where listing no longer exists
    return wishlistWithListings.filter((item) => item.listing !== null);
  },
});

// Check if item is in user's wishlist
export const isInWishlist = query({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }

    const wishlistItem = await ctx.db
      .query("wishlist")
      .withIndex("by_user_listing", (q) => 
        q.eq("userId", userId).eq("listingId", args.listingId)
      )
      .first();

    return wishlistItem !== null;
  },
});
