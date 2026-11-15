-- Add an operational status to hospitals.
CREATE TYPE "public"."HospitalStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

ALTER TABLE "public"."Hospitals"
ADD COLUMN "status" "public"."HospitalStatus" NOT NULL DEFAULT 'ACTIVE';
