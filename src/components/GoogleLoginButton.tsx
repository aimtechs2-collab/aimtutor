"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { api } from "@/lib/api";
import { saveRefreshToken, saveToken, saveUser, type AuthUser } from "@/lib/auth";
import { setUser } from "@/store/authSlice";

export default function GoogleLoginButton() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_APP_GOOGLE_CLIENT_ID;
    if (!clientId || typeof window === "undefined") return;

    const w = window as unknown as {
      google?: {
        accounts: {
          id: {
            initialize: (cfg: { client_id: string; callback: (r: { credential: string }) => void }) => void;
            renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
          };
        };
      };
    };

    const init = () => {
      if (!w.google) return;
      w.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            const res = await api.post("/api/v1/auth/google", { token: response.credential });
            const access = res.data?.access_token as string | undefined;
            const refresh = res.data?.refresh_token as string | undefined;
            const user = res.data?.user as AuthUser | undefined;
            if (!access) throw new Error("Missing access_token");
            saveToken(access);
            if (refresh) saveRefreshToken(refresh);
            if (user) {
              saveUser(user);
              dispatch(setUser(user));
            }
            router.push("/student/profile");
          } catch (e) {
            console.error(e);
          }
        },
      });
      const el = document.getElementById("gSignInDiv");
      if (el) {
        w.google.accounts.id.renderButton(el, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
        });
      }
    };

    const id = window.setInterval(() => {
      if (w.google) {
        window.clearInterval(id);
        init();
      }
    }, 100);

    return () => window.clearInterval(id);
  }, [dispatch, router]);

  if (!process.env.NEXT_PUBLIC_APP_GOOGLE_CLIENT_ID) {
    return <p className="text-sm text-zinc-500">Set NEXT_PUBLIC_APP_GOOGLE_CLIENT_ID to enable Google sign-in.</p>;
  }

  return <div id="gSignInDiv" />;
}
