import PDFDocument from "pdfkit";

interface AppointmentPDFData {
  reference: string; firstName: string; lastName: string;
  email: string; phone: string; subject: string;
  message?: string | null; preferredDate?: string | null;
}

export function generateAppointmentPDF(data: AppointmentPDFData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.rect(0, 0, doc.page.width, 110).fill("#0B2942");
    doc.fillColor("#FFFFFF").fontSize(22).font("Helvetica-Bold").text("Cabinet CAMPAB", 50, 30);
    doc.fillColor("#DCECF4").fontSize(10).font("Helvetica")
       .text("Cabinet Sètondji Prudencia ABODE", 50, 60)
       .text("Médiation · Arbitrage OHADA · Conseil juridique", 50, 74)
       .text("Cotonou · Bénin", 50, 88);

    doc.fillColor("#0B2942").fontSize(20).font("Helvetica-Bold")
       .text("Confirmation de demande de rendez-vous", 50, 150, { align: "center", width: doc.page.width - 100 });

    doc.moveDown(1.5);
    const refY = doc.y;
    doc.roundedRect(50, refY, doc.page.width - 100, 60, 8).fill("#DCECF4");
    doc.fillColor("#0B2942").fontSize(11).font("Helvetica")
       .text("Référence de votre dossier", 50, refY + 12, { align: "center", width: doc.page.width - 100 });
    doc.fontSize(18).font("Helvetica-Bold")
       .text(data.reference, 50, refY + 30, { align: "center", width: doc.page.width - 100 });

    const startY = refY + 100;
    doc.fillColor("#5A8F32").fontSize(12).font("Helvetica-Bold").text("VOS INFORMATIONS", 50, startY);
    doc.moveTo(50, startY + 20).lineTo(doc.page.width - 50, startY + 20).strokeColor("#D8E0E4").stroke();

    const rows: [string, string][] = [
      ["Nom", `${data.firstName} ${data.lastName}`],
      ["Email", data.email],
      ["Téléphone", data.phone],
      ["Objet", data.subject],
    ];
    if (data.preferredDate) rows.push(["Date souhaitée", data.preferredDate]);

    let y = startY + 36;
    rows.forEach(([label, value]) => {
      doc.fillColor("#5D6872").fontSize(10).font("Helvetica-Bold").text(label, 50, y);
      doc.fillColor("#17212B").fontSize(11).font("Helvetica").text(value, 200, y, { width: doc.page.width - 250 });
      y += 24;
    });

    if (data.message && data.message.trim()) {
      doc.fillColor("#5A8F32").fontSize(12).font("Helvetica-Bold").text("VOTRE MESSAGE", 50, y + 20);
      doc.moveTo(50, y + 40).lineTo(doc.page.width - 50, y + 40).strokeColor("#D8E0E4").stroke();
      doc.fillColor("#17212B").fontSize(10).font("Helvetica")
         .text(data.message, 50, y + 56, { width: doc.page.width - 100, align: "justify" });
    }

    const footerY = doc.page.height - 80;
    doc.moveTo(50, footerY).lineTo(doc.page.width - 50, footerY).strokeColor("#D8E0E4").stroke();
    doc.fillColor("#5D6872").fontSize(9).font("Helvetica")
       .text(`Document généré le ${new Date().toLocaleString("fr-FR")} · Référence ${data.reference}`, 50, footerY + 12, { align: "center", width: doc.page.width - 100 });

    doc.end();
  });
}
