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
  conversations: defineTable({
    participants: v.array(v.string()),
    listingId: v.optional(v.id("listings")),
    lastMessageTime: v.optional(v.number()),
    lastMessage: v.optional(v.string()),
  }).index("by_participants", ["participants"]),
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.string(),
    content: v.string(),
    timestamp: v.number(),
  }).index("by_conversation", ["conversationId"]),
});
