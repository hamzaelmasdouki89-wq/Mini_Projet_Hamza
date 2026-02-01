import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  Edit2,
  Save,
  X,
  Mail,
  User,
  Lock,
  Palette,
  DollarSign,
  MapPin,
  Calendar,
  Image,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import "./Profile.css";

function Profile() {
  const API = "https://6935e745fa8e704dafbf386c.mockapi.io/users";
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
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

  const currencies = ["USD", "DH", "EUR", "GBP", "JPY", "CAD"];

  const [formData, setFormData] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    age: user?.age || "",
    pseudo: user?.pseudo || "",
    email: user?.email || "",
    MotDePasse: "",
    confirmPassword: "",
    couleur: user?.couleur || "",
    Devise: user?.Devise || "",
    Pays: user?.Pays || "",
    avatar: user?.avatar || "",
    photo: user?.photo || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorChange = (colorValue) => {
    setFormData((prev) => ({
      ...prev,
      couleur: colorValue,
    }));
  };

  const handleCurrencyChange = (currency) => {
    setFormData((prev) => ({
      ...prev,
      Devise: currency,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      nom: user?.nom || "",
      prenom: user?.prenom || "",
      age: user?.age || "",
      pseudo: user?.pseudo || "",
      email: user?.email || "",
      MotDePasse: "",
      confirmPassword: "",
      couleur: user?.couleur || "",
      Devise: user?.Devise || "",
      Pays: user?.Pays || "",
      avatar: user?.avatar || "",
      photo: user?.photo || "",
    });
    setError("");
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validation
      if (
        !formData.nom.trim() ||
        !formData.prenom.trim() ||
        !formData.email.trim() ||
        !formData.pseudo.trim() ||
        !formData.age ||
        !formData.Pays.trim() ||
        !formData.couleur ||
        !formData.Devise
      ) {
        setError("Veuillez remplir tous les champs obligatoires");
        setLoading(false);
        return;
      }

      if (
        formData.MotDePasse &&
        formData.MotDePasse !== formData.confirmPassword
      ) {
        setError("Les mots de passe ne correspondent pas");
        setLoading(false);
        return;
      }

      const updatedUser = {
        ...user,
        nom: formData.nom,
        prenom: formData.prenom,
        age: formData.age,
        pseudo: formData.pseudo,
        email: formData.email,
        couleur: formData.couleur,
        Devise: formData.Devise,
        Pays: formData.Pays,
        avatar: formData.avatar || user?.avatar,
        photo: formData.photo || user?.photo,
        admin: user?.admin || false,
      };

      if (formData.MotDePasse) {
        updatedUser.MotDePasse = formData.MotDePasse;
      }

      console.log("Sending updated user to API:", updatedUser);

      const response = await axios.put(`${API}/${user.id}`, updatedUser);

      console.log("API Response:", response.data);

      // ✅ Dispatch action to update Redux state with all user data
      dispatch({
        type: "UPDATE_USER_PROFILE",
        payload: updatedUser,
      });

      // ✅ If color changed, also dispatch UPDATE_USER_COLOR for consistency
      if (formData.couleur !== user?.couleur) {
        dispatch({
          type: "UPDATE_USER_COLOR",
          payload: formData.couleur,
        });
        console.log("Color updated in Redux:", formData.couleur);
      }

      setSuccess("Profil mis à jour avec succès!");
      setIsEditing(false);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="header-title">
          <h2>Mon Profile</h2>
          {user?.admin && <Shield size={20} className="admin-icon" />}
        </div>
        {!isEditing && (
          <button className="btn-edit" onClick={handleEdit}>
            <Edit2 size={16} />
            Modifier
          </button>
        )}
      </div>

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

      <div className="profile-content">
        {/* Avatar Section */}
        <div className="profile-avatar-section">
          <div
            className="profile-avatar-large"
            style={{ backgroundColor: formData.couleur || user?.couleur }}>
            {formData.prenom?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="profile-basic-info">
            <h3>
              {formData.prenom} {formData.nom}
            </h3>
            <p className="pseudo">@{formData.pseudo}</p>
            {user?.admin && <span className="admin-label">Administrateur</span>}
          </div>
        </div>

        {/* Form Section */}
        <div className="profile-form-section">
          {isEditing ? (
            <form className="profile-form">
              {/* Basic Info */}
              <div className="form-section-title">
                Informations Personnelles
              </div>

              <div className="form-group">
                <label htmlFor="prenom">
                  <User size={14} /> Prénom *
                </label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="form-control"
                  placeholder="Votre prénom"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nom">
                  <User size={14} /> Nom *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="form-control"
                  placeholder="Votre nom"
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">
                  <Calendar size={14} /> Âge *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="form-control"
                  placeholder="Votre âge"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pseudo">Pseudo *</label>
                <input
                  type="text"
                  id="pseudo"
                  name="pseudo"
                  value={formData.pseudo}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="form-control"
                  placeholder="Votre pseudo"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="email">
                  <Mail size={14} /> Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="form-control"
                  placeholder="Votre email"
                />
              </div>

              {/* Location & Currency */}
              <div className="form-section-title">Localisation & Devise</div>

              <div className="form-group">
                <label htmlFor="Pays">
                  <MapPin size={14} /> Pays *
                </label>
                <input
                  type="text"
                  id="Pays"
                  name="Pays"
                  value={formData.Pays}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="form-control"
                  placeholder="Votre pays"
                />
              </div>

              <div className="form-group">
                <label>
                  <DollarSign size={14} /> Devise *
                </label>
                <div className="currency-select">
                  {currencies.map((currency) => (
                    <button
                      key={currency}
                      type="button"
                      className={`currency-btn ${
                        formData.Devise === currency ? "active" : ""
                      }`}
                      onClick={() => handleCurrencyChange(currency)}
                      disabled={loading}>
                      {currency}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="form-section-title">Couleur Préférée</div>

              <div className="form-group full-width">
                <label>
                  <Palette size={14} /> Couleur *
                </label>
                <div className="color-select">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`color-btn ${
                        formData.couleur === color.value ? "active" : ""
                      }`}
                      onClick={() => handleColorChange(color.value)}
                      disabled={loading}
                      title={color.name}>
                      <div
                        className="color-preview"
                        style={{ backgroundColor: color.value }}></div>
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Avatar & Photo */}
              <div className="form-section-title">Images de Profil</div>

              <div className="form-group">
                <label htmlFor="avatar">
                  <Image size={14} /> URL Avatar
                </label>
                <input
                  type="url"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="form-control"
                  placeholder="URL de l'avatar"
                />
                <small>Par défaut: image générée automatiquement</small>
              </div>

              <div className="form-group">
                <label htmlFor="photo">
                  <Image size={14} /> URL Photo de Profil
                </label>
                <input
                  type="url"
                  id="photo"
                  name="photo"
                  value={formData.photo}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="form-control"
                  placeholder="URL de la photo de profil"
                />
                <small>Par défaut: image générée automatiquement</small>
              </div>

              {/* Password Change */}
              <div className="form-section-title">Mot de Passe (Optionnel)</div>

              <div className="form-group">
                <label htmlFor="MotDePasse">
                  <Lock size={14} /> Nouveau Mot de Passe
                </label>
                <input
                  type="password"
                  id="MotDePasse"
                  name="MotDePasse"
                  value={formData.MotDePasse}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="form-control"
                  placeholder="Laisser vide pour ne pas changer"
                />
                <small>
                  Min 8 caractères avec majuscule, minuscule, chiffre et
                  caractère spécial
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <Lock size={14} /> Confirmer le Mot de Passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="form-control"
                  placeholder="Confirmer le mot de passe"
                />
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={loading}>
                  <Save size={16} />
                  {loading ? "Sauvegarde..." : "Enregistrer"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}>
                  <X size={16} />
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info-display">
              <div className="">
                <h4>Informations Personnelles</h4>
                <div className="info-row">
                  <div className="info-item">
                    <label>
                      <User size={14} /> Prénom
                    </label>
                    <span>{formData.prenom}</span>
                  </div>
                  <div className="info-item">
                    <label>
                      <User size={14} /> Nom
                    </label>
                    <span>{formData.nom}</span>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-item">
                    <label>
                      <Calendar size={14} /> Âge
                    </label>
                    <span>{formData.age}</span>
                  </div>
                  <div className="info-item">
                    <label>Pseudo</label>
                    <span>@{formData.pseudo}</span>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-item full">
                    <label>
                      <Mail size={14} /> Email
                    </label>
                    <span>{formData.email}</span>
                  </div>
                </div>
              </div>

              <div className="">
                <h4>Localisation & Devise</h4>
                <div className="info-row">
                  <div className="info-item">
                    <label>
                      <MapPin size={14} /> Pays
                    </label>
                    <span>{formData.Pays}</span>
                  </div>
                  <div className="info-item">
                    <label>
                      <DollarSign size={14} /> Devise
                    </label>
                    <span>{formData.Devise}</span>
                  </div>
                </div>
              </div>

              <div className="">
                <h4>
                  <Palette size={14} /> Couleur Préférée
                </h4>
                <div className="color-display">
                  <div
                    className="color-dot-large"
                    style={{ backgroundColor: formData.couleur }}></div>
                  <span>{formData.couleur}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
