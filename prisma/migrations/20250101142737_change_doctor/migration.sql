-- AlterTable
ALTER TABLE "Doctor" ALTER COLUMN "qualifications" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "experiences" SET DEFAULT ARRAY[]::TEXT[];
