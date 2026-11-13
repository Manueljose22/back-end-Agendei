-- CreateEnum
CREATE TYPE "public"."RoleHospitals" AS ENUM ('admin', 'owner', 'doctor');

-- CreateTable
CREATE TABLE "public"."Admins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Hospitals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "nif" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."RoleHospitals" NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hospitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Patients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "photo" TEXT,
    "phone" TEXT,
    "dateBirth" TIMESTAMP(3),
    "address" TEXT,
    "gender" TEXT,
    "pushToken" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Doctors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "phone" TEXT,
    "bio" TEXT,
    "address" TEXT,
    "yaersOfExperience" INTEGER,
    "numberOfPatients" INTEGER,
    "rating" DOUBLE PRECISION,
    "specialtyId" TEXT NOT NULL,
    "hospitalId" TEXT,
    "pushToken" TEXT,
    "status" TEXT DEFAULT 'activo',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Appointments" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "booking_date" TIMESTAMP(3) NOT NULL,
    "booking_hour" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upadatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Specialties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Services" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'activo',
    "duraction" TEXT,
    "specialtyId" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Doctors_Services" (
    "doctorId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Doctors_Services_pkey" PRIMARY KEY ("doctorId","serviceId")
);

-- CreateTable
CREATE TABLE "public"."availabilities" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hourStart" TIMESTAMP(3) NOT NULL,
    "hourEnd" TIMESTAMP(3) NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."timetables_appointments" (
    "id" TEXT NOT NULL,
    "availabilityId" TEXT NOT NULL,
    "hour" TIMESTAMP(3) NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "timetables_appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."history_medicals" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "treatment" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "history_medicals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Images_Hospitals" (
    "id" TEXT NOT NULL,
    "urlImagem" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,

    CONSTRAINT "Images_Hospitals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admins_email_key" ON "public"."Admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Hospitals_nif_key" ON "public"."Hospitals"("nif");

-- CreateIndex
CREATE UNIQUE INDEX "Hospitals_email_key" ON "public"."Hospitals"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patients_email_key" ON "public"."Patients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Doctors_email_key" ON "public"."Doctors"("email");

-- CreateIndex
CREATE INDEX "Appointments_patientId_booking_date_idx" ON "public"."Appointments"("patientId", "booking_date");

-- CreateIndex
CREATE INDEX "Appointments_doctorId_booking_date_idx" ON "public"."Appointments"("doctorId", "booking_date");

-- CreateIndex
CREATE INDEX "availabilities_doctorId_date_idx" ON "public"."availabilities"("doctorId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "availabilities_doctorId_date_key" ON "public"."availabilities"("doctorId", "date");

-- CreateIndex
CREATE INDEX "timetables_appointments_availabilityId_idx" ON "public"."timetables_appointments"("availabilityId");

-- CreateIndex
CREATE UNIQUE INDEX "timetables_appointments_availabilityId_hour_key" ON "public"."timetables_appointments"("availabilityId", "hour");

-- AddForeignKey
ALTER TABLE "public"."Doctors" ADD CONSTRAINT "Doctors_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "public"."Specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Doctors" ADD CONSTRAINT "Doctors_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "public"."Hospitals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointments" ADD CONSTRAINT "Appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointments" ADD CONSTRAINT "Appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointments" ADD CONSTRAINT "Appointments_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Specialties" ADD CONSTRAINT "Specialties_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "public"."Hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Services" ADD CONSTRAINT "Services_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "public"."Specialties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Doctors_Services" ADD CONSTRAINT "Doctors_Services_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Doctors_Services" ADD CONSTRAINT "Doctors_Services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."availabilities" ADD CONSTRAINT "availabilities_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."timetables_appointments" ADD CONSTRAINT "timetables_appointments_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "public"."availabilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."history_medicals" ADD CONSTRAINT "history_medicals_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."history_medicals" ADD CONSTRAINT "history_medicals_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Images_Hospitals" ADD CONSTRAINT "Images_Hospitals_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "public"."Hospitals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
