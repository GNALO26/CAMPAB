// backend/src/lib/pdf.tsx
import fs from "node:fs/promises";
import path from "node:path";
import React from "react";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";

/* ============================================================
   Palette de couleurs
   ============================================================ */
const C = {
  navy: "#0B2942",
  navyDeep: "#071A2C",
  navyMid: "#123F5E",
  gold: "#B8860B",
  goldLight: "#D4A017",
  olive: "#5A8F32",
  border: "#D8E0E4",
  borderLight: "#E8EEF2",
  surface: "#F8FAF9",
  surfaceAlt: "#F0F5F9",
  text: "#17212B",
  muted: "#5D6872",
  subtle: "#8B959F",
  white: "#FFFFFF",
};

/* ============================================================
   Styles
   ============================================================ */
const s = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 80,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: C.text,
    backgroundColor: C.white,
    lineHeight: 1.5,
  },

  /* --- En-tête avec deux logos --- */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: C.navy,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    justifyContent: "flex-end",
  },
  logo: {
    width: 48,
    height: 48,
    objectFit: "contain",
  },
  logoFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.navy,
    color: C.white,
    textAlign: "center",
    paddingTop: 16,
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  headerTextLeft: {
    flexDirection: "column",
  },
  headerTextRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  headerTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: C.navy,
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontSize: 7.5,
    color: C.muted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: 2,
  },
  headerContact: {
    fontSize: 7.5,
    color: C.muted,
    textAlign: "right",
    marginBottom: 1,
  },

  /* --- Titre du document --- */
  docTitleBlock: {
    alignItems: "center",
    marginBottom: 18,
  },
  docTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    color: C.navyDeep,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  docSubtitle: {
    fontSize: 9,
    color: C.muted,
    marginTop: 4,
    textAlign: "center",
  },

  /* --- Bandeau de référence --- */
  refBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: C.navy,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 18,
  },
  refBannerLabel: {
    fontSize: 8,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  refBannerValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    letterSpacing: 0.8,
  },
  refBannerStatus: {
    fontSize: 8,
    color: C.goldLight,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },

  /* --- Tableaux --- */
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionHeaderLine: {
    width: 4,
    height: 16,
    backgroundColor: C.gold,
    borderRadius: 2,
    marginRight: 8,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: C.navyDeep,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  table: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: C.navy,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: C.white,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  tableRowAlt: {
    backgroundColor: C.surfaceAlt,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableLabelCell: {
    width: "40%",
    fontSize: 9.5,
    color: C.muted,
    fontFamily: "Helvetica-Bold",
  },
  tableValueCell: {
    width: "60%",
    fontSize: 9.5,
    color: C.text,
  },

  /* --- Description --- */
  descriptionBox: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    padding: 12,
    backgroundColor: C.surface,
    borderLeftWidth: 3,
    borderLeftColor: C.olive,
  },
  descriptionText: {
    fontSize: 9.5,
    color: C.text,
    lineHeight: 1.6,
  },

  /* --- Bloc signature / cachet --- */
  signatureBlock: {
    marginTop: 24,
    flexDirection: "row",
    gap: 16,
  },
  signatureBox: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: C.border,
    borderStyle: "dashed",
    borderRadius: 6,
    padding: 12,
    minHeight: 100,
    backgroundColor: C.white,
  },
  signatureBoxTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: C.navy,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
    textAlign: "center",
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  signatureBoxHint: {
    fontSize: 7.5,
    color: C.subtle,
    textAlign: "center",
    marginTop: 4,
  },
  signatureBoxContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* --- Notice informative --- */
  notice: {
    marginTop: 16,
    backgroundColor: "#F0F7F0",
    borderWidth: 1,
    borderColor: "#CFE3CF",
    borderRadius: 6,
    padding: 12,
  },
  noticeTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: C.olive,
    marginBottom: 6,
  },
  noticeLine: {
    flexDirection: "row",
    marginBottom: 3,
  },
  noticeBullet: {
    width: 10,
    fontSize: 9,
    color: C.olive,
  },
  noticeContent: {
    flex: 1,
    fontSize: 9,
    color: C.text,
  },

  /* --- Pied de page --- */
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerCol: {
    fontSize: 7.5,
    color: C.subtle,
  },
  footerColStrong: {
    fontSize: 7.5,
    color: C.muted,
    fontFamily: "Helvetica-Bold",
  },
});

/* ============================================================
   Chargement du logo
   ============================================================ */
