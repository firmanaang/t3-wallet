import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";


export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Welcome to <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">T3 App</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
              {hello ? hello.greeting : "Loading tRPC query..."}
            </p>
          </div>

          {/* Auth Section */}
          <div className="mx-auto mb-16 max-w-md rounded-2xl bg-white/5 p-8 backdrop-blur-sm">
            <div className="text-center">
              {session?.user ? (
                <div className="mb-6">
                  <p className="text-xl font-medium text-white">
                    Welcome back, <span className="text-purple-400">{session.user.name}</span>
                  </p>
                </div>
              ) : (
                <p className="mb-6 text-lg text-gray-300">
                  Connect your wallet to get started
                </p>
              )}
            </div>
          </div>

          {/* Posts Section */}
          {session?.user && (
            <div className="mx-auto max-w-2xl rounded-2xl bg-white/5 p-8 backdrop-blur-sm">
              <h2 className="mb-8 text-center text-2xl font-semibold text-white">
                Your Posts
              </h2>
              <LatestPost />
            </div>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
