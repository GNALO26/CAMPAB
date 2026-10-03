// app/conditions-utilisation/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Conditions d\'utilisation - CAMPAB',
  description: 'Conditions générales d\'utilisation du site cam-pab.com.',
}

export default function ConditionsUtilisationPage() {
  return (
    <>
      <section className="page-header">
        <div className="page-header__bg" aria-hidden="true"></div>
        <div className="container">
          <div className="page-header__inner">
            <div>
              <div className="eyebrow eyebrow--white page-header__eyebrow">
                Conditions
              </div>
              <h1 className="page-header__title">
                Conditions<br />d'utilisation
              </h1>
            </div>
            <div>
              <p className="page-header__desc">
                En accédant au site cam-pab.com, vous acceptez les présentes conditions
                générales d'utilisation.
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
              Les présentes conditions générales ont pour objet de définir les modalités
              d'accès et d'utilisation du site cam-pab.com, édité par CAMPAB.
            </p>

            <h2>2. Acceptation des conditions</h2>
            <p>
              L'utilisation du site cam-pab.com implique l'acceptation pleine et entière
              des présentes conditions générales d'utilisation. Si vous n'acceptez pas
              ces conditions, vous devez cesser d'utiliser le site.
            </p>

            <h2>3. Accès au site</h2>
            <p>
              Le site est accessible gratuitement à tout utilisateur disposant d'un accès
              à Internet. CAMPAB se réserve le droit de modifier, suspendre ou interrompre
              l'accès au site à tout moment et sans préavis.
            </p>

            <h2>4. Contenu du site</h2>
            <p>
              Les informations publiées sur le site (textes, articles, descriptions de
              services) sont fournies à titre purement indicatif. Elles ne constituent
              en aucun cas un conseil juridique personnalisé. Pour toute situation
              particulière, veuillez{' '}
              <Link href="/rdv">prendre rendez-vous</Link> avec le cabinet.
            </p>

            <h2>5. Utilisation du site</h2>
            <p>L'utilisateur s'engage à :</p>
            <ul>
              <li>Utiliser le site conformément à la loi et aux présentes conditions</li>
              <li>Ne pas porter atteinte à la sécurité ou au bon fonctionnement du site</li>
              <li>Ne pas tenter d'accéder à des zones non autorisées</li>
              <li>Fournir des informations exactes lors de l'utilisation des formulaires</li>
            </ul>

            <h2>6. Limitation de responsabilité</h2>
            <p>
              CAMPAB ne saurait être tenue responsable des dommages directs ou indirects
              résultant de l'utilisation ou de l'impossibilité d'utiliser le site, y
              compris les pertes de données ou les interruptions de service.
            </p>

            <h2>7. Modification des conditions</h2>
            <p>
              CAMPAB se réserve le droit de modifier les présentes conditions à tout moment.
              Les utilisateurs sont invités à les consulter régulièrement.
            </p>

            <h2>8. Droit applicable</h2>
            <p>
              Les présentes conditions sont régies par le droit béninois. Tout litige
              relatif à leur interprétation ou à leur exécution relève de la compétence
              exclusive des tribunaux de Cotonou.
            </p>

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