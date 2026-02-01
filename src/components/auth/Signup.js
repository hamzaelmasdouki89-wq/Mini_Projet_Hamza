import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css";

const API = "https://6935e745fa8e704dafbf386c.mockapi.io/users";

function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState([]);

  const colors = [
    { name: "Bleu", value: "#1d9bf0" },
    { name: "Jaune", value: "#ffd700" },
    { name: "Rose", value: "#f42151" },
    { name: "Violet", value: "#9c27b0" },
    { name: "Vert", value: "#17bf63" },
    { name: "Orange", value: "#ff6b35" },
  ];

  const currencies = ["USD", "DH", "EUR", "GBP", "JPY", "CAD"];

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    age: "",
    pseudo: "",
    email: "",
    MotDePasse: "",
    confirmPassword: "",
    couleur: "",
    Devise: "",
    Pays: "",
    avatar: "",
    photo: "",
    admin: false,
  });

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const validateStep1 = () => {
    const stepErrors = [];

    if (!form.nom.trim()) {
      stepErrors.push("Le nom est requis");
    }
    if (!form.prenom.trim()) {
      stepErrors.push("Le prénom est requis");
    }
    if (!form.age || form.age < 13 || form.age > 120) {
      stepErrors.push("L'âge doit être entre 13 et 120");
    }
    if (!form.pseudo.trim()) {
      stepErrors.push("Le pseudo est requis");
    }

    return stepErrors;
  };

  const validateStep2 = () => {
    const stepErrors = [];

    if (!form.email.trim()) {
      stepErrors.push("L'email est requis");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      stepErrors.push("L'email n'est pas valide");
    }

    if (!form.MotDePasse) {
      stepErrors.push("Le mot de passe est requis");
    } else if (!passwordRegex.test(form.MotDePasse)) {
      stepErrors.push(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial",
      );
    }

    if (!form.confirmPassword) {
      stepErrors.push("La confirmation du mot de passe est requise");
    } else if (form.MotDePasse !== form.confirmPassword) {
      stepErrors.push("Les mots de passe ne correspondent pas");
    }

    return stepErrors;
  };

  const validateStep3 = () => {
    const stepErrors = [];

    if (!form.couleur) {
      stepErrors.push("Veuillez sélectionner une couleur");
    }
    if (!form.Devise) {
      stepErrors.push("Veuillez sélectionner une devise");
    }

    return stepErrors;
  };

  const validateStep4 = () => {
    const stepErrors = [];

    if (!form.Pays.trim()) {
      stepErrors.push("Le pays est requis");
    }

    return stepErrors;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setErrors([]);

    let stepErrors = [];

    if (step === 1) {
      stepErrors = validateStep1();
    } else if (step === 2) {
      stepErrors = validateStep2();
    } else if (step === 3) {
      stepErrors = validateStep3();
    } else if (step === 4) {
      stepErrors = validateStep4();
    }

    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }

    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit(e);
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      const newUser = { ...form };
      delete newUser.confirmPassword;

      if (!newUser.avatar || newUser.avatar.trim() === "") {
        newUser.avatar =
          "https://api.dicebear.com/7.x/avataaars/svg?seed=" + newUser.pseudo;
      }
      if (!newUser.photo || newUser.photo.trim() === "") {
        newUser.photo =
          "https://api.dicebear.com/7.x/pixel-art/svg?seed=" + newUser.pseudo;
      }

      newUser.admin = false;

      await axios.post(API, newUser);

      alert("Compte créé avec succès!");
      navigate("/login");
    } catch (err) {
      setErrors(["Erreur serveur lors de la création du compte"]);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        {step === 1 && (
          <div className="signup-content">
            <h2 className="signup-title">Créez votre compte HAAS</h2>
            <p className="signup-description">
              Étape 1 sur 4 - Informations personnelles
            </p>

            <form onSubmit={handleNextStep}>
              <div className="mb-3">
                <input
                  type="text"
                  name="nom"
                  className={`form-control signup-input ${
                    errors.some((e) => e.includes("nom")) ? "input-error" : ""
                  }`}
                  placeholder="Nom"
                  value={form.nom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  name="prenom"
                  className={`form-control signup-input ${
                    errors.some((e) => e.includes("prénom"))
                      ? "input-error"
                      : ""
                  }`}
                  placeholder="Prénom"
                  value={form.prenom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  name="age"
                  className={`form-control signup-input ${
                    errors.some((e) => e.includes("âge")) ? "input-error" : ""
                  }`}
                  placeholder="Âge"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  name="pseudo"
                  className={`form-control signup-input ${
                    errors.some((e) => e.includes("pseudo"))
                      ? "input-error"
                      : ""
                  }`}
                  placeholder="Nom d'utilisateur"
                  value={form.pseudo}
                  onChange={handleChange}
                  required
                />
              </div>

              {errors.length > 0 && (
                <div className="alert alert-danger mt-3" role="alert">
                  <ul className="mb-0">
                    {errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-dark btn-block signup-btn w-100">
                Suivant
              </button>
            </form>

            <div className="signup-footer">
              <span className="have-account">Vous avez un compte ? </span>
              <a href="/login" className="login-link">
                Connectez-vous
              </a>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="signup-content">
            <button type="button" className="btn-back" onClick={handleBackStep}>
              ←
            </button>

            <h2 className="signup-title">Sécurisez votre compte</h2>
            <p className="signup-description">
              Étape 2 sur 4 - Email et mot de passe
            </p>

            <form onSubmit={handleNextStep}>
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className={`form-control signup-input ${
                    errors.some((e) => e.includes("email")) ? "input-error" : ""
                  }`}
                  placeholder="Adresse email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  name="MotDePasse"
                  className={`form-control signup-input ${
                    errors.some((e) => e.includes("mot de passe"))
                      ? "input-error"
                      : ""
                  }`}
                  placeholder="Mot de passe"
                  value={form.MotDePasse}
                  onChange={handleChange}
                  required
                />
                <small className="text-muted d-block mt-2">
                  Au moins 8 caractères, une majuscule, une minuscule, un
                  chiffre et un caractère spécial
                </small>
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  name="confirmPassword"
                  className={`form-control signup-input ${
                    errors.some((e) => e.includes("ne correspondent pas"))
                      ? "input-error"
                      : ""
                  }`}
                  placeholder="Confirmez le mot de passe"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {errors.length > 0 && (
                <div className="alert alert-danger mt-3" role="alert">
                  <ul className="mb-0">
                    {errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-dark btn-block signup-btn w-100">
                Suivant
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="signup-content">
            <button type="button" className="btn-back" onClick={handleBackStep}>
              ←
            </button>

            <h2 className="signup-title">Vos préférences</h2>
            <p className="signup-description">
              Étape 3 sur 4 - Couleur et devise
            </p>

            <form onSubmit={handleNextStep}>
              <div className="selection-group">
                <label className="selection-label">Couleur préférée</label>
                <div className="color-grid">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`color-option ${
                        form.couleur === color.value ? "selected" : ""
                      }`}
                      onClick={() => setForm({ ...form, couleur: color.value })}
                      title={color.name}>
                      <span
                        className="color-circle"
                        style={{ backgroundColor: color.value }}></span>
                      <span className="color-name">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="selection-group mt-4">
                <label className="selection-label">Devise</label>
                <div className="currency-grid">
                  {currencies.map((currency) => (
                    <button
                      key={currency}
                      type="button"
                      className={`currency-option ${
                        form.Devise === currency ? "selected" : ""
                      }`}
                      onClick={() => setForm({ ...form, Devise: currency })}>
                      {currency}
                    </button>
                  ))}
                </div>
              </div>

              {errors.length > 0 && (
                <div className="alert alert-danger mt-3" role="alert">
                  <ul className="mb-0">
                    {errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-dark btn-block signup-btn w-100">
                Suivant
              </button>
            </form>
          </div>
        )}

        {step === 4 && (
          <div className="signup-content">
            <button type="button" className="btn-back" onClick={handleBackStep}>
              ←
            </button>

            <h2 className="signup-title">Complétez votre profil</h2>
            <p className="signup-description">
              Étape 4 sur 4 - Avatar et localisation
            </p>

            <form onSubmit={handleNextStep}>
              <div className="mb-3">
                <input
                  type="text"
                  name="Pays"
                  className={`form-control signup-input ${
                    errors.some((e) => e.includes("pays")) ? "input-error" : ""
                  }`}
                  placeholder="Pays"
                  value={form.Pays}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="url"
                  name="avatar"
                  className="form-control signup-input"
                  placeholder="URL de l'avatar (optionnel)"
                  value={form.avatar}
                  onChange={handleChange}
                />
                <small className="text-muted d-block mt-2">
                  Si vous ne fournissez pas d'URL, un avatar par défaut sera
                  généré
                </small>
                {form.avatar && (
                  <div className="avatar-preview mt-2">
                    <img src={form.avatar} alt="Avatar preview" />
                  </div>
                )}
              </div>

              <div className="mb-3">
                <input
                  type="url"
                  name="photo"
                  className="form-control signup-input"
                  placeholder="URL de la photo de profil (optionnel)"
                  value={form.photo}
                  onChange={handleChange}
                />
                <small className="text-muted d-block mt-2">
                  Si vous ne fournissez pas d'URL, une photo par défaut sera
                  générée
                </small>
                {form.photo && (
                  <div className="avatar-preview mt-2">
                    <img src={form.photo} alt="Photo preview" />
                  </div>
                )}
              </div>

              {errors.length > 0 && (
                <div className="alert alert-danger mt-3" role="alert">
                  <ul className="mb-0">
                    {errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-dark btn-block signup-btn w-100">
                Créer le compte
              </button>
            </form>

            <div className="signup-footer">
              <span className="have-account">Vous avez un compte ? </span>
              <a href="/login" className="login-link">
                Connectez-vous
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;
