// convex/schema.js
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
    token: v.optional(v.number()),
    createdAt: v.optional(v.number()),
  }).index("by_email", ["email"]),

  workspace: defineTable({
    messages: v.array(v.any()),
    fileData: v.optional(v.any()),
    user: v.id("users"),              // ✅ link to users table
    createdAt: v.optional(v.number()),
  }).index("by_user", ["user"]),       // ✅ for querying user’s workspaces
});
