// app/confidentialite/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Politique de confidentialité - CAMPAB',
  description:
    'Politique de confidentialité et de protection des données personnelles du site cam-pab.com.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function ConfidentialitePage() {
  return (
    <>
      {/* Page Header */}
      <section className="page-header" aria-labelledby="page-title">
        <div className="page-header__bg" aria-hidden="true"></div>
        <div className="container">
          <div className="page-header__inner">
            <div>
              <div className="eyebrow eyebrow--white page-header__eyebrow">
                Protection des données
              </div>
              <h1 id="page-title" className="page-header__title">
                Politique de<br />confidentialité
              </h1>
            </div>
            <div>
              <p className="page-header__desc">
                CAMPAB s'engage à protéger la confidentialité des données personnelles
                de ses utilisateurs, conformément aux dispositions légales en vigueur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="section">
        <div className="container container--md">
          <article className="legal-content">
            <h2>1. Responsable du traitement</h2>
            <div className="legal-info">
              <p><strong>Nom :</strong> CAMPAB - Cabinet d'Arbitrage et de Médiation Prudencia Abode Badou</p>
              <p><strong>Représentante légale :</strong> Me Prudencia Sètondji ABODE BADOU</p>
              <p><strong>Adresse :</strong> Cotonou, Bénin</p>
              <p><strong>Email :</strong> <a href="mailto:p.abodecabinet@gmail.com">p.abodecabinet@gmail.com</a></p>
              <p><strong>Téléphone :</strong> <a href="tel:+2290197762936">01 97 76 29 36</a></p>
            </div>

            <h2>2. Données collectées</h2>
            <p>
              CAMPAB collecte uniquement les données strictement nécessaires au traitement
              des demandes formulées via le site cam-pab.com :
            </p>
            <ul>
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Pays de résidence</li>
              <li>Nom de l'organisation ou de l'entreprise (facultatif)</li>
              <li>Description du litige ou de la demande</li>
              <li>Type de service souhaité (consultation, arbitrage, médiation)</li>
              <li>Niveau d'urgence</li>
              <li>Date et heure du rendez-vous souhaité</li>
            </ul>

            <h2>3. Finalités du traitement</h2>
            <p>Les données collectées sont utilisées exclusivement pour :</p>
            <ul>
              <li>Répondre aux demandes de contact et d'information</li>
              <li>Enregistrer et gérer les demandes de rendez-vous</li>
              <li>Contacter les utilisateurs pour confirmer un rendez-vous</li>
              <li>Assurer le suivi des dossiers juridiques</li>
              <li>Améliorer la qualité des services proposés</li>
            </ul>

            <h2>4. Base légale</h2>
            <p>
              Le traitement des données personnelles repose sur :
            </p>
            <ul>
              <li><strong>Le consentement</strong> de l'utilisateur (case à cocher lors de la soumission du formulaire)</li>
              <li><strong>L'exécution d'un contrat</strong> ou de mesures précontractuelles (prise de rendez-vous)</li>
              <li><strong>L'intérêt légitime</strong> de CAMPAB dans le cadre de la gestion de ses activités</li>
            </ul>

            <h2>5. Durée de conservation</h2>
            <p>
              Les données personnelles sont conservées pour une durée maximale de <strong>3 ans</strong>{' '}
              à compter du dernier contact avec l'utilisateur, sauf obligation légale de
              conservation plus longue ou demande de suppression anticipée.
            </p>

            <h2>6. Destinataires des données</h2>
            <p>
              Les données collectées sont destinées uniquement à CAMPAB. Elles ne sont
              en aucun cas transmises, vendues ou cédées à des tiers, sauf :
            </p>
            <ul>
              <li>Obligation légale ou demande d'une autorité compétente</li>
              <li>Prestataires techniques (hébergeur Netlify, service d'envoi d'emails Gmail) agissant sous contrat de confidentialité</li>
            </ul>

            <h2>7. Sécurité des données</h2>
            <p>
              CAMPAB met en œuvre des mesures techniques et organisationnelles appropriées
              pour protéger les données personnelles contre tout accès non autorisé,
              modification, divulgation ou destruction. Le site utilise le protocole
              HTTPS (SSL) pour sécuriser les échanges.
            </p>

            <h2>8. Vos droits</h2>
            <p>
              Conformément à la réglementation en vigueur, vous disposez des droits suivants :
            </p>
            <ul>
              <li><strong>Droit d'accès</strong> : obtenir la confirmation du traitement de vos données</li>
              <li><strong>Droit de rectification</strong> : corriger les données inexactes ou incomplètes</li>
              <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
              <li><strong>Droit à la limitation</strong> : restreindre l'utilisation de vos données</li>
              <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
              <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous par email à{' '}
              <a href="mailto:p.abodecabinet@gmail.com">p.abodecabinet@gmail.com</a> ou par
              téléphone au <a href="tel:+2290197762936">01 97 76 29 36</a>.
            </p>

            <h2>9. Cookies</h2>
            <p>
              Le site cam-pab.com utilise uniquement des cookies techniques nécessaires à
              son bon fonctionnement (mémorisation du thème clair/sombre, statistiques
              anonymes via Google Analytics). Aucun cookie publicitaire ou de profilage
              n'est utilisé.
            </p>
            <p>
              Vous pouvez à tout moment désactiver les cookies dans les paramètres de votre
              navigateur.
            </p>

            <h2>10. Google Analytics</h2>
            <p>
              Ce site utilise Google Analytics pour analyser l'audience de manière anonyme.
              Les données collectées (pages visitées, durée de visite, provenance géographique)
              ne permettent pas de vous identifier personnellement. Vous pouvez désactiver
              le suivi via l'extension officielle de Google.
            </p>

            <h2>11. Modifications de la politique</h2>
            <p>
              CAMPAB se réserve le droit de modifier la présente politique de confidentialité
              à tout moment, afin de se conformer aux évolutions légales ou techniques.
              Les utilisateurs sont invités à la consulter régulièrement.
            </p>

            <h2>12. Contact</h2>
            <p>
              Pour toute question relative à la présente politique de confidentialité,
              vous pouvez nous contacter :
            </p>
            <div className="legal-info">
              <p><strong>Par email :</strong> <a href="mailto:p.abodecabinet@gmail.com">p.abodecabinet@gmail.com</a></p>
              <p><strong>Par téléphone :</strong> <a href="tel:+2290197762936">01 97 76 29 36</a></p>
            </div>

            <div className="legal-footer">
              <p>
                <em>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</em>
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}