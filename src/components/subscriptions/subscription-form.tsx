'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEMO_CALLBACK_URL, TELLTIDE_API_BASE } from "@/lib/utils";

const schema = z
  .object({
    userId: z.string().min(2, "Enter a user id"),
    name: z.string().min(4, "Give the alert a human name"),
    webhookUrl: z.string().url("Webhook must be a valid URL").default(DEMO_CALLBACK_URL),
    type: z.enum(["rolling_aggregate", "event_count"]),
    eventType: z.enum(["erc20_transfer", "erc4626_deposit", "erc4626_withdraw"]),
    window: z.string().min(2),
    aggregation: z.enum(["sum", "avg", "min", "max"]).optional(),
    field: z.enum(["assets", "shares", "value"]).optional(),
    conditionOperator: z.enum([">", ">=", "<", "<=", "=", "!="]),
    conditionValue: z.coerce.number().positive("Condition needs a positive number"),
    contractAddress: z.string().optional(),
    contracts: z.string().optional(),
    fromAddress: z.string().optional(),
    toAddress: z.string().optional()
  })
  .superRefine((value, ctx) => {
    if (value.type === "rolling_aggregate") {
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
  });

export type SubscriptionPayload = z.infer<typeof schema>;

interface Props {
  onCreated?: () => void;
}

export function SubscriptionForm({ onCreated }: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    reset
  } = useForm<SubscriptionPayload>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: "demo-user",
      name: "High Vault Withdrawal Alert",
      webhookUrl: DEMO_CALLBACK_URL,
      type: "rolling_aggregate",
      eventType: "erc4626_withdraw",
      window: "2h",
      aggregation: "sum",
      field: "assets",
      conditionOperator: ">",
      conditionValue: 1000000000000
    }
  });

  const type = watch("type");

  const onSubmit = handleSubmit(async values => {
    setIsSubmitting(true);
    setStatus(null);
    try {
      const contracts = values.contracts
        ?.split(/\n|,/) // split newline or comma
        .map(item => item.trim())
        .filter(Boolean);

      const metaConfig: Record<string, unknown> = {
        type: values.type,
        event_type: values.eventType,
        window: values.window,
        condition: {
          operator: values.conditionOperator,
          value: values.conditionValue
        }
      };

      if (values.fromAddress) metaConfig.from_address = values.fromAddress;
      if (values.toAddress) metaConfig.to_address = values.toAddress;
      if (values.contractAddress) metaConfig.contract_address = values.contractAddress;
      if (contracts && contracts.length) metaConfig.contracts = contracts;
      if (values.type === "rolling_aggregate") {
        metaConfig.aggregation = values.aggregation;
        metaConfig.field = values.field;
      }

      const payload = {
        user_id: values.userId,
        name: values.name,
        webhook_url: values.webhookUrl || DEMO_CALLBACK_URL,
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

      setStatus("Subscription created successfully.");
      reset();
      onCreated?.();
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="glass-panel rounded-3xl border border-white/10 bg-slate-950/60 p-6 space-y-4"
    >
      <div>
        <h3 className="text-xl font-semibold">Program a subscription</h3>
        <p className="text-sm text-white/60">Send Tell Tide alerts straight to your webhook.</p>
      </div>

      <Field label="User ID" error={errors.userId?.message}>
        <Input placeholder="alice" {...register("userId")} />
      </Field>

      <Field label="Subscription name" error={errors.name?.message}>
        <Input placeholder="High Vault Withdrawal Alert" {...register("name")} />
      </Field>

      <Field label="Webhook URL" error={errors.webhookUrl?.message}>
        <Input placeholder={DEMO_CALLBACK_URL} {...register("webhookUrl")} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Meta-event type" error={errors.type?.message}>
          <select
            className="h-11 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-sm"
            {...register("type")}
          >
            <option value="rolling_aggregate">Rolling aggregate</option>
            <option value="event_count">Event count</option>
          </select>
        </Field>
        <Field label="Chain event" error={errors.eventType?.message}>
          <select
            className="h-11 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-sm"
            {...register("eventType")}
          >
            <option value="erc20_transfer">ERC20 transfer</option>
            <option value="erc4626_deposit">ERC4626 deposit</option>
            <option value="erc4626_withdraw">ERC4626 withdraw</option>
          </select>
        </Field>
      </div>

      {type === "rolling_aggregate" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Aggregation" error={errors.aggregation?.message}>
            <select
              className="h-11 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-sm"
              {...register("aggregation")}
            >
              <option value="sum">Sum</option>
              <option value="avg">Average</option>
              <option value="min">Min</option>
              <option value="max">Max</option>
            </select>
          </Field>
          <Field label="Field" error={errors.field?.message}>
            <select
              className="h-11 w-full rounded-xl border border-white/20 bg-white/5 px-4 text-sm"
              {...register("field")}
            >
              <option value="assets">assets</option>
              <option value="shares">shares</option>
              <option value="value">value</option>
            </select>
          </Field>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Time window" error={errors.window?.message}>
          <Input placeholder="2h" {...register("window")} />
        </Field>
        <Field label="Condition" error={errors.conditionOperator?.message || errors.conditionValue?.message}>
          <div className="flex gap-2">
            <select
              className="h-11 w-32 rounded-xl border border-white/20 bg-white/5 px-4 text-sm"
              {...register("conditionOperator")}
            >
              <option value=">">&gt;</option>
              <option value=">=">&gt;=</option>
              <option value="<">&lt;</option>
              <option value="<=">&lt;=</option>
              <option value="=">=</option>
              <option value="!=">!=</option>
            </select>
            <Input type="number" {...register("conditionValue", { valueAsNumber: true })} />
          </div>
        </Field>
      </div>

      <div className="grid gap-4">
        <Field label="Contract (single)">
          <Input placeholder="0xVault..." {...register("contractAddress")} />
        </Field>
        <Field label="Contracts (multiple)" helper="Comma or newline separated">
          <Textarea placeholder={"0xVault1...\n0xVault2..."} {...register("contracts")} />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="From address">
          <Input placeholder="0xSender..." {...register("fromAddress")} />
        </Field>
        <Field label="To address">
          <Input placeholder="0xReceiver..." {...register("toAddress")} />
        </Field>
      </div>

      {status && (
        <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
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
  children: React.ReactNode;
}

function Field({ label, error, helper, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <Label>{label}</Label>
        {helper && <span className="text-xs text-white/40">{helper}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
