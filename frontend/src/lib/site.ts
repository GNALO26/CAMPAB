// src/lib/site.ts
export const site = {
  name: 'Cabinet Sètondji Prudencia ABODE',
  shortName: 'Cabinet CAMPAB',
  sigle: 'CAMPAB',
  url: 'https://cam-pab.com',
  slogan: 'Passez du litige à l’accord : la médiation qui scelle la paix.',
  signature: 'La rigueur du droit, la proximité humaine.',
  description:
    'Cabinet juridique à Cotonou spécialisé en médiation, arbitrage OHADA et consultations. Un accompagnement humain, rigoureux et confidentiel.',
  address: {
    street: 'Cotonou',
    city: 'Cotonou',
    country: 'Bénin',
    full: 'Cotonou, Bénin',
  },
  contact: {
    phone: '01 97 76 29 36',
    phone2: '01 95 17 77 78',
    whatsapp: '2290197762936',
    email: 'p.abodecabinet@gmail.com',
    emailPro: 'p.abodecabinet@gmail.com',
  },
  hours: [
    { day: 'Lundi', time: '08h00 à 13h30 et 15h00 à 20h00' },
    { day: 'Mardi', time: '08h00 à 13h30 et 15h00 à 20h00' },
    { day: 'Mercredi', time: '08h00 à 13h30 et 15h00 à 20h00' },
    { day: 'Jeudi', time: '08h00 à 13h30 et 15h00 à 20h00' },
    { day: 'Vendredi', time: '08h00 à 13h30 et 15h00 à 20h00' },
    { day: 'Samedi et dimanche', time: 'Fermé' },
  ],
  social: {
    linkedin: 'https://www.linkedin.com/in/sètondji-prudencia-abode',
    facebook: 'https://www.facebook.com/cabinetcampab',
  },
  googleMapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.09603356566!2d2.3990261747519837!3d6.381604693608767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023557b06b90d03%3A0xf3761fe69dc5ce3b!2sCAMPAB!5e0!3m2!1sfr!2sbj!4v1791037223992!5m2!1sfr!2sbj',
}

export const navigation = [
  { label: 'Accueil', href: '/' },
  { label: 'Le Cabinet', href: '/cabinet' },
  { label: 'Nos Expertises', href: '/expertises' },
  { label: 'Notre Équipe', href: '/equipe' },
  { label: 'Actualités', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export const expertises = [
  {
    title: 'Droit des affaires',
    desc: 'Sécurisation juridique de vos opérations commerciales et de vos contrats. Rédaction et révision de contrats commerciaux conformes au droit OHADA.',
    icon: 'Briefcase',
  },
  {
    title: 'Droit des sociétés',
    desc: 'Constitution, transformation et gouvernance d’entreprises. Rédaction de statuts, de pactes d’actionnaires et d’actes constitutifs.',
    icon: 'Building2',
  },
  {
    title: 'Droit social',
    desc: 'Relations de travail, contrats, contentieux prud’homal et gestion des ressources humaines.',
    icon: 'Users',
  },
  {
    title: 'Droit civil',
    desc: 'Obligations, contrats, responsabilité civile et droits des personnes. Accompagnement dans les successions et les régimes matrimoniaux.',
    icon: 'Scale',
  },
  {
    title: 'Droit immobilier',
    desc: 'Transactions, baux, sécurisation foncière et accompagnement dans les procédures de titrement au Bénin.',
    icon: 'Home',
  },
  {
    title: 'Droit administratif',
    desc: 'Relations avec l’administration, marchés publics et contentieux administratif devant les juridictions béninoises.',
    icon: 'Landmark',
  },
  {
    title: 'Droit OHADA',
    desc: 'Application des Actes uniformes et arbitrage régional. Accompagnement des entreprises dans l’espace OHADA.',
    icon: 'Globe2',
  },
  {
    title: 'Médiation et arbitrage',
    desc: 'Résolution amiable et juridictionnelle des conflits. Médiation conventionnelle et arbitrage OHADA.',
    icon: 'Handshake',
  },
]

export const valeurs = [
  { title: 'Rigueur', desc: 'Une analyse juridique précise et méthodique, fondée sur la maîtrise des textes OHADA et du droit béninois.' },
  { title: 'Intégrité', desc: 'Une pratique fondée sur l’éthique, la transparence et le respect du secret professionnel.' },
  { title: 'Confidentialité', desc: 'La protection absolue des informations et des intérêts du client, dans le respect du secret professionnel.' },
  { title: 'Écoute', desc: 'Une compréhension réelle de chaque situation, au-delà des seuls aspects juridiques.' },
  { title: 'Engagement', desc: 'Une implication constante dans chaque dossier, du conseil à l’exécution.' },
  { title: 'Proximité', desc: 'Une relation de confiance, un accompagnement personnalisé et une disponibilité réelle.' },
]

export const stats = [
  { value: 14, suffix: '+', label: 'Années d’expérience' },
  { value: 250, suffix: '+', label: 'Dossiers accompagnés' },
  { value: 8, suffix: '', label: 'Domaines d’expertise' },
  { value: 98, suffix: '%', label: 'Clients satisfaits' },
]