/*
  Warnings:

  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pen_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "pen_name" TEXT NOT NULL;
