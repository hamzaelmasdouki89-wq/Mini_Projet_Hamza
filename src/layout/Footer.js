import { Mail, Github, Twitter, Linkedin, Heart, Shield } from "lucide-react";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section logo-section">
          <div className="footer-logo">
            <span className="logo-text">hAAs</span>
          </div>
          <p className="logo-description">
            Plateforme de gestion de demandes simplifiée et sécurisée
          </p>
          <div className="social-links">
            <a href="#" className="social-link" title="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="social-link" title="GitHub">
              <Github size={20} />
            </a>
            <a href="#" className="social-link" title="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:contact@haas.com"
              className="social-link"
              title="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="section-title">Produit</h4>
          <ul className="link-list">
            <li>
              <a href="#features">Fonctionnalités</a>
            </li>
            <li>
              <a href="#pricing">Tarification</a>
            </li>
            <li>
              <a href="#security">Sécurité</a>
            </li>
            <li>
              <a href="#updates">Mises à jour</a>
            </li>
            <li>
              <a href="#roadmap">Feuille de route</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="section-title">Entreprise</h4>
          <ul className="link-list">
            <li>
              <a href="#about">À propos</a>
            </li>
            <li>
              <a href="#blog">Blog</a>
            </li>
            <li>
              <a href="#careers">Carrières</a>
            </li>
            <li>
              <a href="#press">Presse</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="section-title">Ressources</h4>
          <ul className="link-list">
            <li>
              <a href="#docs">Documentation</a>
            </li>
            <li>
              <a href="#api">API</a>
            </li>
            <li>
              <a href="#guides">Guides</a>
            </li>
            <li>
              <a href="#support">Support</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="section-title">Légal</h4>
          <ul className="link-list">
            <li>
              <a href="#privacy">Politique de confidentialité</a>
            </li>
            <li>
              <a href="#terms">Conditions d'utilisation</a>
            </li>
            <li>
              <a href="#cookies">Politique des cookies</a>
            </li>
            <li>
              <a href="#terms-service">Conditions de service</a>
            </li>
            <li>
              <a href="#accessibility">Accessibilité</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <div className="bottom-left">
          <p className="copyright">
            © {currentYear} hAAs.com. Tous les droits réservés.
          </p>
          <div className="security-badge">
            <Shield size={16} />
            <span>Sécurisé et certifié</span>
          </div>
        </div>

        <div className="bottom-right">
          <p className="made-with">
            Créé avec Hamza pour faciliter votre expérience
          </p>
          <p className="version">Version 1.0.0</p>
        </div>
      </div>

      <button
        className="scroll-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Retour au haut">
        ↑
      </button>
    </footer>
  );
}

export default Footer;
