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
    <Card className="h-full space-y-4 p-6">
      <div>
        <h3 className="text-xl font-semibold">Existing subscriptions</h3>
        <p className="text-sm text-white/60">Live data from Tell Tide API.</p>
      </div>
      {isLoading && <p className="text-sm text-white/60">Loading subscriptions...</p>}
      {error && (
        <p className="text-sm text-red-400">
          {(error as Error).message}. Confirm the API base URL is reachable.
        </p>
      )}
      <div className="space-y-3">
        {data?.slice(0, 5).map(sub => (
          <motion.div key={sub.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{sub.name}</p>
                <Badge>{sub.meta_event_config.type}</Badge>
              </div>
              <p className="text-xs text-white/50">{sub.meta_event_config.event_type}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/60">
                {sub.meta_event_config.window && <span>Window: {sub.meta_event_config.window}</span>}
                {sub.meta_event_config.aggregation && (
                  <span>Aggregation: {sub.meta_event_config.aggregation}</span>
                )}
                {sub.meta_event_config.field && <span>Field: {sub.meta_event_config.field}</span>}
                {sub.meta_event_config.condition && (
                  <span>
                    Condition: {sub.meta_event_config.condition.operator} {sub.meta_event_config.condition.value}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {!isLoading && !error && (data?.length ?? 0) === 0 && (
          <p className="text-sm text-white/60">No subscriptions yet. Create your first above.</p>
        )}
      </div>
    </Card>
  );
}
