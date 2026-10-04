// src/lib/pdf.tsx
import fs from 'node:fs/promises'
import path from 'node:path'
import React from 'react'
import { Document, Image, Page, StyleSheet, Text, View, renderToBuffer } from '@react-pdf/renderer'
import { site } from '@/lib/site'
import { APPOINTMENT_SERVICES, APPOINTMENT_URGENCIES } from '@/lib/schemas'

const C = {
  navy: '#0B2942', navyDeep: '#071A2C', navyMid: '#123F5E',
  olive: '#5A8F32', border: '#D8E0E4', surface: '#F8FAF9',
  text: '#17212B', muted: '#5D6872', subtle: '#8B959F',
}

const s = StyleSheet.create({
  page: { paddingTop: 40, paddingBottom: 70, paddingHorizontal: 40, fontFamily: 'Helvetica', fontSize: 10, color: C.text, backgroundColor: '#FFF', lineHeight: 1.5 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: C.navy, marginBottom: 24 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 56, height: 56, objectFit: 'contain' },
  logoFallback: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.navy, color: '#FFF', textAlign: 'center', paddingTop: 20, fontFamily: 'Helvetica-Bold', fontSize: 12 },
  headerTextBlock: { flexDirection: 'column' },
  headerTitle: { fontFamily: 'Helvetica-Bold', fontSize: 16, color: C.navy, letterSpacing: 1 },
  headerSubtitle: { fontSize: 8, color: C.muted, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 },
  headerRight: { alignItems: 'flex-end' },
  headerMetaStrong: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.text, textAlign: 'right', marginBottom: 2 },
  headerMeta: { fontSize: 8, color: C.muted, textAlign: 'right' },
  docTitle: { fontFamily: 'Helvetica-Bold', fontSize: 22, color: C.navyDeep, letterSpacing: 0.4, marginBottom: 6 },
  docSubtitle: { fontSize: 10, color: C.muted, marginBottom: 24 },
  refBox: { backgroundColor: C.surface, borderLeftWidth: 3, borderLeftColor: C.olive, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 24 },
  refLabel: { fontSize: 8, color: C.muted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  refValue: { fontFamily: 'Helvetica-Bold', fontSize: 14, color: C.navyDeep, letterSpacing: 0.6 },
  grid: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  column: { flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 6, padding: 14, backgroundColor: '#FFF' },
  columnTitle: { fontFamily: 'Helvetica-Bold', fontSize: 10, color: C.navy, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: C.border },
  row: { flexDirection: 'row', marginBottom: 8 },
  rowLabel: { width: 90, fontSize: 9, color: C.muted },
  rowValue: { flex: 1, fontSize: 9, color: C.text, fontFamily: 'Helvetica-Bold' },
  section: { marginBottom: 20 },
  sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 10, color: C.navy, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 },
  sectionBody: { fontSize: 10, color: C.text, lineHeight: 1.6, padding: 12, backgroundColor: C.surface, borderRadius: 6, borderLeftWidth: 2, borderLeftColor: C.navyMid },
  notice: { backgroundColor: '#F0F7F0', borderWidth: 1, borderColor: '#CFE3CF', borderRadius: 6, padding: 12, marginBottom: 16 },
  noticeTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: C.olive, marginBottom: 6 },
  noticeLine: { flexDirection: 'row', marginBottom: 3 },
  noticeBullet: { width: 10, fontSize: 9, color: C.olive },
  noticeContent: { flex: 1, fontSize: 9, color: C.text },
  signature: { marginTop: 24, alignItems: 'flex-end' },
  signatureLabel: { fontSize: 8, color: C.muted, marginBottom: 4 },
  signatureName: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: C.navyDeep },
  signatureRole: { fontSize: 8, color: C.muted, marginTop: 2 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerCol: { fontSize: 8, color: C.subtle },
  footerColStrong: { fontSize: 8, color: C.muted, fontFamily: 'Helvetica-Bold' },
})

async function getLogoDataUrl(): Promise<string | null> {
  try {
    const p = path.join(process.cwd(), 'public', 'logo.png')
    const buf = await fs.readFile(p)
    return `data:image/png;base64,${buf.toString('base64')}`
  } catch { return null }
}

export interface AppointmentPdfData {
  reference: string
  typeService: string
  urgence: string
  description: string
  firstName: string
  lastName: string
  email: string
  phone: string
  organisation?: string | null
  country: string
  preferredDate?: string | null
  preferredTime?: string | null
  createdAt: Date | string
}

function formatDateLong(v?: string | null): string {
  if (!v) return 'Non précisée'
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return 'Non précisée'
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d)
}

function formatDateTime(v: string | Date): string {
  const d = typeof v === 'string' ? new Date(v) : v
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
}

function labelOf(list: readonly { value: string; label: string }[], v: string): string {
  return list.find((x) => x.value === v)?.label ?? v
}

