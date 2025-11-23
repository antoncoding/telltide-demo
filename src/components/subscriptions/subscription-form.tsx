'use client';

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { DEMO_CALLBACK_URL, TELLTIDE_API_BASE } from "@/lib/utils";
import { zodResolver } from "@/lib/zod-resolver";

const schema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    name: z.string().min(4, "Give the alert a name"),
    webhookUrl: z.string().url("Webhook must be a valid URL").default(DEMO_CALLBACK_URL),
    chain: z.enum(["ethereum", "base"]),
    type: z.enum(["rolling_aggregate", "event_count", "net_aggregate"]),
    eventType: z.enum([
      "erc20_transfer",
      "erc4626_deposit",
      "erc4626_withdraw",
      "morpho_supply",
      "morpho_withdraw",
      "morpho_borrow",
      "morpho_repay"
    ]),
    positiveEventType: z.enum([
      "erc20_transfer",
      "erc4626_deposit",
      "erc4626_withdraw",
      "morpho_supply",
      "morpho_withdraw",
      "morpho_borrow",
      "morpho_repay"
    ]).optional(),
    negativeEventType: z.enum([
      "erc20_transfer",
      "erc4626_deposit",
      "erc4626_withdraw",
      "morpho_supply",
      "morpho_withdraw",
      "morpho_borrow",
      "morpho_repay"
    ]).optional(),
    window: z.string().min(2),
    aggregation: z.enum(["sum", "avg", "min", "max"]).optional(),
    field: z.enum(["assets", "shares", "value"]).optional(),
    threshold: z.coerce.number(),
    contracts: z.string().optional(),
    marketId: z.string().optional(),
    cooldownMinutes: z.coerce.number().min(0).max(60).default(1),
    lookbackBlocks: z.coerce.number().positive().optional()
  })
  .superRefine((value, ctx) => {
    if (value.type === "rolling_aggregate" || value.type === "net_aggregate") {
      if (!value.aggregation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Aggregation is required",
          path: ["aggregation"]
        });
      }
      if (!value.field) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Field is required",
          path: ["field"]
        });
      }
    }
    if (value.type === "net_aggregate") {
      if (!value.positiveEventType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Positive event type is required for net aggregate",
          path: ["positiveEventType"]
        });
      }
      if (!value.negativeEventType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Negative event type is required for net aggregate",
          path: ["negativeEventType"]
        });
      }
    }
  });

export type SubscriptionPayload = z.infer<typeof schema>;

interface Props {
  onCreated?: () => void;
}

