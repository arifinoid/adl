import { t } from "elysia";

export const CreateActivityModel = t.Object({
    title: t.String(),
    description: t.Optional(t.String()),
    scheduledAt: t.Optional(t.String()),
});

export const UpdateActivityModel = t.Partial(CreateActivityModel);

export const ActivityParamsModel = t.Object({
    id: t.Numeric(),
});

export const ActivityQueryModel = t.Object({
    limit: t.Optional(t.Numeric({ default: 10 })),
    offset: t.Optional(t.Numeric({ default: 0 })),
    completed: t.Optional(t.BooleanString()),
    search: t.Optional(t.String()),
});

export type CreateActivityBody = typeof CreateActivityModel.static;
export type UpdateActivityBody = typeof UpdateActivityModel.static;
export type ActivityQuery = typeof ActivityQueryModel.static;
