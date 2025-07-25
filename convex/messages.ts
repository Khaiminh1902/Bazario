import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getOrCreateConversation = mutation({
  args: {
    otherUserId: v.string(),
    listingId: v.optional(v.id("listings")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUserId = identity.subject;
    const { otherUserId, listingId } = args;

    if (currentUserId === otherUserId) {
      throw new Error("Cannot create conversation with yourself");
    }

    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("participants"), [currentUserId, otherUserId]),
            listingId
              ? q.eq(q.field("listingId"), listingId)
              : q.eq(q.field("listingId"), undefined)
          ),
          q.and(
            q.eq(q.field("participants"), [otherUserId, currentUserId]),
            listingId
              ? q.eq(q.field("listingId"), listingId)
              : q.eq(q.field("listingId"), undefined)
          )
        )
      )
      .first();

    if (existingConversation) {
      return existingConversation._id;
    }

    const conversationId = await ctx.db.insert("conversations", {
      participants: [currentUserId, otherUserId],
      listingId,
      lastMessageTime: Date.now(),
      lastMessage: "",
    });

    return conversationId;
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { conversationId, content } = args;
    const senderId = identity.subject;

    const conversation = await ctx.db.get(conversationId);
    if (!conversation || !conversation.participants.includes(senderId)) {
      throw new Error("Not authorized to send message in this conversation");
    }

    const timestamp = Date.now();

    await ctx.db.insert("messages", {
      conversationId,
      senderId,
      content,
      timestamp,
      readBy: [senderId],
    });

    await ctx.db.patch(conversationId, {
      lastMessage: content,
      lastMessageTime: timestamp,
    });
  },
});

export const getUserConversations = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const currentUserId = identity.subject;

    const allConversations = await ctx.db.query("conversations").collect();
    const userConversations = allConversations.filter((conv) =>
      conv.participants.includes(currentUserId)
    );

    const conversationsWithDetails = await Promise.all(
      userConversations.map(async (conversation) => {
        const otherUserId = conversation.participants.find(
          (id) => id !== currentUserId
        );

        let listing = null;
        if (conversation.listingId) {
          listing = await ctx.db.get(conversation.listingId);
        }

        return {
          ...conversation,
          otherUserId,
          listing,
        };
      })
    );

    return conversationsWithDetails.sort(
      (a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0)
    );
  },
});

export const getConversationMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const { conversationId } = args;
    const currentUserId = identity.subject;

    const conversation = await ctx.db.get(conversationId);
    if (!conversation || !conversation.participants.includes(currentUserId)) {
      throw new Error("Not authorized to view this conversation");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId)
      )
      .order("asc")
      .collect();

    return messages;
  },
});

export const markMessagesAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { conversationId } = args;
    const currentUserId = identity.subject;

    const conversation = await ctx.db.get(conversationId);
    if (!conversation || !conversation.participants.includes(currentUserId)) {
      throw new Error("Not authorized to access this conversation");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId)
      )
      .collect();

    for (const message of messages) {
      const readBy = message.readBy || [];
      if (!readBy.includes(currentUserId)) {
        await ctx.db.patch(message._id, {
          readBy: [...readBy, currentUserId],
        });
      }
    }
  },
});

export const getUnreadMessageCount = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return 0;
    }

    const currentUserId = identity.subject;

    const allMessages = await ctx.db.query("messages").collect();
    const unreadCount = allMessages.filter((message) => {
      const readBy = message.readBy || [];
      return message.senderId !== currentUserId && !readBy.includes(currentUserId);
    }).length;

    return unreadCount;
  },
});

export const getUnreadCountsByConversation = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {};
    }

    const currentUserId = identity.subject;

    const allMessages = await ctx.db.query("messages").collect();
    const unreadCounts: Record<string, number> = {};

    for (const message of allMessages) {
      const readBy = message.readBy || [];
      if (message.senderId !== currentUserId && !readBy.includes(currentUserId)) {
        const conversationId = message.conversationId;
        unreadCounts[conversationId] = (unreadCounts[conversationId] || 0) + 1;
      }
    }

    return unreadCounts;
  },
});

export const getConversation = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const { conversationId } = args;
    const currentUserId = identity.subject;

    const conversation = await ctx.db.get(conversationId);
    if (!conversation || !conversation.participants.includes(currentUserId)) {
      return null;
    }

    const otherUserId = conversation.participants.find(
      (id) => id !== currentUserId
    );

    let listing = null;
    if (conversation.listingId) {
      listing = await ctx.db.get(conversation.listingId);
    }

    return {
      ...conversation,
      otherUserId,
      listing,
    };
  },
});
