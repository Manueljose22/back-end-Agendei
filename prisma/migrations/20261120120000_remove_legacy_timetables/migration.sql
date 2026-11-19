-- Remove the legacy per-slot timetable table.
-- Weekly schedules and appointments are managed by doctor_schedules,
-- schedule_rules, schedule_exceptions, availabilities and appointments.
DROP TABLE IF EXISTS "timetables_appointments";
