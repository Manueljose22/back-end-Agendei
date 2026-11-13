-- Add an operational status to hospitals.
CREATE TYPE "HospitalStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

ALTER TABLE "Hospitals"
ADD COLUMN "status" "HospitalStatus" NOT NULL DEFAULT 'ACTIVE';
