"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();
  const utils = api.useUtils();
  const [name, setName] = useState("");
  
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
    },
  });

  return (
    <div className="w-full">
      <div className="mb-8 rounded-xl bg-white/10 p-4">
        {latestPost ? (
          <p className="text-gray-200">
            Your most recent post: 
            <span className="ml-2 font-medium text-purple-400">{latestPost.name}</span>
          </p>
        ) : (
          <p className="text-gray-300">You have no posts yet.</p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ name });
        }}
        className="space-y-4"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="What's on your mind?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-colors focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          type="submit"
          disabled={createPost.isPending}
          className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 font-semibold text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createPost.isPending ? (
            <div className="flex items-center justify-center">
              <svg className="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Post...
            </div>
          ) : (
            "Create Post"
          )}
        </button>
      </form>
    </div>
  );
}
