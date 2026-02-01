import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  Check,
  Palette,
  Info,
  Zap,
  Eye,
  AlertCircle,
  CheckCircle,
  Lock,
} from "lucide-react";
import "./MyColor.css";

function MyColor() {
  const API = "https://6935e745fa8e704dafbf386c.mockapi.io/users";
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  const [selectedColor, setSelectedColor] = useState(
    user?.couleur || "#1d9bf0",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const colors = [
    { name: "Bleu", value: "#1d9bf0" },
    { name: "Jaune", value: "#ffd700" },
    { name: "Rose", value: "#f42151" },
    { name: "Violet", value: "#9c27b0" },
    { name: "Vert", value: "#17bf63" },
    { name: "Orange", value: "#ff6b35" },
  ];

  // Get age directly from user object
  const userAge = user?.age;
  const isUnderAge = userAge !== null && userAge !== undefined && userAge < 15;

  console.log("Utilisateur:", user);
  console.log("Âge de l'utilisateur:", userAge);
  console.log("Est mineur:", isUnderAge);
  console.log("Couleur sélectionnée:", selectedColor);

  // Update selected color when user changes
  useEffect(() => {
    if (user?.couleur) {
      setSelectedColor(user.couleur);
    }
  }, [user?.couleur]);

  const handleColorSelect = async (colorValue) => {
    if (isUnderAge) {
      setError(
        "Vous êtes mineur de 15 ans, vous ne pouvez pas modifier votre couleur.",
      );
      return;
    }

    // Immediately update UI
    setSelectedColor(colorValue);
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const updatedUser = {
        ...user,
        couleur: colorValue,
      };

      console.log("Envoi de la mise à jour:", updatedUser);

      const response = await axios.put(`${API}/${user.id}`, updatedUser);

      console.log("Réponse de l'API:", response.data);

      // Update Redux with new color
      dispatch({
        type: "UPDATE_USER_COLOR",
        payload: colorValue,
      });

      setSuccess("Couleur mise à jour avec succès!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Erreur lors de la mise à jour de la couleur");
      console.error("Erreur complète:", err);
      // Revert color on error
      setSelectedColor(user?.couleur || "#1d9bf0");
    } finally {
      setLoading(false);
    }
  };

  const currentColorName =
    colors.find((c) => c.value === selectedColor)?.name || "Personnalisée";

  return (
    <div className="mycolor-container">
      {/* Header */}
      <div className="mycolor-header">
        <div className="header-top">
          <div className="header-title">
            <Palette size={24} className="header-icon" />
            <div>
              <h2>Ma Couleur</h2>
              <p className="current-color">
                Couleur actuelle: <strong>{currentColorName}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Age Restriction Alert */}
      {isUnderAge && (
        <div className="alert alert-restriction">
          <div className="restriction-content">
            <Lock size={20} />
            <div className="restriction-text">
              <h4>Accès Restreint</h4>
              <p>
                Vous êtes mineur de 15 ans, vous ne pouvez pas modifier votre
                couleur.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {/* Current Color Display */}
      <div className="current-color-display">
        <div className="color-preview-container">
          <div
            className="color-preview-large"
            style={{ backgroundColor: selectedColor }}></div>
          <div className="color-info">
            <div className="color-code-box">
              <span className="code-label">Code Couleur</span>
              <span className="code-value">{selectedColor}</span>
            </div>
            <div className="color-description">
              <Zap size={14} />
              <span>Votre couleur personnelle de profil</span>
            </div>
          </div>
        </div>
      </div>

      {/* Color Selection Grid - Hidden if under age */}
      {!isUnderAge && (
        <div className="color-selection-section">
          <div className="section-header">
            <h3>
              <Palette size={18} />
              Choisissez votre couleur
            </h3>
            <p>Sélectionnez la couleur qui vous représente le mieux</p>
          </div>

          <div className="colors-grid">
            {colors.map((color) => (
              <button
                key={color.value}
                className={`color-option ${
                  selectedColor === color.value ? "selected" : ""
                }`}
                onClick={() => handleColorSelect(color.value)}
                disabled={loading}
                title={color.name}>
                <div
                  className="color-option-circle"
                  style={{ backgroundColor: color.value }}>
                  {selectedColor === color.value && (
                    <Check size={28} className="check-icon" />
                  )}
                </div>
                <span className="color-option-name">{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Profile Preview */}
      <div className="preview-section">
        <div className="section-header">
          <h3>
            <Eye size={18} />
            Aperçu de votre profil
          </h3>
        </div>

        <div className="profile-preview">
          <div
            className="preview-avatar"
            style={{ backgroundColor: selectedColor }}>
            {user?.prenom?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="preview-info">
            <h4>
              {user?.prenom} {user?.nom}
            </h4>
            <p className="preview-handle">@{user?.pseudo}</p>
            {isUnderAge && (
              <p className="preview-age-restriction">
                <Lock size={14} />
                Modification de couleur restreinte
              </p>
            )}
            {!isUnderAge && (
              <p className="preview-text">
                Votre couleur s'affichera partout sur le site
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Color Information */}
      {!isUnderAge && (
        <div className="info-section">
          <div className="section-header">
            <h3>
              <Info size={18} />À propos de votre couleur
            </h3>
          </div>

          <div className="info-content">
            <div className="info-card">
              <div className="info-card-icon">
                <Palette size={20} />
              </div>
              <div className="info-card-text">
                <h4>Avatar Personnalisé</h4>
                <p>Votre avatar sera affiché avec votre couleur sélectionnée</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-card-icon">
                <Zap size={20} />
              </div>
              <div className="info-card-text">
                <h4>Interactions Marquées</h4>
                <p>Vos interactions seront mises en avant avec votre couleur</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-card-icon">
                <CheckCircle size={20} />
              </div>
              <div className="info-card-text">
                <h4>Changement Facile</h4>
                <p>Vous pouvez changer votre couleur à tout moment</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Age Information Card - Shown if under age */}
      {isUnderAge && (
        <div className="info-section">
          <div className="section-header">
            <h3>
              <Lock size={18} />À propos de cette restriction
            </h3>
          </div>

          <div className="info-content">
            <div className="info-card restriction-info">
              <div className="info-card-icon lock-icon">
                <Lock size={20} />
              </div>
              <div className="info-card-text">
                <h4>Pourquoi cette restriction?</h4>
                <p>
                  Les utilisateurs de moins de 15 ans ne peuvent pas modifier
                  leur couleur de profil pour des raisons de sécurité et de
                  conformité.
                </p>
              </div>
            </div>

            <div className="info-card restriction-info">
              <div className="info-card-icon">
                <CheckCircle size={20} />
              </div>
              <div className="info-card-text">
                <h4>Quand pourrez-vous changer?</h4>
                <p>
                  Une fois que vous atteindrez l'âge de 15 ans, vous pourrez
                  accéder à toutes les options de personnalisation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyColor;
