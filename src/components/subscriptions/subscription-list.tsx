'use client';

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TELLTIDE_API_BASE } from "@/lib/utils";

interface Subscription {
  id: string;
  name: string;
  user_id: string;
  webhook_url: string;
  meta_event_config: {
    type: string;
    event_type?: string;
    window?: string;
    aggregation?: string;
    field?: string;
    condition?: { operator: string; value: number };
    chain?: string;
    lookback_blocks?: number;
  } & Record<string, unknown>;
}

async function fetchSubscriptions(): Promise<Subscription[]> {
  const response = await fetch(`${TELLTIDE_API_BASE}/api/subscriptions`);
  if (!response.ok) {
    throw new Error("Unable to fetch subscriptions");
  }
  return response.json();
}

export function SubscriptionList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
    refetchInterval: 15000
  });

  return (
    <Card className="h-full space-y-4 border border-white/10 p-5">
      <div>
        <h3 className="text-lg font-semibold">Recent subscriptions</h3>
        <p className="text-xs text-white/60">Pulled directly from the Tell Tide API.</p>
      </div>
      {isLoading && <p className="text-sm text-white/60">Loading subscriptions...</p>}
      {error && (
        <p className="text-sm text-red-400">
          {(error as Error).message}. Confirm the API base URL is reachable.
        </p>
      )}
      <div className="space-y-3">
        {data?.slice(0, 5).map(sub => {
          const config = sub.meta_event_config;
          return (
            <motion.div key={sub.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{sub.name}</p>
                    <p className="text-xs text-white/50">{config.event_type} · {config.chain ?? 'ethereum'}</p>
                  </div>
                  <Badge className="text-[11px] capitalize">{config.type}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-white/65">
                  {config.window && <span>Window: {config.window}</span>}
                  {config.lookback_blocks && <span>Blocks: {config.lookback_blocks}</span>}
                  {config.aggregation && <span>Aggregation: {config.aggregation}</span>}
                  {config.field && <span>Field: {config.field}</span>}
                  {config.condition && (
                    <span>
                      Condition: {config.condition.operator} {config.condition.value}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        {!isLoading && !error && (data?.length ?? 0) === 0 && (
          <p className="text-sm text-white/60">No subscriptions yet. Create your first above.</p>
        )}
      </div>
    </Card>
  );
}
