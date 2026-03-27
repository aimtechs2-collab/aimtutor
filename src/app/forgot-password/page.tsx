"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import { getStoredGeo } from "@/lib/geo";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await api.post("/api/v1/auth/send-token", { email });
      setMsg("If the account exists, reset instructions have been requested.");
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
      setMsg(ax.response?.data?.error || ax.response?.data?.message || ax.message || "Request failed");
    } finally {
      setBusy(false);
    }
  }

  const geo = typeof window !== "undefined" ? getStoredGeo() : { country: "in", region: "ts", city: "hyderabad" };

  return (
    <main className="mx-auto max-w-md px-4 py-16 space-y-4">
      <h1 className="text-2xl font-semibold">Forgot password</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="w-full rounded bg-black text-white py-2 disabled:opacity-60" disabled={busy} type="submit">
          {busy ? "Sending…" : "Send reset token"}
        </button>
      </form>
      {msg && <p className="text-sm text-zinc-700">{msg}</p>}
      <p className="text-sm">
        <Link className="underline" href={`/${geo.country}/${geo.region}/${geo.city}/login`}>
          Back to login
        </Link>
      </p>
    </main>
  );
}
