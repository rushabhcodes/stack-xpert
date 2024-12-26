import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { AppwriteException, ID, Models } from "node-appwrite";
import { account } from "@/models/client/config";

export interface UserPref {
  theme: "light" | "dark";
  reputation: number;
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPref> | null;
  hydrated: boolean;

  setHydrated(): void;
  verifySession(): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    error?: AppwriteException | null | undefined;
  }>;
  createAccount(
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  logout(): Promise<void>;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set({
          hydrated: true,
        });
      },
      async verifySession() {
        try {
          const session = await account.getSession("current");
          set({ session });
        } catch (error) {
          console.error(error);
        }
      },
      async login(email: string, password: string) {
        try {
          const session = await account.createSession(email, password);
          const [user, { jwt }] = await Promise.all([
            account.get<UserPref>(),
            account.createJWT(),
          ]);
          if (!user.prefs?.reputation)
            await account.updatePrefs<UserPref>({ reputation: 0 });

          set({ session, user, jwt });
          return { success: true, error: null };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error:
              error instanceof AppwriteException
                ? error
                : new AppwriteException("An unknown error occurred"),
          };
        }
      },
      async createAccount(email: string, password: string, name: string) {
        try {
          await account.create(ID.unique(), email, password, name);
          return { success: true, error: null };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error:
              error instanceof AppwriteException
                ? error
                : new AppwriteException("An unknown error occurred"),
          };
        }
      },

      async logout() {
        try {
          await account.deleteSessions();
          set({ session: null, user: null, jwt: null });
        } catch (error) {
          console.log(error);
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage: () => {
        return (state, error) => {
          if (!error) {
            state?.setHydrated();
          }
        };
      },
    }
  )
);
