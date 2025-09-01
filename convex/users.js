import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create user (insert only if not already exists)
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(), // Google/External UID
  },
  handler: async (ctx, args) => {
    // Check if user already exists (by email)
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) return existing;

    const newUserId = await ctx.db.insert("users", {
      name: args.name,
      picture: args.picture,
      email: args.email,
      uid: args.uid,
      token: 50000, // default balance
      createdAt: Date.now(),
    });

    return await ctx.db.get(newUserId); // ✅ return full user object
  },
});

// Public query to fetch a user by email
export const getUser = query({
  args: { email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.email) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

// Update token balance
export const updateToken = mutation({
  args: {
    token: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { token: args.token });
    return true;
  },
});
