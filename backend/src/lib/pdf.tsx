// backend/src/lib/pdf.ts
import fs from "node:fs/promises";
import path from "node:path";
import PDFDocument from "pdfkit";

/* ============================================================
   Palette
   ============================================================ */
const COLORS = {
  navy: "#0B2942",
  navyDeep: "#071A2C",
  navyMid: "#123F5E",
  olive: "#5A8F32",
  border: "#D8E0E4",
  surface: "#F8FAF9",
  surfaceAlt: "#F1F5F9",
  text: "#17212B",
  muted: "#5D6872",
  subtle: "#8B959F",
  white: "#FFFFFF",
  infoBg: "#F0F7F0",
  infoBorder: "#CFE3CF",
};

/* ============================================================
   Cache du logo
   undefined = jamais tenté
   null      = tenté et échoué
   Buffer    = chargé
   ============================================================ */
let cachedLogoBuffer: Buffer | null | undefined = undefined;

async function getLogoBuffer(): Promise<Buffer | null> {
  if (cachedLogoBuffer !== undefined) return cachedLogoBuffer;

  const candidates = [
    path.join(process.cwd(), "public", "logo.png"),
    path.join(process.cwd(), "assets", "logo.png"),
    path.join(process.cwd(), "..", "frontend", "public", "logo.png"),
    path.join(process.cwd(), "uploads", "logo.png"),
  ];

  for (const filePath of candidates) {
    try {
      const buf = await fs.readFile(filePath);
      cachedLogoBuffer = buf;
      console.log(`[pdf] Logo chargé depuis ${filePath}`);
      return buf;
    } catch {
      // tentative suivante
    }
  }

  console.warn("[pdf] Logo introuvable, PDF généré sans logo.");
  cachedLogoBuffer = null;
  return null;
}

/* ============================================================
   Types publics
   ============================================================ */
export interface PdfRow {
  label: string;
  value: string;
}

export interface PdfData {
  title: string;
  subtitle?: string;
  rows: PdfRow[];
  footer?: string;
}

export interface AppointmentPdfData {
  reference: string;
  typeService: string;
  urgence: string;
  description: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organisation?: string | null;
  country: string;
  preferredDate?: string | Date | null;
  preferredTime?: string | null;
  createdAt: Date | string;
  status?: string;
}

/* ============================================================
   Labels et formats
   ============================================================ */
const SERVICE_LABELS: Record<string, string> = {
  consultation: "Consultation juridique",
  mediation: "Médiation",
  arbitrage: "Arbitrage OHADA",
};

const URGENCE_LABELS: Record<string, string> = {
  normale: "Normale",
  elevee: "Élevée",
  critique: "Critique",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente de confirmation",
  confirmed: "Confirmé",
  cancelled: "Annulé",
  done: "Terminé",
};

function labelOf(
  map: Record<string, string>,
  value: string | undefined | null,
  fallback = "Non précisé",
): string {
  if (!value) return fallback;
  return map[value] ?? value;
}

