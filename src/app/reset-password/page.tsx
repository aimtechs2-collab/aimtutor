"use client";

import { FormEvent, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { getStoredGeo } from "@/lib/geo";

function ResetForm() {
  const search = useSearchParams();
  const token = search.get("token");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const geo = typeof window !== "undefined" ? getStoredGeo() : { country: "in", region: "ts", city: "hyderabad" };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) {
      setMsg("Missing token in URL");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      await api.post(`/api/v1/auth/reset-password?token=${encodeURIComponent(token)}`, {
        password,
      });
      setMsg("Password updated. You can sign in now.");
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } }; message?: string };
      setMsg(ax.response?.data?.error || ax.message || "Reset failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16 space-y-4">
      <h1 className="text-2xl font-semibold">Reset password</h1>
      {!token && <p className="text-sm text-red-700">Invalid reset link.</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded border px-3 py-2"
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full rounded bg-black text-white py-2 disabled:opacity-60" disabled={busy || !token} type="submit">
          {busy ? "Saving…" : "Update password"}
        </button>
      </form>
      {msg && <p className="text-sm text-zinc-700">{msg}</p>}
      <p className="text-sm">
        <Link className="underline" href={`/${geo.country}/${geo.region}/${geo.city}/login`}>
          Go to login
        </Link>
      </p>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <ResetForm />
    </Suspense>
  );
}
