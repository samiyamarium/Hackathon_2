import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL || "http://localhost:3000",
  plugins: [
    jwtClient({
      // The name of the cookie to store the JWT token
      cookieName: "auth_token",
      // A function that returns the JWT token.
      // This is called automatically by Better Auth
      // when the user logs in.
      getToken: async (credentials) => {
        // Make a request to your backend to get a JWT token.
        const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email, // Assuming Better Auth passes credentials like this
            password: credentials.password,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to login");
        }

        const data = await response.json();
        return data.access_token;
      },
    }),
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;
