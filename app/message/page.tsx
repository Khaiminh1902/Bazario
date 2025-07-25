/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Send, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";

export default function MessagePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const conversationId = searchParams.get(
    "convId"
  ) as Id<"conversations"> | null;

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const conversations = useQuery(api.messages.getUserConversations);
  const messages = useQuery(
    api.messages.getConversationMessages,
    conversationId ? { conversationId } : "skip"
  );
  const conversation = useQuery(
    api.messages.getConversation,
    conversationId ? { conversationId } : "skip"
  );
  const sendMessage = useMutation(api.messages.sendMessage);
  const currentUserIdentity = useQuery(api.users.getCurrentUserIdentity);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (conversationId && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [conversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId || isSending) return;

    setIsSending(true);
    const messageContent = newMessage.trim();
    setNewMessage("");

    try {
      await sendMessage({
        conversationId,
        content: messageContent,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setNewMessage(messageContent);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInDays === 1) {
      return (
        "Yesterday " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } else {
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
  };

  if (!conversations) {
    return (
      <div className="pl-20 p-6 bg-[#f5e3d2] min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5c3b27] mx-auto mb-4"></div>
          <p className="text-[#5c3b27] font-medium">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pl-20 bg-[#f5e3d2] min-h-screen flex">
      <div className="w-80 bg-white border-r-2 border-[#f5e3d2] flex flex-col shadow-lg">
        <div className="p-6 border-b-2 border-[#f5e3d2] bg-white">
          <h2 className="text-2xl font-bold text-[#5c3b27]">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-[#5c3b27] opacity-60">
                <Send className="w-12 h-12 mx-auto opacity-30 mb-4" />
                <p className="text-lg font-medium mb-2">No conversations yet</p>
                <p className="text-sm mb-4">
                  Contact sellers to start messaging!
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="text-[#5c3b27] font-medium hover:underline text-sm cursor-pointer"
                >
                  Browse listings →
                </button>
              </div>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => router.push(`/message?convId=${conv._id}`)}
                className={`p-4 border-b border-[#f5e3d2] cursor-pointer transition-all duration-200 hover:bg-[#f5e3d2] hover:shadow-sm ${
                  conversationId === conv._id
                    ? "bg-[#f5e3d2] border-l-4 border-l-[#5c3b27]"
                    : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-[#5c3b27] truncate mb-1">
                      {conv.listing ? `Re: ${conv.listing.name}` : "Chat"}
                    </p>
                    <p className="text-sm text-[#5c3b27] opacity-70 truncate">
                      {conv.lastMessage || "Start a conversation..."}
                    </p>
                  </div>
                  {conv.lastMessageTime && (
                    <span className="text-xs text-[#5c3b27] opacity-50 ml-2 font-medium">
                      {formatTime(conv.lastMessageTime)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {conversationId && conversation && messages ? (
          <>
            <div className="bg-white p-6 border-b-2 border-[#f5e3d2] flex items-center shadow-sm">
              <button
                onClick={() => router.push("/message")}
                className="mr-4 p-2 hover:bg-[#f5e3d2] rounded-lg transition-colors duration-200 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 text-[#5c3b27]" />
              </button>
              <div>
                <h3 className="text-xl font-bold text-[#5c3b27] mb-1">
                  {conversation.listing
                    ? `Re: ${conversation.listing.name}`
                    : "Chat"}
                </h3>
                {conversation.listing && (
                  <p className="text-sm text-[#5c3b27] opacity-70 font-medium">
                    ${conversation.listing.price} •{" "}
                    {conversation.listing.location}
                  </p>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f5e3d2]">
              {messages.length === 0 ? (
                <div className="text-center mt-12">
                  <div className="bg-white p-8 rounded-xl shadow-md mx-auto max-w-md">
                    <p className="text-[#5c3b27] text-lg font-medium mb-2">
                      No messages yet
                    </p>
                    <p className="text-[#5c3b27] opacity-60">
                      Start the conversation!
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => {
                  const isCurrentUser = currentUserIdentity
                    ? message.senderId === currentUserIdentity.subject
                    : false;
                  return (
                    <div
                      key={message._id}
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-sm ${
                          isCurrentUser
                            ? "bg-[#5c3b27] text-white"
                            : "bg-white text-[#5c3b27] border-2 border-white"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-2 ${
                            isCurrentUser
                              ? "text-white opacity-75"
                              : "text-[#5c3b27] opacity-60"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="bg-white p-6 border-t-2 border-[#f5e3d2] shadow-lg"
            >
              <div className="flex space-x-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={isSending}
                  className="flex-1 border-2 border-[#f5e3d2] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5c3b27] focus:border-[#5c3b27] transition-all duration-200 text-[#5c3b27] placeholder-[#5c3b27] placeholder-opacity-50 disabled:opacity-50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e as any);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="bg-[#5c3b27] text-white px-6 py-3 rounded-xl hover:bg-[#3f2a1b] disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-200 shadow-md hover:shadow-lg min-w-[60px] cursor-pointer"
                >
                  {isSending ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#f5e3d2]">
            <div className="text-center bg-white p-12 rounded-2xl shadow-lg max-w-md mx-6">
              <div className="text-[#5c3b27] mb-6">
                <Send className="w-16 h-16 mx-auto opacity-30 mb-4" />
              </div>
              <p className="text-xl font-bold text-[#5c3b27] mb-3">
                Select a conversation
              </p>
              <p className="text-[#5c3b27] opacity-70">
                Choose from your conversations on the left to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