function formatDateLong(value: string | Date | null | undefined): string {
  if (!value) return "Non précisée";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "Non précisée";
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function formatDateTime(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Tronque une chaîne pour qu'elle tienne dans maxWidth à la police
 * et à la taille actuellement définies sur le document PDFKit.
 */
function ellipsize(
  doc: PDFKit.PDFDocument,
  text: string,
  maxWidth: number,
): string {
  if (!text) return "";
  if (doc.widthOfString(text) <= maxWidth) return text;
  const ell = "…";
  let cut = text;
  while (cut.length > 1) {
    cut = cut.slice(0, -1);
    if (doc.widthOfString(cut + ell) <= maxWidth) return cut + ell;
  }
  return ell;
}

/* ============================================================
   PDF générique (conservé pour compatibilité)
   ============================================================ */
export function generatePdf(data: PdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
        info: {
          Title: data.title,
          Author: "Cabinet CAMPAB",
          Subject: data.subtitle ?? "",
          Creator: "CAMPAB",
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      doc
        .fillColor(COLORS.navy)
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("CAMPAB", { align: "center" });

      doc
        .fillColor(COLORS.muted)
        .fontSize(10)
        .font("Helvetica")
        .text("Cabinet d'Arbitrage et de Médiation", { align: "center" })
        .text("Cotonou, Bénin", { align: "center" })
        .moveDown(2);

      doc
        .fillColor(COLORS.navyDeep)
        .fontSize(18)
        .font("Helvetica-Bold")
        .text(data.title, { align: "left" })
        .moveDown(1);

      if (data.subtitle) {
        doc
          .fillColor(COLORS.muted)
          .fontSize(11)
          .font("Helvetica")
          .text(data.subtitle)
          .moveDown(1.5);
      }

      data.rows.forEach((row) => {
        const y = doc.y;
        doc
          .fillColor(COLORS.muted)
          .fontSize(10)
          .font("Helvetica")
          .text(row.label, 40, y, { width: 140 });

        doc
          .fillColor(COLORS.text)
          .font("Helvetica-Bold")
          .text(row.value, 190, y, { width: 350 });

        doc.moveDown(0.4);
      });

      if (data.footer) {
        doc
          .moveDown(2)
          .fillColor(COLORS.subtle)
          .fontSize(9)
          .font("Helvetica")
          .text(data.footer, { align: "center" });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/* ============================================================
   PDF PROFESSIONNEL DE CONFIRMATION DE RENDEZ-VOUS
   ============================================================ */
export async function generateAppointmentPdf(
  data: AppointmentPdfData,
): Promise<Buffer> {
  const logoBuffer = await getLogoBuffer();

  return new Promise<Buffer>((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
        info: {
          Title: `Confirmation de rendez-vous ${data.reference}`,
          Author: "Cabinet CAMPAB",
          Subject: "Confirmation de rendez-vous",
          Creator: "CAMPAB",
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (c: Buffer) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const pageWidth = doc.page.width; // 595.28 pt
      const pageHeight = doc.page.height; // 841.89 pt
      const margin = 40;
      const contentWidth = pageWidth - margin * 2;

      /* ==========================================================
         EN-TÊTE (logos gauche et droite, bloc texte centré)
         ========================================================== */
      const headerY = margin;
      const logoSize = 55;

      if (logoBuffer) {
        doc.image(logoBuffer, margin, headerY, {
          width: logoSize,
          height: logoSize,
        });
        doc.image(logoBuffer, pageWidth - margin - logoSize, headerY, {
          width: logoSize,
          height: logoSize,
        });
      }

      doc
        .fillColor(COLORS.navy)
        .fontSize(22)
        .font("Helvetica-Bold")
        .text("CAMPAB", margin, headerY + 4, {
          width: contentWidth,
          align: "center",
        });

      doc
        .fillColor(COLORS.muted)
        .fontSize(9)
        .font("Helvetica")
        .text("Cabinet d'Arbitrage et de Médiation", margin, headerY + 32, {
          width: contentWidth,
          align: "center",
        })
        .text("Cotonou, Bénin", margin, headerY + 44, {
          width: contentWidth,
          align: "center",
        });

      const separatorY = headerY + logoSize + 12; // y ≈ 107
      doc
        .moveTo(margin, separatorY)
        .lineTo(pageWidth - margin, separatorY)
        .strokeColor(COLORS.navy)
        .lineWidth(2)
        .stroke();

      /* ==========================================================
         TITRE + DATE D'ÉMISSION
         ========================================================== */
      let cursorY = separatorY + 16;
      doc
        .fillColor(COLORS.navyDeep)
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("Confirmation de rendez-vous", margin, cursorY, {
          width: contentWidth,
          align: "center",
        });

      cursorY = doc.y + 6;
      doc
        .fillColor(COLORS.muted)
        .fontSize(10)
        .font("Helvetica")
        .text(
          `Document émis le ${formatDateTime(data.createdAt)}`,
          margin,
          cursorY,
          { width: contentWidth, align: "center" },
        );

      cursorY = doc.y + 14;

      /* ==========================================================
         ENCADRÉ RÉFÉRENCE
         ========================================================== */
      const refBoxHeight = 48;
      doc
        .rect(margin, cursorY, contentWidth, refBoxHeight)
        .fillColor(COLORS.surface)
        .fill();
      doc.rect(margin, cursorY, 4, refBoxHeight).fillColor(COLORS.olive).fill();

      doc
        .fillColor(COLORS.muted)
        .fontSize(9)
        .font("Helvetica")
        .text("RÉFÉRENCE DU DOSSIER", margin + 20, cursorY + 8, {
          width: contentWidth - 40,
        });

      doc
        .fillColor(COLORS.navyDeep)
        .fontSize(16)
        .font("Helvetica-Bold")
        .text(data.reference, margin + 20, cursorY + 22, {
          width: contentWidth - 40,
        });

      cursorY += refBoxHeight + 14;

      /* ==========================================================
         TABLEAU 2 COLONNES
         ========================================================== */
      const colGap = 15;
      const colWidth = (contentWidth - colGap) / 2;
      const colLeftX = margin;
      const colRightX = margin + colWidth + colGap;

      const rowHeight = 24;
      const tableHeaderHeight = 28;

      const rowsClient: [string, string][] = [
        ["Nom complet", `${data.firstName} ${data.lastName}`.trim()],
        ["Email", data.email],
        ["Téléphone", data.phone],
        [
          "Organisation",
          data.organisation && data.organisation.trim()
            ? data.organisation
            : "Non précisée",
        ],
        ["Pays", data.country],
      ];

      const rowsRdv: [string, string][] = [
        ["Nature", labelOf(SERVICE_LABELS, data.typeService)],
        ["Urgence", labelOf(URGENCE_LABELS, data.urgence)],
        ["Date souhaitée", formatDateLong(data.preferredDate)],
        ["Heure souhaitée", data.preferredTime || "À définir"],
        ["Statut", labelOf(STATUS_LABELS, data.status ?? "pending")],
      ];

      const tableBodyHeight =
        Math.max(rowsClient.length, rowsRdv.length) * rowHeight;
      const tableHeight = tableHeaderHeight + tableBodyHeight;

      // Fond blanc des deux colonnes
      for (const x of [colLeftX, colRightX]) {
        doc
          .rect(x, cursorY, colWidth, tableHeight)
          .fillColor(COLORS.white)
          .fill();
      }

      // En-têtes bleu marine
      for (const x of [colLeftX, colRightX]) {
        doc
          .rect(x, cursorY, colWidth, tableHeaderHeight)
          .fillColor(COLORS.navy)
          .fill();
      }

      doc.fillColor(COLORS.white).fontSize(10).font("Helvetica-Bold");
      doc.text("INFORMATIONS CLIENT", colLeftX + 12, cursorY + 9, {
        width: colWidth - 24,
        lineBreak: false,
      });
      doc.text("DÉTAILS DU RENDEZ-VOUS", colRightX + 12, cursorY + 9, {
        width: colWidth - 24,
        lineBreak: false,
      });

      const labelX = 12;
      const labelWidth = 88;
      const valueX = 102;
      const valueWidth = colWidth - valueX - 12;

      const renderRows = (x: number, rows: [string, string][]): void => {
        rows.forEach((row, i) => {
          const y = cursorY + tableHeaderHeight + i * rowHeight;

          if (i % 2 === 1) {
            doc
              .rect(x, y, colWidth, rowHeight)
              .fillColor(COLORS.surfaceAlt)
              .fill();
          }

          doc.fillColor(COLORS.muted).fontSize(9).font("Helvetica");
          const labelText = ellipsize(doc, row[0], labelWidth);
          doc.text(labelText, x + labelX, y + 7, {
            width: labelWidth,
            lineBreak: false,
          });

          doc.fillColor(COLORS.text).fontSize(9.5).font("Helvetica-Bold");
          const valueText = ellipsize(doc, row[1], valueWidth);
          doc.text(valueText, x + valueX, y + 7, {
            width: valueWidth,
            lineBreak: false,
          });
        });
      };

      renderRows(colLeftX, rowsClient);
      renderRows(colRightX, rowsRdv);

      // Bordures extérieures du tableau
      for (const x of [colLeftX, colRightX]) {
        doc
          .rect(x, cursorY, colWidth, tableHeight)
          .strokeColor(COLORS.border)
          .lineWidth(1)
          .stroke();
      }

      cursorY += tableHeight + 16;

      /* ==========================================================
         DESCRIPTION DE LA SITUATION
         ========================================================== */
      doc
        .fillColor(COLORS.navy)
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("DESCRIPTION DE LA SITUATION", margin, cursorY, {
          width: contentWidth,
        });
      cursorY = doc.y + 6;

      const descTextWidth = contentWidth - 30;
      doc.font("Helvetica").fontSize(10);

      let descriptionText = (data.description ?? "").trim() || "Non précisée.";
      const MAX_DESC_CONTENT_HEIGHT = 100;
      let descContentHeight = doc.heightOfString(descriptionText, {
        width: descTextWidth,
      });

      if (descContentHeight > MAX_DESC_CONTENT_HEIGHT) {
        let cut = descriptionText;
        while (cut.length > 40) {
          cut = cut.slice(0, -30);
          if (
            doc.heightOfString(cut + " […]", { width: descTextWidth }) <=
            MAX_DESC_CONTENT_HEIGHT
          ) {
            break;
          }
        }
        descriptionText = cut + " […]";
        descContentHeight = doc.heightOfString(descriptionText, {
          width: descTextWidth,
        });
      }

      const descHeight = Math.max(60, descContentHeight + 24);

      doc
        .rect(margin, cursorY, contentWidth, descHeight)
        .fillColor(COLORS.surface)
        .fill();
      doc
        .rect(margin, cursorY, 4, descHeight)
        .fillColor(COLORS.navyMid)
        .fill();

      doc
        .fillColor(COLORS.text)
        .fontSize(10)
        .font("Helvetica")
        .text(descriptionText, margin + 18, cursorY + 12, {
          width: descTextWidth,
        });

      cursorY += descHeight + 16;

      /* ==========================================================
         INFORMATIONS PRATIQUES
         ========================================================== */
      doc
        .fillColor(COLORS.navy)
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("INFORMATIONS PRATIQUES", margin, cursorY, {
          width: contentWidth,
        });
      cursorY = doc.y + 6;

      const infos = [
        "Le cabinet vous recontactera sous 24 à 48 heures ouvrées pour confirmer le rendez-vous.",
        "Horaires : Lundi à vendredi, 08h00 à 13h30 et 15h00 à 20h00.",
        "Pour toute urgence : 01 97 76 29 36 ou p.abodecabinet@gmail.com.",
      ];

      const infoPadTop = 10;
      const infoLineHeight = 16;
      const infoHeight = infoPadTop * 2 + infos.length * infoLineHeight;

      doc
        .rect(margin, cursorY, contentWidth, infoHeight)
        .fillColor(COLORS.infoBg)
        .fill()
        .strokeColor(COLORS.infoBorder)
        .lineWidth(1)
        .stroke();

      infos.forEach((info, i) => {
        const y = cursorY + infoPadTop + i * infoLineHeight;
        doc
          .fillColor(COLORS.olive)
          .fontSize(10)
          .font("Helvetica-Bold")
          .text("•", margin + 12, y, { lineBreak: false });
        doc
          .fillColor(COLORS.text)
          .fontSize(9.5)
          .font("Helvetica")
          .text(info, margin + 28, y, {
            width: contentWidth - 46,
            lineBreak: false,
          });
      });

      cursorY += infoHeight + 16;

      /* ==========================================================
         VALIDATION : SIGNATURE CLIENT + CACHET CABINET
         ========================================================== */
      doc
        .fillColor(COLORS.navy)
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("VALIDATION AU SECRÉTARIAT DU CABINET", margin, cursorY, {
          width: contentWidth,
        });
      cursorY = doc.y + 6;

      const sigHeight = 110;
      const sigBoxWidth = (contentWidth - colGap) / 2;

      // Encadré gauche : signature client
      doc
        .rect(margin, cursorY, sigBoxWidth, sigHeight)
        .fillColor(COLORS.white)
        .fill()
        .strokeColor(COLORS.border)
        .lineWidth(1)
        .stroke();
      doc
        .fillColor(COLORS.muted)
        .fontSize(9)
        .font("Helvetica-Bold")
        .text("SIGNATURE DU CLIENT", margin + 12, cursorY + 10, {
          width: sigBoxWidth - 24,
        });
      doc
        .fillColor(COLORS.subtle)
        .fontSize(8)
        .font("Helvetica")
        .text(
          "Date et signature précédées de la mention « Lu et approuvé »",
          margin + 12,
          cursorY + 26,
          { width: sigBoxWidth - 24 },
        );

      // Encadré droit : cachet cabinet
      const sigRightX = margin + sigBoxWidth + colGap;
      doc
        .rect(sigRightX, cursorY, sigBoxWidth, sigHeight)
        .fillColor(COLORS.white)
        .fill()
        .strokeColor(COLORS.border)
        .lineWidth(1)
        .stroke();
      doc
        .fillColor(COLORS.muted)
        .fontSize(9)
        .font("Helvetica-Bold")
        .text("CACHET DU CABINET", sigRightX + 12, cursorY + 10, {
          width: sigBoxWidth - 24,
        });
      doc
        .fillColor(COLORS.subtle)
        .fontSize(8)
        .font("Helvetica")
        .text("Réservé au secrétariat du cabinet", sigRightX + 12, cursorY + 26, {
          width: sigBoxWidth - 24,
        });

      /* ==========================================================
         PIED DE PAGE
         ========================================================== */
      const footerSepY = pageHeight - 55;
      doc
        .moveTo(margin, footerSepY)
        .lineTo(pageWidth - margin, footerSepY)
        .strokeColor(COLORS.border)
        .lineWidth(1)
        .stroke();

      doc
        .fillColor(COLORS.subtle)
        .fontSize(8)
        .font("Helvetica")
        .text(
          "CAMPAB — Cotonou, Bénin — 01 97 76 29 36 — p.abodecabinet@gmail.com",
          margin,
          footerSepY + 8,
          { width: contentWidth, align: "center" },
        );

      doc
        .fillColor(COLORS.subtle)
        .fontSize(7)
        .text(
          `Document confidentiel, protégé par le secret professionnel. Référence : ${data.reference}`,
          margin,
          footerSepY + 22,
          { width: contentWidth, align: "center" },
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}