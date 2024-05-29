import { PrismaClient } from "@prisma/client";

export const UsersModels = new PrismaClient().users;
export const TokensBlacklistModels = new PrismaClient().TokenBlacklist;
export const TenantModels = new PrismaClient().tenants;
export const BiodataModels = new PrismaClient().biodata;
export const AvatarModels = new PrismaClient().avatar;
