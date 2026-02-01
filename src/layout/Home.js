import { useSelector } from "react-redux";
import {
  Home as HomeIcon,
  User,
  Palette,
  Users,
  FileText,
  Zap,
  TrendingUp,
  Clock,
  Settings,
  Shield,
  MessageSquare,
} from "lucide-react";
import "./Home.css";

function Home() {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.admin;

  const quickActions = [
    {
      icon: User,
      title: "Mon Profil",
      description: "Gérez vos informations",
      color: "blue",
      path: "/profile",
    },
    {
      icon: Palette,
      title: "Ma Couleur",
      description: "Personnalisez votre thème",
      color: "pink",
      path: "/my-color",
    },
  ];

  const adminActions = [
    {
      icon: Users,
      title: "Utilisateurs",
      description: "Gérer tous les utilisateurs",
      color: "green",
      path: "/users",
    },
    {
      icon: FileText,
      title: "Demandes",
      description: "Consulter les demandes",
      color: "orange",
      path: "/requests",
    },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Bienvenue, <span className="gradient-text">{user?.prenom}</span>!
          </h1>
          <p className="hero-subtitle">
            Explorez votre tableau de bord personnel
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <TrendingUp size={18} className="stat-icon" />
          <span>Statistiques en temps réel</span>
        </div>
        <div className="divider"></div>
        <div className="stat-item">
          <Clock size={18} className="stat-icon" />
          <span>Mise à jour instantanée</span>
        </div>
        <div className="divider"></div>
        <div className="stat-item">
          <Zap size={18} className="stat-icon" />
          <span>Performance optimisée</span>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="section">
        <div className="section-header">
          <h2>Actions Rapides</h2>
          <p className="section-subtitle">
            Accédez rapidement aux fonctionnalités principales
          </p>
        </div>

        <div className="actions-grid">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <div
                key={action.title}
                className={`action-card action-${action.color}`}>
                <div className="action-icon">
                  <IconComponent size={28} />
                </div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <div className="action-arrow">→</div>
              </div>
            );
          })}

          {isAdmin &&
            adminActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <div
                  key={action.title}
                  className={`action-card action-${action.color}`}>
                  <div className="action-icon">
                    <IconComponent size={28} />
                  </div>
                  <div className="action-content">
                    <h3>{action.title}</h3>
                    <p>{action.description}</p>
                  </div>
                  <div className="action-arrow">→</div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Admin Section */}
      {isAdmin && (
        <div className="section admin-section">
          <div className="section-header">
            <Shield size={20} className="section-icon" />
            <div>
              <h2>Panneau Administrateur</h2>
              <p className="section-subtitle">Outils et contrôles avancés</p>
            </div>
          </div>

          <div className="admin-grid">
            <div className="admin-card">
              <div className="admin-card-header">
                <Users size={24} className="admin-icon blue" />
                <span className="admin-badge">Gestion</span>
              </div>
              <h3>Gestion des Utilisateurs</h3>
              <p>Gérez les profils, permissions et statuts des utilisateurs</p>
              <div className="admin-stats">
                <div className="stat">
                  <span className="stat-number">150+</span>
                  <span className="stat-label">Utilisateurs actifs</span>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <FileText size={24} className="admin-icon orange" />
                <span className="admin-badge">Requêtes</span>
              </div>
              <h3>Gestion des Demandes</h3>
              <p>Consultez et gérez les demandes des utilisateurs</p>
              <div className="admin-stats">
                <div className="stat">
                  <span className="stat-number">42</span>
                  <span className="stat-label">Demandes en attente</span>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <Settings size={24} className="admin-icon purple" />
                <span className="admin-badge">Configuration</span>
              </div>
              <h3>Paramètres Système</h3>
              <p>Configurez les paramètres globaux de l'application</p>
              <div className="admin-stats">
                <div className="stat">
                  <span className="stat-number">12</span>
                  <span className="stat-label">Options disponibles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Info Section */}
      <div className="section">
        <div className="section-header">
          <HomeIcon size={20} className="section-icon" />
          <div>
            <h2>Profil Personnel</h2>
            <p className="section-subtitle">Vos informations de compte</p>
          </div>
        </div>

        <div className="user-card">
          <div className="user-card-header">
            <div
              className="user-avatar"
              style={{ backgroundColor: user?.couleur || "#1d9bf0" }}>
              {user?.prenom?.charAt(0).toUpperCase()}
              {user?.nom?.charAt(0).toUpperCase()}
            </div>
            <div className="user-header-info">
              <h3>
                {user?.prenom} {user?.nom}
              </h3>
              <p>@{user?.pseudo}</p>
            </div>
            {isAdmin && <span className="user-role-badge">Admin</span>}
          </div>

          <div className="user-details">
            <div className="detail-row">
              <label>Email</label>
              <span>{user?.email || "Non défini"}</span>
            </div>
            <div className="detail-row">
              <label>Pseudo</label>
              <span>@{user?.pseudo}</span>
            </div>
            <div className="detail-row">
              <label>Devise</label>
              <span>{user?.Devise || "Non définie"}</span>
            </div>
            <div className="detail-row">
              <label>Thème</label>
              <div className="color-item">
                <div
                  className="color-dot"
                  style={{ backgroundColor: user?.couleur }}></div>
                <span>{user?.couleur || "#1d9bf0"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Info Section */}
      <div className="section info-section">
        <div className="section-header">
          <MessageSquare size={20} className="section-icon" />
          <div>
            <h2>Guide de Fonctionnalités</h2>
            <p className="section-subtitle">
              Découvrez ce que vous pouvez faire
            </p>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-item">
            <HomeIcon size={20} className="feature-icon" />
            <div>
              <h4>Accueil</h4>
              <p>
                Votre tableau de bord personnel avec statistiques et actions
                rapides
              </p>
            </div>
          </div>

          <div className="feature-item">
            <User size={20} className="feature-icon" />
            <div>
              <h4>Profil</h4>
              <p>Gérez vos informations personnelles et vos préférences</p>
            </div>
          </div>

          <div className="feature-item">
            <Palette size={20} className="feature-icon" />
            <div>
              <h4>Ma Couleur</h4>
              <p>Personnalisez votre thème avec votre couleur préférée</p>
            </div>
          </div>

          {isAdmin && (
            <>
              <div className="feature-item">
                <Users size={20} className="feature-icon admin" />
                <div>
                  <h4>Utilisateurs</h4>
                  <p>
                    Gérez tous les utilisateurs du système et leurs permissions
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <FileText size={20} className="feature-icon admin" />
                <div>
                  <h4>Demandes</h4>
                  <p>Consultez et traitez les demandes des utilisateurs</p>
                </div>
              </div>

              <div className="feature-item">
                <Shield size={20} className="feature-icon admin" />
                <div>
                  <h4>Accès Administrateur</h4>
                  <p>
                    Vous avez accès aux outils avancés et paramètres système
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
