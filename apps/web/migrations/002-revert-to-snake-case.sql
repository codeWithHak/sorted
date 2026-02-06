-- Revert camelCase columns back to snake_case
-- (Undoes the camelCase rename that was applied earlier)

-- account table
ALTER TABLE "account" RENAME COLUMN "accountId" TO "account_id";
ALTER TABLE "account" RENAME COLUMN "providerId" TO "provider_id";
ALTER TABLE "account" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "account" RENAME COLUMN "accessToken" TO "access_token";
ALTER TABLE "account" RENAME COLUMN "refreshToken" TO "refresh_token";
ALTER TABLE "account" RENAME COLUMN "idToken" TO "id_token";
ALTER TABLE "account" RENAME COLUMN "accessTokenExpiresAt" TO "access_token_expires_at";
ALTER TABLE "account" RENAME COLUMN "refreshTokenExpiresAt" TO "refresh_token_expires_at";
ALTER TABLE "account" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "account" RENAME COLUMN "updatedAt" TO "updated_at";

-- session table
ALTER TABLE "session" RENAME COLUMN "expiresAt" TO "expires_at";
ALTER TABLE "session" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "session" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "session" RENAME COLUMN "ipAddress" TO "ip_address";
ALTER TABLE "session" RENAME COLUMN "userAgent" TO "user_agent";
ALTER TABLE "session" RENAME COLUMN "userId" TO "user_id";

-- verification table
ALTER TABLE "verification" RENAME COLUMN "expiresAt" TO "expires_at";
ALTER TABLE "verification" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "verification" RENAME COLUMN "updatedAt" TO "updated_at";

-- jwks table
ALTER TABLE "jwks" RENAME COLUMN "publicKey" TO "public_key";
ALTER TABLE "jwks" RENAME COLUMN "privateKey" TO "private_key";
ALTER TABLE "jwks" RENAME COLUMN "createdAt" TO "created_at";
