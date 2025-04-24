import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const applicationTables = {
  articles: defineTable({
    url: v.string(),
    title: v.string(),
    content: v.string(),
    author: v.optional(v.string()),
    byline: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    siteName: v.optional(v.string()),
    textContent: v.string(),
    length: v.number(),
    timestamp: v.number(),
  }).index("by_url", ["url"]),
  
  siteConfigs: defineTable({
    userId: v.id("users"),
    domain: v.string(),
    headers: v.string(),
  }).index("by_user_and_domain", ["userId", "domain"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
