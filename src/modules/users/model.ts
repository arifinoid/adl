import { t } from "elysia";

export const ProfileResponseModel = t.Object({
    id: t.Number(),
    email: t.String(),
    username: t.String(),
    avatarUrl: t.Union([t.String(), t.Null()]),
    createdAt: t.Any(),
});

export const UpdateProfileModel = t.Object({
    username: t.Optional(t.String()),
    email: t.Optional(t.String()),
    avatarUrl: t.Optional(t.String()),
});

export type ProfileResponse = typeof ProfileResponseModel.static;
export type UpdateProfileBody = typeof UpdateProfileModel.static;
