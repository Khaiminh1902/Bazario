import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createListing = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.string(),
    location: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.db.insert("listings", {
      ...args,
      userId: identity.subject,
    });
  },
});

export const getListings = query({
  handler: async (ctx) => {
    return await ctx.db.query("listings").collect();
  },
});

export const deleteListing = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const listing = await ctx.db.get(args.id);
    if (!listing) throw new Error("Listing not found");

    if (listing.userId !== identity.subject) {
      throw new Error("You can only delete your own listings");
    }

    await ctx.db.delete(args.id);
  },
});

export const getUserListings = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("listings")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .order("desc")
      .collect();
  },
});
