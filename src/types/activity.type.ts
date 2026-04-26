import { t } from "elysia";

export const CreateActivitySchema = t.Object({
    title: t.String(),
    description: t.Optional(t.String()),
    scheduledAt: t.Optional(t.String()), // ISO String
});

export const UpdateActivitySchema = t.Partial(CreateActivitySchema);

export const ActivityParamsSchema = t.Object({
    id: t.Numeric(),
});

export const ActivityQuerySchema = t.Object({
    limit: t.Optional(t.Numeric({ default: 10 })),
    offset: t.Optional(t.Numeric({ default: 0 })),
    completed: t.Optional(t.BooleanString()),
    search: t.Optional(t.String()),
});

export type CreateActivityBody = typeof CreateActivitySchema.static;
export type UpdateActivityBody = typeof UpdateActivitySchema.static;
export type ActivityQuery = typeof ActivityQuerySchema.static;
