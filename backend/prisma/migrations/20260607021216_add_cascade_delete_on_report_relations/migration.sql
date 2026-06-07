-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_reportId_fkey";

-- DropForeignKey
ALTER TABLE "official_notes" DROP CONSTRAINT "official_notes_reportId_fkey";

-- DropForeignKey
ALTER TABLE "report_status_logs" DROP CONSTRAINT "report_status_logs_reportId_fkey";

-- AddForeignKey
ALTER TABLE "report_status_logs" ADD CONSTRAINT "report_status_logs_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "official_notes" ADD CONSTRAINT "official_notes_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
