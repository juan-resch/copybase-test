import { z } from "zod";

export const spreadsheetDataSchema = z.array(
  z.object({
    frequency: z.union([z.literal("Anual"), z.literal("Mensal")]),
    chargesCount: z.number(),
    recurrence: z.number(),
    startDate: z.string(),
    status: z.union([
      z.literal("Ativa"),
      z.literal("Cancelada"),
      z.literal("Trial cancelado"),
      z.literal("Upgrade"),
    ]),
    statusDate: z.string(),
    cancelDate: z.number().nullable().optional(),
    value: z.number(),
    nextCicle: z.string(),
    assinantId: z.string(),
  })
);
export const fds = z.object({
  frequency: z.union([z.literal("Anual"), z.literal("Mensal")]),
  chargesCount: z.number(),
  recurrence: z.number(),
  startDate: z.string(),
  status: z.union([
    z.literal("Ativa"),
    z.literal("Cancelada"),
    z.literal("Trial cancelado"),
    z.literal("Upgrade"),
  ]),
  statusDate: z.string(),
  cancelDate: z.string().nullable().optional(),
  value: z.number(),
  nextCicle: z.string(),
  assinantId: z.string(),
});