function AppointmentDocument({ data, logo }: { data: AppointmentPdfData; logo: string | null }) {
  const fullName = `${data.firstName} ${data.lastName}`.trim()
  const serviceLabel = labelOf(APPOINTMENT_SERVICES, data.typeService)
  const urgenceLabel = labelOf(APPOINTMENT_URGENCIES, data.urgence)

  return (
    <Document title={`Confirmation de rendez-vous ${data.reference}`} author={site.name} subject="Confirmation de demande de rendez-vous" creator={site.shortName} producer={site.shortName}>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View style={s.headerLeft}>
            {logo ? <Image src={logo} style={s.logo} /> : <Text style={s.logoFallback}>{site.sigle}</Text>}
            <View style={s.headerTextBlock}>
              <Text style={s.headerTitle}>{site.sigle}</Text>
              <Text style={s.headerSubtitle}>{site.address.city}, {site.address.country}</Text>
            </View>
          </View>
          <View style={s.headerRight}>
            <Text style={s.headerMetaStrong}>{site.name}</Text>
            <Text style={s.headerMeta}>{site.contact.phone}</Text>
            <Text style={s.headerMeta}>{site.contact.emailPro}</Text>
          </View>
        </View>

        <Text style={s.docTitle}>Confirmation de rendez-vous</Text>
        <Text style={s.docSubtitle}>Document généré le {formatDateTime(data.createdAt)}</Text>

        <View style={s.refBox}>
          <Text style={s.refLabel}>Référence du dossier</Text>
          <Text style={s.refValue}>{data.reference}</Text>
        </View>

        <View style={s.grid}>
          <View style={s.column}>
            <Text style={s.columnTitle}>Vos coordonnées</Text>
            <View style={s.row}><Text style={s.rowLabel}>Nom complet</Text><Text style={s.rowValue}>{fullName}</Text></View>
            <View style={s.row}><Text style={s.rowLabel}>Email</Text><Text style={s.rowValue}>{data.email}</Text></View>
            <View style={s.row}><Text style={s.rowLabel}>Téléphone</Text><Text style={s.rowValue}>{data.phone}</Text></View>
            {data.organisation ? <View style={s.row}><Text style={s.rowLabel}>Organisation</Text><Text style={s.rowValue}>{data.organisation}</Text></View> : null}
            <View style={s.row}><Text style={s.rowLabel}>Pays</Text><Text style={s.rowValue}>{data.country}</Text></View>
          </View>

          <View style={s.column}>
            <Text style={s.columnTitle}>Le rendez-vous</Text>
            <View style={s.row}><Text style={s.rowLabel}>Nature</Text><Text style={s.rowValue}>{serviceLabel}</Text></View>
            <View style={s.row}><Text style={s.rowLabel}>Urgence</Text><Text style={s.rowValue}>{urgenceLabel}</Text></View>
            <View style={s.row}><Text style={s.rowLabel}>Date souhaitée</Text><Text style={s.rowValue}>{formatDateLong(data.preferredDate)}</Text></View>
            {data.preferredTime ? <View style={s.row}><Text style={s.rowLabel}>Heure souhaitée</Text><Text style={s.rowValue}>{data.preferredTime}</Text></View> : null}
            <View style={s.row}><Text style={s.rowLabel}>Statut</Text><Text style={s.rowValue}>En attente de confirmation</Text></View>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Description de la situation</Text>
          <Text style={s.sectionBody}>{data.description}</Text>
        </View>

        <View style={s.notice}>
          <Text style={s.noticeTitle}>Informations pratiques</Text>
          <View style={s.noticeLine}><Text style={s.noticeBullet}>•</Text><Text style={s.noticeContent}>Le cabinet vous recontacte sous 24 à 48 heures ouvrées pour confirmer la date et l’heure définitives.</Text></View>
          <View style={s.noticeLine}><Text style={s.noticeBullet}>•</Text><Text style={s.noticeContent}>Horaires : {site.hours.map((h) => `${h.day}, ${h.time}`).join(' · ')}.</Text></View>
          <View style={s.noticeLine}><Text style={s.noticeBullet}>•</Text><Text style={s.noticeContent}>Pour toute urgence : {site.contact.phone} ou {site.contact.emailPro}.</Text></View>
        </View>

        <View style={s.signature}>
          <Text style={s.signatureLabel}>Pour le cabinet,</Text>
          <Text style={s.signatureName}>{site.name}</Text>
          <Text style={s.signatureRole}>Arbitrage et médiation OHADA</Text>
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerCol}>{site.url}</Text>
          <Text style={s.footerCol}>Document confidentiel, protégé par le secret professionnel.</Text>
          <Text style={s.footerColStrong}>{data.reference}</Text>
        </View>
      </Page>
    </Document>
  )
}

export async function generateAppointmentPdf(data: AppointmentPdfData): Promise<Buffer> {
  const logo = await getLogoDataUrl()
  return renderToBuffer(<AppointmentDocument data={data} logo={logo} />)
}

export async function generateAppointmentPdfBase64(data: AppointmentPdfData): Promise<string> {
  const buf = await generateAppointmentPdf(data)
  return buf.toString('base64')
}