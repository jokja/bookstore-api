/*
  Warnings:

  - You are about to drop the `book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sales` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "book" DROP CONSTRAINT "book_authorId_fkey";

-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_authorId_fkey";

-- DropTable
DROP TABLE "book";

-- DropTable
DROP TABLE "sales";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Author" (
    "Author_ID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Pen_Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Is_Disabled" BOOLEAN NOT NULL DEFAULT true,
    "Hash" TEXT NOT NULL,
    "Hashed_RT" TEXT,
    "Created_Time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_Time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("Author_ID")
);

-- CreateTable
CREATE TABLE "Book" (
    "Book_ID" SERIAL NOT NULL,
    "Author_ID" INTEGER NOT NULL,
    "Title" TEXT NOT NULL,
    "Summary" TEXT,
    "Stock" INTEGER NOT NULL,
    "Price" INTEGER NOT NULL,
    "Cover_URL" TEXT,
    "Created_Time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_Time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("Book_ID")
);

-- CreateTable
CREATE TABLE "Sales" (
    "Sales_ID" SERIAL NOT NULL,
    "Author_ID" INTEGER NOT NULL,
    "Recipient_Name" TEXT NOT NULL,
    "Recipient_Email" TEXT NOT NULL,
    "Book_Title" TEXT NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "Price_Per_Unit" INTEGER NOT NULL,
    "Price_Total" INTEGER NOT NULL,
    "Created_Time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_Time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("Sales_ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_Email_key" ON "Author"("Email");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_Author_ID_fkey" FOREIGN KEY ("Author_ID") REFERENCES "Author"("Author_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_Author_ID_fkey" FOREIGN KEY ("Author_ID") REFERENCES "Author"("Author_ID") ON DELETE RESTRICT ON UPDATE CASCADE;
