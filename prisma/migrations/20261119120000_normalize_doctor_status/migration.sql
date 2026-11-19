-- Normalize legacy doctor status values before enforcing a typed enum.
-- Known active aliases become ACTIVE; known unavailable aliases become INACTIVE.
-- Unknown values abort the migration instead of silently changing doctor availability.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "Doctors"
    WHERE "status" IS NOT NULL
      AND translate(lower(btrim("status")), 'áéíóúãõç', 'aeiouaoc')
          NOT IN ('active', 'activo', 'disponivel', 'inactive', 'inactivo', 'inativo', 'indisponivel')
  ) THEN
    RAISE EXCEPTION 'Migration aborted: unknown value found in Doctors.status. Inspect existing values before retrying.';
  END IF;
END $$;

CREATE TYPE "DoctorStatus" AS ENUM ('ACTIVE', 'INACTIVE');

ALTER TABLE "Doctors"
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "DoctorStatus"
  USING (
    CASE
      WHEN "status" IS NULL THEN 'ACTIVE'
      WHEN translate(lower(btrim("status")), 'áéíóúãõç', 'aeiouaoc')
           IN ('active', 'activo', 'disponivel') THEN 'ACTIVE'
      ELSE 'INACTIVE'
    END
  )::"DoctorStatus",
  ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
  ALTER COLUMN "status" SET NOT NULL;
