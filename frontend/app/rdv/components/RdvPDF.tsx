// app/rdv/components/RdvPDF.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid #0D2B5E",
    paddingBottom: 16,
    marginBottom: 24,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  headerText: {
    flexDirection: "column",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D2B5E",
  },
  subtitle: {
    fontSize: 10,
    color: "#4A5C78",
    marginTop: 2,
  },
  badge: {
    backgroundColor: "#D4A017",
    color: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0D2B5E",
    marginBottom: 8,
    borderBottom: "1px solid #E0E7EF",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottom: "1px solid #F0F4F8",
  },
  label: {
    fontSize: 11,
    color: "#4A5C78",
    width: "40%",
  },
  value: {
    fontSize: 11,
    fontWeight: "500",
    color: "#1E2D4A",
    width: "60%",
  },
  message: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#F7F9FC",
    borderRadius: 4,
    fontSize: 10,
    color: "#1E2D4A",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: "1px solid #E0E7EF",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    color: "#8FA0BC",
  },
  footerLeft: {
    flexDirection: "row",
    gap: 16,
  },
});

interface RdvPDFProps {
  data: {
    typeService: string;
    urgence: string;
    description: string;
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    organisation: string;
    pays: string;
    date: string;
    heure: string;
  };
}

export default function RdvPDF({ data }: RdvPDFProps) {
  const serviceLabels: Record<string, string> = {
    consultation: "Consultation juridique",
    arbitrage: "Arbitrage OHADA",
    mediation: "Médiation",
  };

  const urgenceLabels: Record<string, string> = {
    normale: "Normale",
    elevee: "Élevée",
    critique: "Critique",
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image src="/logo.png" style={styles.logo} />
            <View style={styles.headerText}>
              <Text style={styles.title}>CAMPAB</Text>
              <Text style={styles.subtitle}>
                Cabinet d&apos;Arbitrage et de Médiation
              </Text>
              <Text style={styles.subtitle}>Cotonou, Bénin</Text>
            </View>
          </View>
          <View style={styles.badge}>
            <Text>CONFIRMATION</Text>
          </View>
        </View>

        {/* Titre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Confirmation de rendez-vous
          </Text>
        </View>

        {/* Détails */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{data.date}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Heure</Text>
            <Text style={styles.value}>{data.heure}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nom complet</Text>
            <Text style={styles.value}>
              {data.prenom} {data.nom}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{data.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Téléphone</Text>
            <Text style={styles.value}>{data.telephone}</Text>
          </View>
          {data.organisation && (
            <View style={styles.row}>
              <Text style={styles.label}>Organisation</Text>
              <Text style={styles.value}>{data.organisation}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Pays</Text>
            <Text style={styles.value}>{data.pays}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Type de service</Text>
            <Text style={styles.value}>
              {serviceLabels[data.typeService] || data.typeService}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Niveau d&apos;urgence</Text>
            <Text style={styles.value}>
              {urgenceLabels[data.urgence] || data.urgence}
            </Text>
          </View>
        </View>

        {/* Description */}
        {data.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description du litige</Text>
            <Text style={styles.message}>{data.description}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text>p.abodecabinet@gmail.com</Text>
            <Text>01 97 76 29 36</Text>
          </View>
          <Text>© {new Date().getFullYear()} CAMPAB</Text>
        </View>
      </Page>
    </Document>
  );
}