import { z } from 'zod';

// Contract 1 of 5: the only thing a client (human or bot) may send into a match. The server never accepts state.
// The zod schema is the single definition: the TypeScript type is inferred from it and the server validates
// every incoming message with it, so a malformed intent is rejected at the boundary.

const id = z.number().int().nonnegative();

/** Reference to something a card can target. Exactly one field is set. */
export const TargetRefSchema = z
  .object({
    unitInstanceId: id.optional(),
    heroSeat: z.union([z.literal(0), z.literal(1)]).optional(),
    handCardInstanceId: id.optional(),
    choiceIndex: id.optional(),
  })
  .strict()
  .refine((t) => Object.values(t).filter((v) => v !== undefined).length === 1, 'A target sets exactly one field.');

export const IntentSchema = z.discriminatedUnion('type', [
  /** Return the listed hand cards and draw replacements. */
  z.object({ type: z.literal('mulligan'), cardInstanceIds: z.array(id) }).strict(),
  /** Answer "do you want to go first?". */
  z.object({ type: z.literal('chooseOrder'), wantsFirst: z.boolean() }).strict(),
  /** Play a card from hand. `lane` is required for units (0..3). */
  z.object({ type: z.literal('playCard'), cardInstanceId: id, lane: z.number().int().min(0).max(3).nullable(), targets: z.array(TargetRefSchema) }).strict(),
  /** End the active player's current step (units / mixed / actions). */
  z.object({ type: z.literal('endStep') }).strict(),
  /** Answer the current PendingInteraction (e.g. pre-combat target). */
  z.object({ type: z.literal('answerPending'), pendingId: z.string().min(1), targets: z.array(TargetRefSchema) }).strict(),
  z.object({ type: z.literal('surrender') }).strict(),
]);

export type TargetRef = z.infer<typeof TargetRefSchema>;
export type Intent = z.infer<typeof IntentSchema>;
export type IntentType = Intent['type'];
