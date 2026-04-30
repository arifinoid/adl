import { t } from "elysia";

export const CreateActivityModel = t.Object({
    title: t.String(),
    description: t.Optional(t.String()),
    scheduledAt: t.Optional(t.String()),
});

export const UpdateActivityModel = t.Object({
    title: t.Optional(t.String()),
    description: t.Optional(t.String()),
    scheduledAt: t.Optional(t.String()),
    isCompleted: t.Optional(t.Boolean()),
});

export const ActivityParamsModel = t.Object({
    id: t.Numeric(),
});

export const ActivityQueryModel = t.Object({
    limit: t.Optional(t.Numeric({ default: 10 })),
    offset: t.Optional(t.Numeric({ default: 0 })),
    completed: t.Optional(t.BooleanString()),
    search: t.Optional(t.String()),
});

export const ActivityModel = t.Object({
    id: t.Number(),
    title: t.String(),
    description: t.Union([t.String(), t.Null()]),
    isCompleted: t.Boolean(),
    scheduledAt: t.Union([t.Date(), t.Null(), t.String()]), // Handle both Date objects and ISO strings
    createdAt: t.Any(), // Simplest for now
    userId: t.Number()
});

export type CreateActivityBody = typeof CreateActivityModel.static;
export type UpdateActivityBody = typeof UpdateActivityModel.static;
export type ActivityQuery = typeof ActivityQueryModel.static;
export type ActivityResponse = typeof ActivityModel.static;
