import { PrismaClient } from "@prisma/client";

export const UsersModels = new PrismaClient().users;
export const TokensBlacklistModels = new PrismaClient().TokenBlacklist;
export const TenantModels = new PrismaClient().tenants;
export const CategoryModels = new PrismaClient().category;
export const ProductModels = new PrismaClient().product;
export const BookingModels = new PrismaClient().booking;


// export const BiodataModels = new PrismaClient().biodata;
// export const AvatarModels = new PrismaClient().avatar;
