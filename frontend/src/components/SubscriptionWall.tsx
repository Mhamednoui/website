import Link from "next/link";
import { Lock } from "lucide-react";

export function SubscriptionWall() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-md w-full">
        <div className="flex justify-center mb-5">
          <div className="bg-indigo-500/10 rounded-full p-4">
            <Lock size={28} className="text-indigo-400" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          Subscription required
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Access to courses and videos requires an active subscription.
        </p>
        <Link
          href="/pricing"
          className="inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          View plans
        </Link>
      </div>
    </div>
  );
}
