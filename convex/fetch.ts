"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { parse } from 'node-html-parser';
import { getAuthUserId } from "@convex-dev/auth/server";

function getDomain(url: string) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return null;
  }
}

export const fetchArticle = action({
  args: { 
    url: v.string(),
    headers: v.optional(v.string())
  },
  handler: async (ctx, args): Promise<Id<"articles">> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) {
        throw new Error("Must be logged in");
      }

      const domain = getDomain(args.url);
      if (!domain) {
        throw new Error("Invalid URL");
      }

      // Get stored headers for this domain
      const siteConfig = await ctx.runQuery(api.sites.getConfig, {
        domain,
        userId
      });

      // Prepare headers for the fetch request
      const headers: Record<string, string> = {};
      if (siteConfig?.headers) {
        try {
          const storedHeaders = JSON.parse(siteConfig.headers);
          Object.assign(headers, storedHeaders);
        } catch (e) {
          console.error("Failed to parse stored headers:", e);
        }
      }
      
      // Add any headers passed directly to the function
      if (args.headers) {
        try {
          const passedHeaders = JSON.parse(args.headers);
          Object.assign(headers, passedHeaders);
        } catch (e) {
          console.error("Failed to parse passed headers:", e);
        }
      }

      const response = await fetch(args.url, { headers });
      if (!response.ok) {
        throw new Error(`Failed to fetch article: ${response.statusText}`);
      }
      
      const html = await response.text();
      const root = parse(html);
      
      // Get the title
      const title = root.querySelector('title')?.text || 
                   root.querySelector('h1')?.text || 
                   'Untitled Article';

      // Get the author
      const author = root.querySelector('meta[name="author"]')?.getAttribute('content') ||
                    root.querySelector('.author')?.text ||
                    undefined;

      // Get the main content
      const article = root.querySelector('article') || 
                     root.querySelector('main') ||
                     root.querySelector('.article-content') ||
                     root.querySelector('.post-content');

      if (!article) {
        throw new Error("Could not find article content");
      }

      // Remove unwanted elements
      article.querySelectorAll('script, style, iframe, nav, header, footer, .ad, .advertisement, .social-share')
        .forEach(el => el.remove());

      const content = article.innerHTML;
      const textContent = article.text;

      const result = await ctx.runMutation(api.articles.save, {
        url: args.url,
        title: title.trim(),
        content,
        author,
        textContent: textContent.trim(),
        length: textContent.length,
        timestamp: Date.now(),
      });

      return result;
    } catch (error: any) {
      throw new Error(`Error processing article: ${error.message}`);
    }
  },
});
