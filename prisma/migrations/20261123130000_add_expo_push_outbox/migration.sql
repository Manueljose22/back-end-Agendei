-- Expo push tokens: one account may register multiple devices.
CREATE TABLE "public"."expo_push_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "recipient_role" "public"."NotificationRecipientRole" NOT NULL,
    "patient_id" TEXT,
    "doctor_id" TEXT,
    "hospital_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "expo_push_tokens_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "expo_push_tokens_token_key" UNIQUE ("token"),
    CONSTRAINT "expo_push_tokens_patient_id_fkey"
      FOREIGN KEY ("patient_id") REFERENCES "public"."Patients"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "expo_push_tokens_doctor_id_fkey"
      FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "expo_push_tokens_hospital_id_fkey"
      FOREIGN KEY ("hospital_id") REFERENCES "public"."Hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "expo_push_tokens_exactly_one_recipient_check" CHECK (
      ("recipient_role" = 'PATIENT' AND "patient_id" IS NOT NULL AND "doctor_id" IS NULL AND "hospital_id" IS NULL)
      OR ("recipient_role" = 'DOCTOR' AND "patient_id" IS NULL AND "doctor_id" IS NOT NULL AND "hospital_id" IS NULL)
      OR ("recipient_role" = 'HOSPITAL' AND "patient_id" IS NULL AND "doctor_id" IS NULL AND "hospital_id" IS NOT NULL)
    )
);

CREATE INDEX "expo_push_tokens_patient_id_idx" ON "public"."expo_push_tokens"("patient_id");
CREATE INDEX "expo_push_tokens_doctor_id_idx" ON "public"."expo_push_tokens"("doctor_id");
CREATE INDEX "expo_push_tokens_hospital_id_idx" ON "public"."expo_push_tokens"("hospital_id");

-- Transactional outbox: every committed internal notification gets a push job.
CREATE TABLE "public"."notification_push_jobs" (
    "id" TEXT NOT NULL,
    "notification_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "next_attempt_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locked_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "last_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notification_push_jobs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "notification_push_jobs_notification_id_key" UNIQUE ("notification_id"),
    CONSTRAINT "notification_push_jobs_notification_id_fkey"
      FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "notification_push_jobs_status_check"
      CHECK ("status" IN ('PENDING', 'PROCESSING', 'RETRY', 'SENT', 'SKIPPED', 'FAILED'))
);

CREATE INDEX "notification_push_jobs_status_next_attempt_created_idx"
  ON "public"."notification_push_jobs"("status", "next_attempt_at", "created_at");

CREATE OR REPLACE FUNCTION "public"."enqueue_notification_push_job"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO "public"."notification_push_jobs" (
    "id", "notification_id", "status", "attempts",
    "next_attempt_at", "created_at", "updated_at"
  ) VALUES (
    gen_random_uuid()::text, NEW."id", 'PENDING', 0,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  )
  ON CONFLICT ("notification_id") DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER "notifications_enqueue_push_job"
AFTER INSERT ON "public"."notifications"
FOR EACH ROW
EXECUTE FUNCTION "public"."enqueue_notification_push_job"();
