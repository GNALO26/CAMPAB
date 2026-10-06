// app/mentions-legales/page.tsx
import Link from 'next/link'

import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata = buildMetadata({
  title: 'Mentions légales',
  description:
    'Mentions légales du site du Cabinet CAMPAB, cabinet juridique à Cotonou spécialisé en médiation, arbitrage OHADA et conseil.',
  path: '/mentions-legales',
  noindex: false,
})

const lastUpdate = new Intl.DateTimeFormat('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(new Date())

export default function MentionsLegalesPage() {
  const domain = site.url.replace(/^https?:\/\//, '')

  return (
    <>
      <section className="page-header" aria-labelledby="mentions-title">
        <div className="page-header__bg" aria-hidden="true" />
        <div className="container">
          <div className="page-header__inner">
            <div>
              <div className="eyebrow eyebrow--white">Informations légales</div>
              <h1 id="mentions-title" className="page-header__title">
                Mentions
                <br />
                légales
              </h1>
            </div>
            <div>
              <p className="page-header__desc">
                Conformément aux dispositions légales en vigueur, voici les
                informations relatives à l’éditeur et à l’hébergeur du site{' '}
                {domain}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--md">
          <article className="legal-content">
            <h2>1. Éditeur du site</h2>
            <div className="legal-info">
              <p>
                <strong>Raison sociale :</strong> {site.shortName}
              </p>
              <p>
                <strong>Dénomination complète :</strong> {site.name}
              </p>
              <p>
                <strong>Représentante légale :</strong> Sètondji Prudencia ABODE
              </p>
              <p>
                <strong>Forme juridique :</strong> Cabinet individuel
              </p>
              <p>
                <strong>Siège social :</strong> {site.address.full}
              </p>
              <p>
                <strong>Téléphone :</strong>{' '}
                <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`}>
                  {site.contact.phone}
                </a>
              </p>
              <p>
                <strong>Email :</strong>{' '}
                <a href={`mailto:${site.contact.emailPro}`}>
                  {site.contact.emailPro}
                </a>
              </p>
              <p>
                <strong>Numéro IFU :</strong> 2201521524707
              </p>
              <p>
                <strong>RCCM :</strong> À compléter
              </p>
            </div>

            <h2>2. Hébergeur du site</h2>
            <div className="legal-info">
              <p>
                <strong>Nom :</strong> Netlify, Inc.
              </p>
              <p>
                <strong>Adresse :</strong> 512 2nd Street, Suite 200, San
                Francisco, CA 94107, États-Unis
              </p>
              <p>
                <strong>Site web :</strong>{' '}
                <a
                  href="https://www.netlify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.netlify.com
                </a>
              </p>
              <p>
                <strong>Téléphone :</strong> +1 (415) 691-1573
              </p>
            </div>

            <h2>3. Nom de domaine</h2>
            <div className="legal-info">
              <p>
                <strong>Domaine :</strong> {domain}
              </p>
              <p>
                <strong>Registrar :</strong> À compléter
              </p>
            </div>

            <h2>4. Propriété intellectuelle</h2>
            <p>
              L’ensemble des contenus présents sur le site {domain} (textes,
              images, logos, éléments graphiques, structure du site) sont la
              propriété exclusive de {site.name}, sauf mention contraire. Toute
              reproduction, représentation, modification ou exploitation, totale
              ou partielle, sans autorisation écrite préalable est strictement
              interdite et constituerait une contrefaçon sanctionnée par les
              dispositions du Code de la propriété intellectuelle.
            </p>

            <h2>5. Protection des données personnelles</h2>
            <p>
              Les informations collectées via les formulaires du site (contact,
              prise de rendez-vous) sont destinées exclusivement à{' '}
              {site.shortName}, dans le cadre du traitement des demandes. Elles
              ne sont en aucun cas cédées ou vendues à des tiers.
            </p>
            <p>
              Pour toute information relative à la collecte et au traitement de
              vos données, veuillez consulter notre{' '}
              <Link href="/confidentialite">politique de confidentialité</Link>.
            </p>

            <h2>6. Responsabilité</h2>
            <p>
              {site.shortName} s’efforce d’assurer l’exactitude et la mise à jour
              des informations diffusées sur le site. Toutefois, elle ne peut
              garantir l’exactitude, la précision ou l’exhaustivité des
              informations mises à disposition. En conséquence, {site.shortName}{' '}
              décline toute responsabilité pour toute imprécision, inexactitude
              ou omission portant sur des informations disponibles sur le site.
            </p>

            <h2>7. Liens hypertextes</h2>
            <p>
              Le site {domain} peut contenir des liens vers d’autres sites
              internet. {site.shortName} n’exerce aucun contrôle sur ces sites et
              décline toute responsabilité quant à leur contenu.
            </p>

            <h2>8. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit béninois.
              Tout litige relatif à l’utilisation du site {domain} relève de la
              compétence exclusive des tribunaux de Cotonou.
            </p>

            <h2>9. Contact</h2>
            <p>
              Pour toute question relative aux présentes mentions légales, vous
              pouvez nous contacter :
            </p>
            <div className="legal-info">
              <p>
                <strong>Par email :</strong>{' '}
                <a href={`mailto:${site.contact.emailPro}`}>
                  {site.contact.emailPro}
                </a>
              </p>
              <p>
                <strong>Par téléphone :</strong>{' '}
                <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`}>
                  {site.contact.phone}
                </a>
              </p>
            </div>

            <div className="legal-footer">
              <p>
                <em>Dernière mise à jour : {lastUpdate}</em>
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}