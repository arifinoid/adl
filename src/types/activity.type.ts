import { t } from "elysia";

export const CreateActivitySchema = t.Object({
    title: t.String(),
    description: t.Optional(t.String()),
    scheduledAt: t.Optional(t.String()), // ISO String
});

export const UpdateActivitySchema = t.Partial(CreateActivitySchema);

export type CreateActivityBody = typeof CreateActivitySchema.static;
export type UpdateActivityBody = typeof UpdateActivitySchema.static;

export const ActivityParamsSchema = t.Object({
    id: t.Numeric(),
});
