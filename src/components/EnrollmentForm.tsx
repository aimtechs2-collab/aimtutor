"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { api } from "@/lib/api";
import { getStoredGeo } from "@/lib/geo";
import { CreditCard, Lock } from "lucide-react";

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void; on: (ev: string, fn: (r: unknown) => void) => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

type Props = {
  courseId: number;
  courseName: string;
  price: number;
  courseCurrency?: string;
};

export default function EnrollmentForm({
  courseId,
  courseName,
  price,
  courseCurrency = "INR",
}: Props) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const submitting = useRef(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) return;

    const first = user.firstName ?? "";
    const last = user.lastName ?? "";
    const full = `${first} ${last}`.trim();

    setName(full || user.fullName || "");
    setEmail(user.primaryEmailAddress?.emailAddress ?? "");
  }, [isLoaded, user]);

  async function submitContact() {
    try {
      await api.post(
        "/api/v1/contact/contact-forms",
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone_number: phone.trim(),
        },
      );
    } catch {
      /* optional */
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting.current || busy) return;

    if (!isLoaded || !isSignedIn) {
      const geo = getStoredGeo();
      router.push(
        `/${geo.country}/${geo.region}/${geo.city}/login?redirect=${encodeURIComponent(
          typeof window !== "undefined" ? window.location.pathname : "/student"
        )}`
      );
      return;
    }

    submitting.current = true;
    setBusy(true);
    setMsg(null);

    try {
      await submitContact();

      const isFree = !price || price <= 0;
      if (isFree) {
        await api.post(
          "/api/v1/enrollments/enroll-free",
          { course_id: courseId },
        );
        setMsg("Enrolled successfully.");
        router.push("/student/courses");
        return;
      }

      const orderRes = await api.post(
        "/api/v1/payments/create-order",
        { course_id: courseId },
      );
      const orderData = orderRes.data as {
        order_id: string;
        amount: number;
        currency: string;
        payment_id: number;
      };

      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!key) throw new Error("Missing NEXT_PUBLIC_RAZORPAY_KEY_ID");

      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) throw new Error("Razorpay failed to load");

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay!({
          key,
          amount: orderData.amount,
          currency: orderData.currency,
          order_id: orderData.order_id,
          name: "AimTutor.ai",
          description: `Enrollment: ${courseName}`,
          prefill: { name, email, contact: phone },
          handler: async (response: Record<string, string>) => {
            try {
              await api.post(
                "/api/v1/payments/verify-payment",
                {
                  payment_id: orderData.payment_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                },
              );
              setMsg("Payment successful.");
              router.push("/student/courses");
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("PAYMENT_CANCELLED")),
          },
        });
        rzp.on("payment.failed", (r: unknown) => {
          reject(new Error(JSON.stringify(r)));
        });
        rzp.open();
      });
    } catch (err: unknown) {
      const e = err as { message?: string };
      if (e.message === "PAYMENT_CANCELLED") setMsg("Payment cancelled.");
      else setMsg(e.message || "Enrollment failed");
    } finally {
      setBusy(false);
      submitting.current = false;
    }
  }

  function currency(amount: number, code = "INR") {
    try {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: code }).format(amount);
    } catch {
      return `${code} ${amount.toFixed(2)}`;
    }
  }

  return (
    <div className="w-full">
      <div className="rounded-xl border border-gray-200 shadow-lg overflow-hidden bg-white">
        <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-b">
          <div className="mb-2">
            {price > 0 ? (
              <>
                <div className="text-3xl md:text-4xl font-bold text-gray-900">
                  {currency(price, courseCurrency)}
                </div>
                <div className="text-sm text-gray-600 mt-1">One-time payment</div>
              </>
            ) : (
              <>
                <div className="text-3xl md:text-4xl font-bold text-green-600">FREE</div>
                <div className="text-sm text-gray-600 mt-1">No payment required</div>
              </>
            )}
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-500 transition-colors"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={busy}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-500 transition-colors"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy}
                required
                type="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-500 transition-colors"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={busy}
                required
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3.5 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 bg-violet-600 text-white hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {busy ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>{price > 0 ? "Proceed to Payment" : "Enroll Now"}</span>
                </>
              )}
            </button>
            {msg ? <p className="text-sm text-zinc-700">{msg}</p> : null}
          </form>
        </div>

        <div className="bg-gray-50 p-4 border-t">
          <div className="flex items-center gap-3 text-sm">
            <Lock className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-semibold">Secure Payment</div>
              <div className="text-gray-600 text-xs">Powered by Razorpay • 100% Secure</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
