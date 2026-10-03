// backend/src/lib/pdf.ts
import PDFDocument from "pdfkit";

export interface PdfData {
  title: string;
  subtitle?: string;
  rows: Array<{ label: string; value: string }>;
  footer?: string;
}

export async function generatePdf(data: PdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // En-tête
      doc
        .fontSize(20)
        .fillColor("#0D2B5E")
        .text("CAMPAB", { align: "center" })
        .fontSize(10)
        .fillColor("#666666")
        .text("Cabinet d'Arbitrage et de Médiation", { align: "center" })
        .moveDown(2);

      // Titre
      doc
        .fontSize(16)
        .fillColor("#0D2B5E")
        .text(data.title, { align: "left" })
        .moveDown(1);

      if (data.subtitle) {
        doc
          .fontSize(12)
          .fillColor("#666666")
          .text(data.subtitle)
          .moveDown(1.5);
      }

      // Lignes
      data.rows.forEach((row) => {
        doc
          .fontSize(11)
          .fillColor("#4A5C78")
          .text(row.label, { continued: true })
          .fillColor("#1E2D4A")
          .text(`  ${row.value}`);
        doc.moveDown(0.5);
      });

      // Pied de page
      if (data.footer) {
        doc
          .moveDown(2)
          .fontSize(9)
          .fillColor("#8FA0BC")
          .text(data.footer, { align: "center" });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}