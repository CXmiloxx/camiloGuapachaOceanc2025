-- AlterTable
ALTER TABLE "Weather" ADD COLUMN "firstUTC" DATETIME;
ALTER TABLE "Weather" ADD COLUMN "lastUTC" DATETIME;
ALTER TABLE "Weather" ADD COLUMN "month_ordinal" INTEGER;
ALTER TABLE "Weather" ADD COLUMN "northern_season" TEXT;
ALTER TABLE "Weather" ADD COLUMN "pressure_avg" REAL;
ALTER TABLE "Weather" ADD COLUMN "pressure_max" REAL;
ALTER TABLE "Weather" ADD COLUMN "pressure_min" REAL;
ALTER TABLE "Weather" ADD COLUMN "season" TEXT;
ALTER TABLE "Weather" ADD COLUMN "southern_season" TEXT;
ALTER TABLE "Weather" ADD COLUMN "temp_avg" REAL;
ALTER TABLE "Weather" ADD COLUMN "wind_avg" REAL;
ALTER TABLE "Weather" ADD COLUMN "wind_max" REAL;
ALTER TABLE "Weather" ADD COLUMN "wind_min" REAL;
