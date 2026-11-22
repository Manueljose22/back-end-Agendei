-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM (
  'APPOINTMENT_CREATED',
  'APPOINTMENT_CONFIRMED',
  'APPOINTMENT_CANCELLED',
  'RESCHEDULE_PROPOSED',
  'RESCHEDULE_ACCEPTED',
  'RESCHEDULE_REJECTED'
);

CREATE TYPE "public"."NotificationRecipientRole" AS ENUM ('PATIENT', 'DOCTOR', 'HOSPITAL');
CREATE TYPE "public"."RescheduleProposalStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
CREATE TYPE "public"."RescheduleActorRole" AS ENUM ('doctor', 'hospital');

-- CreateTable
CREATE TABLE "public"."reschedule_proposals" (
  "id" TEXT NOT NULL,
  "appointment_id" TEXT NOT NULL,
  "proposed_by_id" TEXT NOT NULL,
  "proposed_by_role" "public"."RescheduleActorRole" NOT NULL,
  "proposed_date" DATE NOT NULL,
  "proposed_hour" TEXT NOT NULL,
  "proposed_end" TEXT,
  "duration_minutes" INTEGER NOT NULL,
  "reason" TEXT,
  "status" "public"."RescheduleProposalStatus" NOT NULL DEFAULT 'PENDING',
  "responded_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "reschedule_proposals_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "reschedule_proposals_appointment_id_fkey"
    FOREIGN KEY ("appointment_id") REFERENCES "public"."Appointments"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Only one unanswered proposal may exist for an appointment.
CREATE UNIQUE INDEX "reschedule_proposals_one_pending_per_appointment"
  ON "public"."reschedule_proposals"("appointment_id")
  WHERE "status" = 'PENDING';

CREATE INDEX "reschedule_proposals_appointment_id_status_idx"
  ON "public"."reschedule_proposals"("appointment_id", "status");

-- CreateTable
CREATE TABLE "public"."notifications" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "type" "public"."NotificationType" NOT NULL,
  "recipient_role" "public"."NotificationRecipientRole" NOT NULL,
  "patient_id" TEXT,
  "doctor_id" TEXT,
  "hospital_id" TEXT,
  "appointment_id" TEXT NOT NULL,
  "reschedule_proposal_id" TEXT,
  "data" JSONB,
  "is_read" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "notifications_patient_id_fkey"
    FOREIGN KEY ("patient_id") REFERENCES "public"."Patients"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "notifications_doctor_id_fkey"
    FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctors"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "notifications_hospital_id_fkey"
    FOREIGN KEY ("hospital_id") REFERENCES "public"."Hospitals"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "notifications_appointment_id_fkey"
    FOREIGN KEY ("appointment_id") REFERENCES "public"."Appointments"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "notifications_exactly_one_recipient_check" CHECK (
    ("recipient_role" = 'PATIENT' AND "patient_id" IS NOT NULL AND "doctor_id" IS NULL AND "hospital_id" IS NULL)
    OR ("recipient_role" = 'DOCTOR' AND "patient_id" IS NULL AND "doctor_id" IS NOT NULL AND "hospital_id" IS NULL)
    OR ("recipient_role" = 'HOSPITAL' AND "patient_id" IS NULL AND "doctor_id" IS NULL AND "hospital_id" IS NOT NULL)
  )
);

CREATE INDEX "notifications_patient_id_is_read_created_at_idx"
  ON "public"."notifications"("patient_id", "is_read", "created_at");
CREATE INDEX "notifications_doctor_id_is_read_created_at_idx"
  ON "public"."notifications"("doctor_id", "is_read", "createdAt");
CREATE INDEX "notifications_hospital_id_is_read_created_at_idx"
  ON "public"."notifications"("hospital_id", "is_read", "createdAt");
CREATE INDEX "notifications_appointment_id_created_at_idx"
  ON "public"."notifications"("appointment_id", "createdAt");
