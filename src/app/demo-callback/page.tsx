import { DemoCallbackViewer } from "@/components/callback/demo-callback-viewer";
import { DEMO_CALLBACK_URL } from "@/lib/utils";

export const metadata = {
  title: "Tell Tide | Demo callback",
  description: "Live stream of webhook payloads received by the demo endpoint."
};

export default function DemoCallbackPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-[32px] border border-emerald-500/30 bg-emerald-500/5 p-8">
        <p className="text-sm uppercase tracking-wide text-emerald-300">Webhook inspector</p>
        <h1 className="text-4xl font-semibold">Live Tell Tide callback feed</h1>
        <p className="mt-2 text-white/70">
          Point your subscription webhook to <span className="font-mono text-emerald-200">{DEMO_CALLBACK_URL}</span>
          \, then trigger a meta-event to watch payloads arrive instantly.
        </p>
      </header>
      <DemoCallbackViewer />
    </div>
  );
}
