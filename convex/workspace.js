// convex/workspace.js
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new workspace
export const createWorkspace = mutation({
  args: {
    messages: v.array(v.any()),
    userId: v.id("users"),
    fileData: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error(`Invalid userId: ${args.userId}`);

    return await ctx.db.insert("workspace", {
      messages: args.messages,
      fileData: args.fileData ?? null,
      user: args.userId, // ✅ must match schema
      createdAt: Date.now(),
    });
  },
});

// Get one workspace
export const getWorkspace = query({
  args: { workspaceId: v.id("workspace") }, // ✅ singular
  handler: async (ctx, args) => {
    return await ctx.db.get(args.workspaceId);
  },
});

// Get all workspaces for a user
export const getAllWorkspaces = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workspace")                // ✅ singular
      .withIndex("by_user", (q) => q.eq("user", args.userId))
      .collect();
  },
});

// Update messages
export const updateMessages = mutation({
  args: {
    workspaceId: v.id("workspace"),     // ✅ singular
    messages: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.workspaceId, { messages: args.messages });
    return true;
  },
});

// Update files
export const updateFiles = mutation({
  args: {
    workspaceId: v.id("workspace"),     // ✅ singular
    files: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.workspaceId, { fileData: args.files });
    return true;
  },
});
