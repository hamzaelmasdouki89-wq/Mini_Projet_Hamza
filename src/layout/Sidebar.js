import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Home,
  User,
  Users,
  FileText,
  Palette,
  LogOut,
  MoreHorizontal,
  Plus,
  X,
  Send,
  CheckSquare,
} from "lucide-react";
import { useNotificationHelper } from "./Usenotificationhelper";
import { validateRequest } from "./validation";
import "./Sidebar.css";

const API_BASE_URL = "https://6935e745fa8e704dafbf386c.mockapi.io";
const API_ENDPOINTS = {
  REQUESTS: `${API_BASE_URL}/demandes`,
  USERS: `${API_BASE_URL}/users`,
};

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const notify = useNotificationHelper();

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
  });

  const isAdmin = user?.admin;
  const abortControllerRef = useRef(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const colors = [
    { name: "Bleu", value: "#1d9bf0" },
    { name: "Jaune", value: "#ffd700" },
    { name: "Rose", value: "#f42151" },
    { name: "Violet", value: "#9c27b0" },
    { name: "Vert", value: "#17bf63" },
    { name: "Orange", value: "#ff6b35" },
  ];

  const navigationItems = [
    { icon: Home, label: "Accueil", path: "/home" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: CheckSquare, label: "Mes Demandes", path: "/my-requests" },
    ...(isAdmin
      ? [{ icon: Users, label: "Utilisateurs", path: "/users" }]
      : []),
    ...(isAdmin
      ? [{ icon: FileText, label: "Demandes", path: "/requests" }]
      : []),
    { icon: Palette, label: "Ma Couleur", path: "/my-color" },
    { icon: LogOut, label: "Se Déconnecter", path: "/logout" },
  ];

  const handleNavigate = (path) => {
    if (path === "/logout") {
      handleLogout();
    } else {
      navigate(path);
    }
  };

  const handleColorChange = async (color) => {
    try {
      setLoading(true);

      const userId = user?.id || user?.userId;
      if (!userId) {
        notify.error("Erreur: ID utilisateur manquant");
        return;
      }

      await axios.put(
        `${API_ENDPOINTS.USERS}/${userId}`,
        { couleur: color.value },
        { signal: abortControllerRef.current?.signal },
      );

      dispatch({
        type: "UPDATE_USER_COLOR",
        payload: color.value,
      });

      notify.success(`Couleur changée en ${color.name}`);
      setShowColorPicker(false);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("Color change error:", err);
      notify.error("Erreur lors de la modification de la couleur");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    abortControllerRef.current?.abort();
    dispatch({
      type: "LOGOUT",
    });
    notify.info("Vous avez été déconnecté");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();

    const errors = validateRequest(formData);
    if (errors.length > 0) {
      errors.forEach((err) => notify.error(err));
      return;
    }

    const userId = user?.id || user?.userId;
    if (!userId) {
      notify.error("Erreur: ID utilisateur manquant");
      return;
    }

    setLoading(true);

    try {
      const newRequest = {
        titre: formData.titre.trim(),
        description: formData.description.trim(),
        userId,
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };

      const response = await axios.post(API_ENDPOINTS.REQUESTS, newRequest, {
        signal: abortControllerRef.current?.signal,
      });

      dispatch({
        type: "ADD_REQUEST",
        payload: response.data,
      });

      notify.success("Demande créée avec succès!");
      setFormData({ titre: "", description: "" });

      setTimeout(() => {
        setShowRequestModal(false);
      }, 1500);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("Request creation error:", err);
      notify.error("Erreur lors de la création de la demande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-text">hAAs</span>
      </div>

      <nav className="sidebar-nav">
        {navigationItems.map((item) => (
          <button
            key={item.label}
            className="nav-item"
            onClick={() => handleNavigate(item.path)}
            title={item.label}
            aria-label={item.label}>
            <item.icon size={20} aria-hidden="true" />
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <button
        className="post-btn"
        onClick={() => {
          setShowRequestModal(true);
          setFormData({ titre: "", description: "" });
        }}
        aria-label="Créer une nouvelle demande">
        Demande <Plus size={16} aria-hidden="true" />
      </button>

      <div className="user-profile-card">
        <div
          className="profile-avatar"
          style={{ backgroundColor: user?.couleur || "#1d9bf0" }}>
          {user?.prenom?.charAt(0) || "U"}
        </div>
        <div className="profile-info">
          <h4 className="profile-name">
            {user?.prenom} {user?.nom}
          </h4>
          <p className="profile-handle">@{user?.pseudo || "user"}</p>
        </div>
        <div className="profile-menu">
          <button
            className="menu-btn"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            aria-label="Menu utilisateur"
            aria-expanded={showMoreMenu}
            aria-haspopup="true">
            <MoreHorizontal size={16} aria-hidden="true" />
          </button>
          {showMoreMenu && (
            <div className="dropdown-menu" role="menu">
              <button
                className="dropdown-item"
                onClick={() => setShowColorPicker(!showColorPicker)}
                role="menuitem"
                aria-label="Changer la couleur du profil">
                <Palette size={16} aria-hidden="true" /> Changer la Couleur
              </button>
              <button
                className="dropdown-item logout"
                onClick={handleLogout}
                role="menuitem">
                <LogOut size={16} aria-hidden="true" /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>

      {showColorPicker && (
        <div className="color-picker-section">
          <h4 className="color-picker-title">Choisissez votre couleur</h4>
          <div className="color-grid" role="group">
            {colors.map((color) => (
              <button
                key={color.value}
                className="color-option"
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorChange(color)}
                title={color.name}
                aria-label={`Changer la couleur en ${color.name}`}
                disabled={loading}>
                <span className="color-label">{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {showRequestModal &&
        createPortal(
          <div
            className="modal-overlay"
            onClick={() => setShowRequestModal(false)}
            role="presentation">
            <div
              className="modal-content request-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-labelledby="request-modal-title">
              <div className="modal-header">
                <h2 id="request-modal-title">Créer une Demande</h2>
                <button
                  className="btn-close"
                  onClick={() => setShowRequestModal(false)}
                  aria-label="Fermer la boîte de dialogue"
                  type="button">
                  <X size={24} aria-hidden="true" />
                </button>
              </div>

              <form className="request-form" onSubmit={handleCreateRequest}>
                <div className="form-group">
                  <label htmlFor="titre">Titre *</label>
                  <input
                    type="text"
                    id="titre"
                    name="titre"
                    value={formData.titre}
                    onChange={handleInputChange}
                    placeholder="Entrez le titre de votre demande"
                    disabled={loading}
                    className="form-input"
                    maxLength={100}
                    required
                    aria-describedby="titre-count"
                  />
                  <span className="char-count" id="titre-count">
                    {formData.titre.length}/100
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Décrivez votre demande en détail"
                    disabled={loading}
                    className="form-textarea"
                    rows={6}
                    maxLength={1000}
                    required
                    aria-describedby="description-count"
                  />
                  <span className="char-count" id="description-count">
                    {formData.description.length}/1000
                  </span>
                </div>

                <div className="form-info">
                  <p>
                    <strong>Informations automatiques :</strong>
                  </p>
                  <ul>
                    <li>ID Utilisateur: {user?.id || user?.userId || "N/A"}</li>
                    <li>Statut: En attente</li>
                    <li>
                      Date de création:{" "}
                      {new Date().toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </li>
                  </ul>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => setShowRequestModal(false)}
                    disabled={loading}>
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn btn-submit"
                    disabled={loading}>
                    <Send size={18} aria-hidden="true" />
                    {loading ? "Création..." : "Créer la Demande"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </aside>
  );
}

export default Sidebar;
