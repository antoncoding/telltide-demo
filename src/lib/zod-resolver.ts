import type { FieldErrors, Resolver } from "react-hook-form";
import type { z } from "zod";

function setNestedError(target: Record<string, unknown>, path: (string | number)[], message: string, type: string) {
  let current: Record<string, unknown> = target;
  path.forEach((segment, index) => {
    const key = String(segment);
    if (index === path.length - 1) {
      current[key] = { type, message };
      return;
    }
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  });
}

export function zodResolver<TSchema extends z.ZodTypeAny>(schema: TSchema): Resolver<z.infer<TSchema>> {
  return async values => {
    const result = schema.safeParse(values);

    if (result.success) {
      return {
        values: result.data,
        errors: {}
      };
    }

    const formErrors: FieldErrors<z.infer<TSchema>> = {};

    for (const issue of result.error.issues) {
      setNestedError(formErrors as unknown as Record<string, unknown>, issue.path, issue.message, issue.code);
    }

    return {
      values: {},
      errors: formErrors
    };
  };
}
