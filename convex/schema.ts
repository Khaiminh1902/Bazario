import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  listings: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.string(),
    location: v.string(),
    image: v.optional(v.string()),
    userId: v.string(),
  }),
});
