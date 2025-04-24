import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const saveConfig = mutation({
  args: {
    domain: v.string(),
    headers: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const existing = await ctx.db
      .query("siteConfigs")
      .withIndex("by_user_and_domain", (q) => 
        q.eq("userId", userId).eq("domain", args.domain)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { headers: args.headers });
      return existing._id;
    }

    return await ctx.db.insert("siteConfigs", {
      userId,
      domain: args.domain,
      headers: args.headers,
    });
  },
});

export const getConfig = query({
  args: {
    domain: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("siteConfigs")
      .withIndex("by_user_and_domain", (q) => 
        q.eq("userId", args.userId).eq("domain", args.domain)
      )
      .unique();
  },
});