export function SubscriptionForm({ onCreated }: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
    reset,
    setValue
  } = useForm<SubscriptionPayload>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: "demo",
      name: "Morpho Market Net Withdrawal Alert",
      webhookUrl: DEMO_CALLBACK_URL,
      chain: "base",
      type: "net_aggregate",
      eventType: "morpho_supply",
      positiveEventType: "morpho_supply",
      negativeEventType: "morpho_withdraw",
      window: "1h",
      aggregation: "sum",
      field: "assets",
      threshold: -1000000000000,
      cooldownMinutes: 1,
      lookbackBlocks: 10
    }
  });

  const type = watch("type");
  const eventType = watch("eventType");

  // Auto-fill form based on event type for demo purposes
  useEffect(() => {
    if (eventType === "erc20_transfer") {
      // ERC20 Transfer demo scenario
      setValue("name", "ERC20 Transfer Alert");
      setValue("type", "event_count");
      setValue("threshold", 10);
      setValue("window", "2m");
      setValue("contracts", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
      setValue("aggregation", undefined);
      setValue("field", undefined);
    } else if (eventType?.startsWith("morpho_")) {
      // Morpho aggregate demo scenario
      setValue("name", "Morpho Market Net Withdrawal Alert");
      setValue("type", "net_aggregate");
      setValue("positiveEventType", "morpho_supply");
      setValue("negativeEventType", "morpho_withdraw");
      setValue("window", "1h");
      setValue("aggregation", "sum");
      setValue("field", "assets");
      setValue("threshold", -1000000000000);
      setValue("contracts", "");
    }
  }, [eventType, setValue]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const onSubmit = handleSubmit(async values => {
    setIsSubmitting(true);
    setStatus(null);
    // Clear any existing error timeout when starting a new submission
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
    try {
      const contracts = values.contracts
        ?.split(/\n|,/) // split newline or comma
        .map(item => item.trim())
        .filter(Boolean);

      const metaConfig: Record<string, unknown> = {
        chain: values.chain,
        type: values.type,
        event_type: values.eventType,
        window: values.window,
        condition: {
          operator: values.threshold >= 0 ? ">" : "<",
          value: values.threshold
        }
      };

      if (values.lookbackBlocks) metaConfig.lookback_blocks = values.lookbackBlocks;
      if (values.marketId) metaConfig.market_id = values.marketId;

      // Only add contract address for non-Morpho events
      const isMorphoEvent = values.eventType?.startsWith("morpho_");
      if (!isMorphoEvent) {
        if (contracts && contracts.length === 1) metaConfig.contract_address = contracts[0];
        if (contracts && contracts.length > 1) metaConfig.contracts = contracts;
      }

      if (values.type === "rolling_aggregate") {
        metaConfig.aggregation = values.aggregation;
        metaConfig.field = values.field;
      }

      if (values.type === "net_aggregate") {
        metaConfig.positive_event_type = values.positiveEventType;
        metaConfig.negative_event_type = values.negativeEventType;
        metaConfig.aggregation = values.aggregation;
        metaConfig.field = values.field;
      }

      const payload = {
        user_id: values.userId,
        name: values.name,
        webhook_url: values.webhookUrl || DEMO_CALLBACK_URL,
        cooldown_minutes: values.cooldownMinutes,
        meta_event_config: metaConfig
      };

      const response = await fetch(`${TELLTIDE_API_BASE}/api/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to create subscription");
      }

      setStatus("✓ Subscription created successfully.");
      reset();
      onCreated?.();
    } catch (error) {
      const errorMessage = `✗ Failed: ${(error as Error).message}`;
      setStatus(errorMessage);
      // Clear any existing timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      // Auto-clear error message after 5 seconds
      errorTimeoutRef.current = setTimeout(() => setStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Meta-event subscription</h3>
        <p className="text-sm text-white/60">Tell Tide will hit your webhook when this state change occurs.</p>
      </div>

      <Field label="User ID" error={errors.userId?.message}>
        <Input
          placeholder="demo"
          {...register("userId")}
        />
      </Field>

      <Field label="Subscription name" error={errors.name?.message}>
        <Input placeholder="High Vault Withdrawal Alert" {...register("name")} />
      </Field>

      <Field label="Webhook URL" error={errors.webhookUrl?.message}>
        <Input placeholder={DEMO_CALLBACK_URL} {...register("webhookUrl")} />
      </Field>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Chain" error={errors.chain?.message}>
          <Controller
            control={control}
            name="chain"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="Meta-event" error={errors.type?.message}>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rolling_aggregate">Rolling aggregate</SelectItem>
                  <SelectItem value="event_count">Event count</SelectItem>
                  <SelectItem value="net_aggregate">Net aggregate</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="Event" error={errors.eventType?.message}>
          <Controller
            control={control}
            name="eventType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="erc20_transfer">ERC20 transfer</SelectItem>
                  <SelectItem value="erc4626_deposit">ERC4626 deposit</SelectItem>
                  <SelectItem value="erc4626_withdraw">ERC4626 withdraw</SelectItem>
                  <SelectItem value="morpho_supply">Morpho supply</SelectItem>
                  <SelectItem value="morpho_withdraw">Morpho withdraw</SelectItem>
                  <SelectItem value="morpho_borrow">Morpho borrow</SelectItem>
                  <SelectItem value="morpho_repay">Morpho repay</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      {type === "net_aggregate" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Positive event (inflow)" error={errors.positiveEventType?.message}>
            <Controller
              control={control}
              name="positiveEventType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="erc20_transfer">ERC20 transfer</SelectItem>
                    <SelectItem value="erc4626_deposit">ERC4626 deposit</SelectItem>
                    <SelectItem value="morpho_supply">Morpho supply</SelectItem>
                    <SelectItem value="morpho_borrow">Morpho borrow</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Negative event (outflow)" error={errors.negativeEventType?.message}>
            <Controller
              control={control}
              name="negativeEventType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="erc20_transfer">ERC20 transfer</SelectItem>
                    <SelectItem value="erc4626_withdraw">ERC4626 withdraw</SelectItem>
                    <SelectItem value="morpho_withdraw">Morpho withdraw</SelectItem>
                    <SelectItem value="morpho_repay">Morpho repay</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>
      )}

      {(type === "rolling_aggregate" || type === "net_aggregate") && (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Aggregation" error={errors.aggregation?.message}>
            <Controller
              control={control}
              name="aggregation"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sum">Sum</SelectItem>
                    <SelectItem value="avg">Average</SelectItem>
                    <SelectItem value="min">Min</SelectItem>
                    <SelectItem value="max">Max</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Field" error={errors.field?.message}>
            <Controller
              control={control}
              name="field"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assets">assets</SelectItem>
                    <SelectItem value="shares">shares</SelectItem>
                    <SelectItem value="value">value</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Time window" error={errors.window?.message}>
          <Input placeholder="2h or 15m" {...register("window")} />
        </Field>
        <Field label="Threshold" error={errors.threshold?.message}>
          <Input type="number" {...register("threshold", { valueAsNumber: true })} />
        </Field>
      </div>

      {eventType?.startsWith("morpho_") && (
        <Field label="Market ID" helper="Optional: Filter by specific Morpho market" error={errors.marketId?.message}>
          <Input placeholder="0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836" {...register("marketId")} />
        </Field>
      )}

      {!eventType?.startsWith("morpho_") && (
        <Field label="Contracts" helper="Single address or newline separated list">
          <Textarea placeholder={"0xVault... or multiple addresses"} {...register("contracts")} />
        </Field>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Cooldown (minutes)" error={errors.cooldownMinutes?.message}>
          <Input type="number" min={0} max={60} {...register("cooldownMinutes", { valueAsNumber: true })} />
        </Field>
        <Field label="Lookback blocks" helper="Optional" error={errors.lookbackBlocks?.message}>
          <Input type="number" min={1} {...register("lookbackBlocks", { valueAsNumber: true })} />
        </Field>
      </div>

      {status && (
        <p
          className={`rounded-lg border px-4 py-2 text-sm ${
            status.startsWith("✓")
              ? "border-green-500/30 bg-green-500/10 text-green-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {status}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Deploying subscription..." : "Create subscription"}
      </Button>
    </form>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  helper?: string;
  children: ReactNode;
}

function Field({ label, error, helper, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-white/70">
        <Label>{label}</Label>
        {helper && <span className="text-xs text-white/40">{helper}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