async function getLogoDataUrl(): Promise<string | null> {
  try {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const buffer = await fs.readFile(logoPath);
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

/* ============================================================
   Interface des données du PDF
   ============================================================ */
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
  preferredDate?: string | null;
  preferredTime?: string | null;
  createdAt: Date | string;
}

/* ============================================================
   Helpers de formatage
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

function labelOf(
  list: Record<string, string>,
  value: string | undefined
): string {
  if (!value) return "Non précisé";
  return list[value] ?? value;
}

function formatDateLong(value?: string | null): string {
  if (!value) return "Non précisée";
  const d = new Date(value);
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
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/* ============================================================
   Ligne de tableau
   ============================================================ */
function TableRow({
  label,
  value,
  alt = false,
  last = false,
}: {
  label: string;
  value: string;
  alt?: boolean;
  last?: boolean;
}) {
  const rowStyle = [
    s.tableRow,
    alt ? s.tableRowAlt : {},
    last ? s.tableRowLast : {},
  ];
  return (
    <View style={rowStyle}>
      <Text style={s.tableLabelCell}>{label}</Text>
      <Text style={s.tableValueCell}>{value}</Text>
    </View>
  );
}

/* ============================================================
   Document PDF
   ============================================================ */
function AppointmentDocument({
  data,
  logo,
}: {
  data: AppointmentPdfData;
  logo: string | null;
}) {
  const fullName = `${data.firstName} ${data.lastName}`.trim();
  const serviceLabel = labelOf(SERVICE_LABELS, data.typeService);
  const urgenceLabel = labelOf(URGENCE_LABELS, data.urgence);

  return (
    <Document
      title={`Confirmation de rendez-vous ${data.reference}`}
      author="Cabinet CAMPAB"
      subject="Confirmation de demande de rendez-vous"
      creator="CAMPAB"
      producer="CAMPAB"
    >
      <Page size="A4" style={s.page}>
        {/* ============================================
            EN-TÊTE : deux logos (gauche et droite)
            ============================================ */}
        <View style={s.header}>
          {/* Logo gauche : CAMPAB */}
          <View style={s.headerLeft}>
            {logo ? (
              <Image src={logo} style={s.logo} />
            ) : (
              <Text style={s.logoFallback}>CAMPAB</Text>
            )}
            <View style={s.headerTextLeft}>
              <Text style={s.headerTitle}>CAMPAB</Text>
              <Text style={s.headerSubtitle}>Cabinet d'Arbitrage et de Médiation</Text>
            </View>
          </View>

          {/* Logo droite : informations de contact */}
          <View style={s.headerRight}>
            <View style={s.headerTextRight}>
              <Text style={s.headerContact}>Cotonou, Bénin</Text>
              <Text style={s.headerContact}>01 97 76 29 36</Text>
              <Text style={s.headerContact}>p.abodecabinet@gmail.com</Text>
              <Text style={s.headerContact}>cam-pab.com</Text>
            </View>
            {logo ? (
              <Image src={logo} style={s.logo} />
            ) : (
              <Text style={s.logoFallback}>C</Text>
            )}
          </View>
        </View>

        {/* ============================================
            TITRE DU DOCUMENT
            ============================================ */}
        <View style={s.docTitleBlock}>
          <Text style={s.docTitle}>CONFIRMATION DE RENDEZ-VOUS</Text>
          <Text style={s.docSubtitle}>
            Document généré le {formatDateTime(data.createdAt)}
          </Text>
        </View>

        {/* ============================================
            BANDEAU RÉFÉRENCE
            ============================================ */}
        <View style={s.refBanner}>
          <View>
            <Text style={s.refBannerLabel}>Référence du dossier</Text>
            <Text style={s.refBannerValue}>{data.reference}</Text>
          </View>
          <View>
            <Text style={s.refBannerLabel}>Statut</Text>
            <Text style={s.refBannerStatus}>En attente de confirmation</Text>
          </View>
        </View>

        {/* ============================================
            SECTION : VOS COORDONNÉES
            ============================================ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionHeaderLine} />
            <Text style={s.sectionTitle}>Vos coordonnées</Text>
          </View>
          <View style={s.table}>
            <View style={s.tableHeaderRow}>
              <Text style={[s.tableHeaderCell, { width: "40%" }]}>Champ</Text>
              <Text style={[s.tableHeaderCell, { width: "60%" }]}>Information</Text>
            </View>
            <TableRow label="Nom complet" value={fullName} />
            <TableRow label="Email" value={data.email} alt />
            <TableRow label="Téléphone" value={data.phone} />
            {data.organisation ? (
              <TableRow
                label="Organisation"
                value={data.organisation}
                alt
              />
            ) : null}
            <TableRow label="Pays" value={data.country} last={!data.organisation} />
          </View>
        </View>

        {/* ============================================
            SECTION : DÉTAILS DU RENDEZ-VOUS
            ============================================ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionHeaderLine} />
            <Text style={s.sectionTitle}>Détails du rendez-vous</Text>
          </View>
          <View style={s.table}>
            <View style={s.tableHeaderRow}>
              <Text style={[s.tableHeaderCell, { width: "40%" }]}>Champ</Text>
              <Text style={[s.tableHeaderCell, { width: "60%" }]}>Information</Text>
            </View>
            <TableRow label="Nature de la demande" value={serviceLabel} />
            <TableRow label="Niveau d'urgence" value={urgenceLabel} alt />
            <TableRow
              label="Date souhaitée"
              value={formatDateLong(data.preferredDate)}
            />
            <TableRow
              label="Heure souhaitée"
              value={data.preferredTime || "À définir avec le cabinet"}
              alt
              last
            />
          </View>
        </View>

        {/* ============================================
            SECTION : DESCRIPTION DE LA SITUATION
            ============================================ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionHeaderLine} />
            <Text style={s.sectionTitle}>Description de la situation</Text>
          </View>
          <View style={s.descriptionBox}>
            <Text style={s.descriptionText}>{data.description}</Text>
          </View>
        </View>

        {/* ============================================
            SECTION : CACHET ET SIGNATURE
            ============================================ */}
        <View style={s.signatureBlock}>
          {/* Cadre pour signature du client */}
          <View style={s.signatureBox}>
            <Text style={s.signatureBoxTitle}>Signature du client</Text>
            <View style={s.signatureBoxContent}>
              <Text style={s.signatureBoxHint}>
                À signer lors de la visite au cabinet
              </Text>
            </View>
          </View>

          {/* Cadre pour cachet du cabinet */}
          <View style={s.signatureBox}>
            <Text style={s.signatureBoxTitle}>Cachet et signature du cabinet</Text>
            <View style={s.signatureBoxContent}>
              <Text style={s.signatureBoxHint}>
                Réservé à l'administration
              </Text>
            </View>
          </View>
        </View>

        {/* ============================================
            NOTICE INFORMATIVE
            ============================================ */}
        <View style={s.notice}>
          <Text style={s.noticeTitle}>Informations pratiques</Text>
          <View style={s.noticeLine}>
            <Text style={s.noticeBullet}>•</Text>
            <Text style={s.noticeContent}>
              Le cabinet vous recontacte sous 24 à 48 heures ouvrées pour confirmer la date et l'heure définitives.
            </Text>
          </View>
          <View style={s.noticeLine}>
            <Text style={s.noticeBullet}>•</Text>
            <Text style={s.noticeContent}>
              Horaires d'ouverture : lundi à vendredi, de 08h00 à 13h30 et de 15h00 à 20h00. Samedi et dimanche fermés.
            </Text>
          </View>
          <View style={s.noticeLine}>
            <Text style={s.noticeBullet}>•</Text>
            <Text style={s.noticeContent}>
              Pour toute urgence : 01 97 76 29 36 ou p.abodecabinet@gmail.com.
            </Text>
          </View>
          <View style={s.noticeLine}>
            <Text style={s.noticeBullet}>•</Text>
            <Text style={s.noticeContent}>
              Présentez ce document imprimé ou en version numérique lors de votre visite.
            </Text>
          </View>
        </View>

        {/* ============================================
            PIED DE PAGE
            ============================================ */}
        <View style={s.footer} fixed>
          <Text style={s.footerCol}>cam-pab.com</Text>
          <Text style={s.footerCol}>
            Document confidentiel, protégé par le secret professionnel
          </Text>
          <Text style={s.footerColStrong}>{data.reference}</Text>
        </View>
      </Page>
    </Document>
  );
}

/* ============================================================
   Fonction principale
   ============================================================ */
export async function generateAppointmentPdf(
  data: AppointmentPdfData
): Promise<Buffer> {
  const logo = await getLogoDataUrl();
  return renderToBuffer(
    <AppointmentDocument data={data} logo={logo} />
  );
}

export async function generateAppointmentPdfBase64(
  data: AppointmentPdfData
): Promise<string> {
  const buffer = await generateAppointmentPdf(data);
  return buffer.toString("base64");
}