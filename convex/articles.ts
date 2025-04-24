import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const save = mutation({
  args: {
    url: v.string(),
    title: v.string(),
    content: v.string(),
    author: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    siteName: v.optional(v.string()),
    textContent: v.string(),
    length: v.number(),
    timestamp: v.number(),
  },
  handler: async (ctx, args): Promise<Id<"articles">> => {
    const existing = await ctx.db
      .query("articles")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .unique();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("articles", args);
  },
});

export const get = query({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
