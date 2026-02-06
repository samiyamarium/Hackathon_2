"use client";

import { useSession, signIn, signOut } from "@/lib/auth-client";

export default function AuthStatus() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div className="w-24 h-9 bg-gray-200 animate-pulse rounded"></div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm">Signed in as {session.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
      Sign In
    </button>
  );
}
