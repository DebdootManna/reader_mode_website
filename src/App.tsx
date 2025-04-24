import { useState } from "react";
import { Authenticated, Unauthenticated, useAction, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster, toast } from "sonner";
import { Id } from "../convex/_generated/dataModel";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">Reader Mode</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 flex items-start justify-center p-8">
        <div className="w-full max-w-3xl mx-auto">
          <Content />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const [url, setUrl] = useState("");
  const [articleId, setArticleId] = useState<Id<"articles"> | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [headers, setHeaders] = useState("");
  
  const fetchArticle = useAction(api.fetch.fetchArticle);
  const saveConfig = useMutation(api.sites.saveConfig);
  const article = useQuery(api.articles.get, articleId ? { id: articleId } : "skip");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      await toast.promise(
        (async () => {
          const result = await fetchArticle({ url, headers });
          setArticleId(result);
        })(),
        {
          loading: "Fetching article...",
          success: "Article fetched successfully",
          error: (err) => err.message || "Failed to fetch article",
        }
      );
    } catch (error) {
      console.error("Failed to fetch article:", error);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      const domain = new URL(url).hostname;
      await saveConfig({ domain, headers });
      toast.success("Site configuration saved");
      setShowConfig(false);
    } catch (error) {
      console.error("Failed to save configuration:", error);
      toast.error("Failed to save configuration");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold accent-text mb-4">Reader Mode</h1>
        <p className="text-xl text-slate-600">
          Read articles in a clean, distraction-free format
        </p>
      </div>

      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>

      <Authenticated>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            ⚙️
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Read
          </button>
        </form>

        {showConfig && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Site Configuration</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your authentication headers as a JSON object (e.g., {`{"cookie": "session=abc123"}`})
            </p>
            <form onSubmit={handleSaveConfig} className="flex flex-col gap-4">
              <textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                placeholder='{"cookie": "session=abc123"}'
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        {article && (
          <article className="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            {article.author && (
              <p className="text-gray-600 mb-6">By {article.author}</p>
            )}
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        )}
      </Authenticated>
    </div>
  );
}
