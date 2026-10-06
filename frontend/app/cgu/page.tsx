// app/cgu/page.tsx
import Link from 'next/link'

import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata = buildMetadata({
  title: 'Conditions générales d’utilisation',
  description:
    'Conditions générales d’utilisation du site du Cabinet CAMPAB, cabinet juridique à Cotonou, Bénin.',
  path: '/cgu',
  noindex: false,
})

const lastUpdate = new Intl.DateTimeFormat('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(new Date())

export default function CGUPage() {
  return (
    <>
      <section className="page-header" aria-labelledby="cgu-title">
        <div className="page-header__bg" aria-hidden="true" />
        <div className="container">
          <div className="page-header__inner">
            <div>
              <div className="eyebrow eyebrow--white">Cadre juridique</div>
              <h1 id="cgu-title" className="page-header__title">
                Conditions
                <br />
                d’utilisation
              </h1>
            </div>
            <div>
              <p className="page-header__desc">
                En accédant au site {site.url.replace('https://', '')}, vous
                acceptez les présentes conditions générales d’utilisation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--md">
          <article className="legal-content">
            <h2>1. Objet</h2>
            <p>
              Les présentes conditions générales ont pour objet de définir les
              modalités d’accès et d’utilisation du site{' '}
              {site.url.replace('https://', '')}, édité par {site.name}.
            </p>

            <h2>2. Acceptation des conditions</h2>
            <p>
              L’utilisation du site implique l’acceptation pleine et entière des
              présentes conditions générales d’utilisation. Si vous n’acceptez
              pas ces conditions, vous devez cesser d’utiliser le site.
            </p>

            <h2>3. Accès au site</h2>
            <p>
              Le site est accessible gratuitement à tout utilisateur disposant
              d’un accès à Internet. {site.shortName} se réserve le droit de
              modifier, suspendre ou interrompre l’accès au site à tout moment
              et sans préavis, notamment pour des raisons de maintenance.
            </p>

            <h2>4. Contenu du site</h2>
            <p>
              Les informations publiées sur le site, notamment les articles,
              descriptions de services et pages d’expertises, sont fournies à
              titre purement indicatif. Elles ne constituent en aucun cas un
              conseil juridique personnalisé. Pour toute situation particulière,
              veuillez <Link href="/contact">prendre rendez-vous</Link> avec le
              cabinet.
            </p>

            <h2>5. Utilisation du site</h2>
            <p>L’utilisateur s’engage à :</p>
            <ul>
              <li>
                Utiliser le site conformément à la loi et aux présentes
                conditions.
              </li>
              <li>
                Ne pas porter atteinte à la sécurité ou au bon fonctionnement du
                site.
              </li>
              <li>Ne pas tenter d’accéder à des zones non autorisées.</li>
              <li>
                Fournir des informations exactes lors de l’utilisation des
                formulaires.
              </li>
              <li>Ne pas usurper l’identité d’un tiers.</li>
            </ul>

            <h2>6. Limitation de responsabilité</h2>
            <p>
              {site.shortName} ne saurait être tenue responsable des dommages
              directs ou indirects résultant de l’utilisation ou de
              l’impossibilité d’utiliser le site, y compris les pertes de
              données ou les interruptions de service.
            </p>
            <p>
              Le cabinet met tout en œuvre pour assurer l’exactitude et la mise
              à jour des informations diffusées, mais ne peut garantir
              l’absence totale d’erreurs ou d’omissions.
            </p>

            <h2>7. Propriété intellectuelle</h2>
            <p>
              L’ensemble des contenus du site (textes, articles, logos,
              éléments graphiques) sont la propriété exclusive de {site.name},
              sauf mention contraire. Toute reproduction, même partielle, est
              interdite sans autorisation écrite préalable.
            </p>

            <h2>8. Modification des conditions</h2>
            <p>
              {site.shortName} se réserve le droit de modifier les présentes
              conditions à tout moment. Les utilisateurs sont invités à les
              consulter régulièrement. La version applicable est celle en
              vigueur au moment de la connexion au site.
            </p>

            <h2>9. Droit applicable</h2>
            <p>
              Les présentes conditions sont régies par le droit béninois. Tout
              litige relatif à leur interprétation ou à leur exécution relève
              de la compétence exclusive des tribunaux de Cotonou.
            </p>

            <h2>10. Contact</h2>
            <p>
              Pour toute question relative aux présentes conditions, vous
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