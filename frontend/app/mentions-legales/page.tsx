// app/mentions-legales/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mentions légales - CAMPAB',
  description:
    'Mentions légales du site cam-pab.com - Cabinet d\'Arbitrage et de Médiation Prudencia Abode Badou, Cotonou, Bénin.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function MentionsLegalesPage() {
  return (
    <>
      {/* Page Header */}
      <section className="page-header" aria-labelledby="page-title">
        <div className="page-header__bg" aria-hidden="true"></div>
        <div className="container">
          <div className="page-header__inner">
            <div>
              <div className="eyebrow eyebrow--white page-header__eyebrow">
                Informations légales
              </div>
              <h1 id="page-title" className="page-header__title">
                Mentions<br />légales
              </h1>
            </div>
            <div>
              <p className="page-header__desc">
                Conformément aux dispositions légales en vigueur, voici les informations
                relatives à l'éditeur et à l'hébergeur du site cam-pab.com.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="section">
        <div className="container container--md">
          <article className="legal-content">
            <h2>1. Éditeur du site</h2>
            <div className="legal-info">
              <p><strong>Raison sociale :</strong> CAMPAB</p>
              <p><strong>Dénomination complète :</strong> Cabinet d'Arbitrage et de Médiation Prudencia Abode Badou</p>
              <p><strong>Représentante légale :</strong> Me Prudencia Sètondji ABODE BADOU</p>
              <p><strong>Forme juridique :</strong> Cabinet individuel</p>
              <p><strong>Siège social :</strong> Cotonou, Bénin</p>
              <p><strong>Téléphone :</strong> <a href="tel:+2290197762936">01 97 76 29 36</a></p>
              <p><strong>Email :</strong> <a href="mailto:p.abodecabinet@gmail.com">p.abodecabinet@gmail.com</a></p>
              <p><strong>Numéro IFU :</strong> 2201521524707</p>
              <p><strong>RCCM :</strong> [À compléter]</p>
            </div>

            <h2>2. Hébergeur du site</h2>
            <div className="legal-info">
              <p><strong>Nom :</strong> Netlify, Inc.</p>
              <p><strong>Adresse :</strong> 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis</p>
              <p><strong>Site web :</strong> <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">www.netlify.com</a></p>
              <p><strong>Téléphone :</strong> +1 (415) 691-1573</p>
            </div>

            <h2>3. Nom de domaine</h2>
            <div className="legal-info">
              <p><strong>Domaine :</strong> cam-pab.com</p>
              <p><strong>Registrar :</strong> [Nom du registrar]</p>
            </div>

            <h2>4. Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus présents sur le site cam-pab.com (textes, images, logos,
              éléments graphiques, structure du site) sont la propriété exclusive de CAMPAB,
              sauf mention contraire. Toute reproduction, représentation, modification ou
              exploitation, totale ou partielle, sans autorisation écrite préalable est
              strictement interdite et constituerait une contrefaçon sanctionnée par les
              dispositions du Code de la propriété intellectuelle.
            </p>

            <h2>5. Protection des données personnelles</h2>
            <p>
              Les informations collectées via les formulaires du site (contact, prise de
              rendez-vous) sont destinées exclusivement à CAMPAB, dans le cadre du traitement
              des demandes. Elles ne sont en aucun cas cédées ou vendues à des tiers.
            </p>
            <p>
              Pour toute information relative à la collecte et au traitement de vos données,
              veuillez consulter notre{' '}
              <Link href="/confidentialite">Politique de confidentialité</Link>.
            </p>

            <h2>6. Responsabilité</h2>
            <p>
              CAMPAB s'efforce d'assurer l'exactitude et la mise à jour des informations
              diffusées sur le site. Toutefois, elle ne peut garantir l'exactitude, la
              précision ou l'exhaustivité des informations mises à disposition. En conséquence,
              CAMPAB décline toute responsabilité pour toute imprécision, inexactitude ou
              omission portant sur des informations disponibles sur le site.
            </p>

            <h2>7. Liens hypertextes</h2>
            <p>
              Le site cam-pab.com peut contenir des liens vers d'autres sites internet.
              CAMPAB n'exerce aucun contrôle sur ces sites et décline toute responsabilité
              quant à leur contenu.
            </p>

            <h2>8. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit béninois. Tout litige
              relatif à l'utilisation du site cam-pab.com relève de la compétence exclusive
              des tribunaux de Cotonou.
            </p>

            <h2>9. Contact</h2>
            <p>
              Pour toute question relative aux présentes mentions légales, vous pouvez nous
              contacter :
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