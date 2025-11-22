import { DemoCallbackViewer } from "@/components/callback/demo-callback-viewer";

export const metadata = {
  title: "Tell Tide | Demo callback",
  description: "Live stream of webhook payloads received by the demo endpoint."
};

export default function DemoCallbackPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-emerald-500/30 bg-slate-950/70 p-8">
        <p className="text-sm uppercase tracking-wide text-emerald-300">Webhook inspector</p>
        <h1 className="text-2xl font-semibold">Live Tell Tide callback feed</h1>
        <p className="mt-2 text-sm text-white/70">
          Use this stream whenever you aim a subscription at the built-in demo endpoint. Every payload
          appears in order so judges can see the meta-event land.
        </p>
      </header>
      <DemoCallbackViewer />
    </div>
  );
}
