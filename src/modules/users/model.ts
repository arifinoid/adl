import { t } from "elysia";

export const ProfileResponseModel = t.Object({
    id: t.Number(),
    email: t.String(),
    name: t.String(),
    created_at: t.String(),
});

export type ProfileResponse = typeof ProfileResponseModel.static;
