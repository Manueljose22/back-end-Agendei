-- Weekly doctor schedules, service-specific durations and appointment duration snapshots.
-- Existing availability and appointment rows are preserved.

ALTER TABLE "Doctors_Services"
ADD COLUMN "duration_minutes" INTEGER NOT NULL DEFAULT 45;

ALTER TABLE "Appointments"
ADD COLUMN "booking_end" TEXT,
ADD COLUMN "duration_minutes" INTEGER;

CREATE TYPE "ScheduleExceptionType" AS ENUM (
  'BLOCK_DAY',
  'BLOCK_PERIOD',
  'EXTRA_PERIOD'
);

CREATE TABLE "doctor_schedules" (
  "id" TEXT NOT NULL,
  "doctorId" TEXT NOT NULL,
  "timezone" TEXT NOT NULL DEFAULT 'Africa/Luanda',
  "booking_window_days" INTEGER NOT NULL DEFAULT 90,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "doctor_schedules_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "schedule_rules" (
  "id" TEXT NOT NULL,
  "schedule_id" TEXT NOT NULL,
  "weekday" INTEGER NOT NULL,
  "start_minute" INTEGER NOT NULL,
  "end_minute" INTEGER NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "effective_from" DATE,
  "effective_until" DATE,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "schedule_rules_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "schedule_exceptions" (
  "id" TEXT NOT NULL,
  "schedule_id" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "type" "ScheduleExceptionType" NOT NULL,
  "start_minute" INTEGER,
  "end_minute" INTEGER,
  "reason" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "schedule_exceptions_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "availabilities"
ADD COLUMN "schedule_rule_id" TEXT;

-- A doctor may now have several distinct working periods on the same date.
DROP INDEX IF EXISTS "availabilities_doctorId_date_key";

CREATE UNIQUE INDEX "doctor_schedules_doctorId_key"
ON "doctor_schedules"("doctorId");

CREATE INDEX "schedule_rules_schedule_id_weekday_is_active_idx"
ON "schedule_rules"("schedule_id", "weekday", "is_active");

CREATE INDEX "schedule_exceptions_schedule_id_date_idx"
ON "schedule_exceptions"("schedule_id", "date");

CREATE UNIQUE INDEX "availabilities_schedule_rule_id_date_key"
ON "availabilities"("schedule_rule_id", "date");

CREATE UNIQUE INDEX "availabilities_doctorId_date_hourStart_hourEnd_key"
ON "availabilities"("doctorId", "date", "hourStart", "hourEnd");

CREATE INDEX "availabilities_doctorId_date_idx"
ON "availabilities"("doctorId", "date");

ALTER TABLE "doctor_schedules"
ADD CONSTRAINT "doctor_schedules_doctorId_fkey"
FOREIGN KEY ("doctorId") REFERENCES "Doctors"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "schedule_rules"
ADD CONSTRAINT "schedule_rules_schedule_id_fkey"
FOREIGN KEY ("schedule_id") REFERENCES "doctor_schedules"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "schedule_exceptions"
ADD CONSTRAINT "schedule_exceptions_schedule_id_fkey"
FOREIGN KEY ("schedule_id") REFERENCES "doctor_schedules"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "availabilities"
ADD CONSTRAINT "availabilities_schedule_rule_id_fkey"
FOREIGN KEY ("schedule_rule_id") REFERENCES "schedule_rules"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
