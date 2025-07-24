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
