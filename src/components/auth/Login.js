import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginFail, loginSuccess } from "../../redux/auth/authActions";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

function Login() {
  const API = "https://6935e745fa8e704dafbf386c.mockapi.io/users";
  const dispatch = useDispatch();
  const { loginAttempts, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [step, setStep] = useState(1);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [forgotPasswordData, setForgotPasswordData] = useState({
    identifier: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loginInfo, setLoginInfo] = useState({
    identifier: "",
    motDePasse: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");

  const colors = [
    { name: "Bleu", value: "#1d9bf0" },
    { name: "Jaune", value: "#ffd700" },
    { name: "Rose", value: "#f42151" },
    { name: "purple", value: "#9c27b0" },
    { name: "Vert", value: "#17bf63" },
    { name: "Orange", value: "#ff6b35" },
  ];

  const currencies = ["USD", "DH", "EUR", "GBP", "JPY", "CAD"];

  const navigate = useNavigate();

  const handleNextStep = (e) => {
    e.preventDefault();
    if (loginInfo.identifier.trim()) {
      setStep(2);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(API);
      const user = res.data.find(
        (user) =>
          (user.pseudo === loginInfo.identifier ||
            user.email === loginInfo.identifier) &&
          user.MotDePasse === loginInfo.motDePasse,
      );
      if (user) {
        dispatch(loginSuccess(user));
        navigate("/home");
      } else {
        dispatch(loginFail("Pseudo ou mot de passe incorrect"));
      }
    } catch (err) {
      dispatch(loginFail("Erreur serveur"));
    }
  };

  const handleBackButton = () => {
    setStep(1);
    setShowPassword(false);
    setLoginInfo({ ...loginInfo, motDePasse: "" });
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setIsForgotPassword(true);
    setForgotPasswordStep(1);
    setValidationErrors({});
  };

  const handleForgotPasswordStep1 = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      const res = await axios.get(API);
      const user = res.data.find(
        (user) =>
          user.pseudo === forgotPasswordData.identifier ||
          user.email === forgotPasswordData.identifier,
      );

      if (user) {
        setSelectedUser(user);
        setForgotPasswordStep(2);
      } else {
        setValidationErrors({
          identifier: "Nom d'utilisateur ou email non trouvé",
        });
      }
    } catch (err) {
      setValidationErrors({ identifier: "Erreur serveur" });
    }
  };

  const handleForgotPasswordStep2 = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    if (forgotPasswordData.email !== selectedUser.email) {
      setValidationErrors({
        email: "L'adresse email ne correspond pas à votre compte",
      });
      return;
    }

    setForgotPasswordStep(3);
  };

  const handleForgotPasswordStep3 = (e) => {
    e.preventDefault();
    setValidationErrors({});

    const selectedColorObj = colors.find((c) => c.value === selectedColor);

    if (!selectedColor || !selectedCurrency) {
      setValidationErrors({
        selection: "Veuillez sélectionner votre couleur et votre devise",
      });
      return;
    }

    if (selectedColorObj?.name !== selectedUser.couleur) {
      setValidationErrors({
        color: "La couleur sélectionnée est incorrecte",
      });
      return;
    }

    if (selectedCurrency !== selectedUser.Devise) {
      setValidationErrors({
        currency: "La devise sélectionnée est incorrecte",
      });
      return;
    }

    setForgotPasswordStep(4);
  };

  const handleForgotPasswordStep4 = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    if (!passwordRegex.test(forgotPasswordData.newPassword)) {
      setValidationErrors({
        newPassword:
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)",
      });
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setValidationErrors({
        confirmPassword: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    try {
      const updatedUser = {
        ...selectedUser,
        MotDePasse: forgotPasswordData.newPassword,
      };

      await axios.put(`${API}/${selectedUser.id}`, updatedUser);

      setIsForgotPassword(false);
      setForgotPasswordStep(1);
      setForgotPasswordData({
        identifier: "",
        email: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSelectedUser(null);
      setStep(1);
      setLoginInfo({ identifier: "", motDePasse: "" });
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      dispatch(
        loginFail(
          "Mot de passe réinitialisé avec succès. Veuillez vous connecter.",
        ),
      );
    } catch (err) {
      setValidationErrors({
        submit: "Erreur lors de la mise à jour du mot de passe",
      });
    }
  };

  const handleBackForgotPassword = () => {
    if (forgotPasswordStep > 1) {
      setForgotPasswordStep(forgotPasswordStep - 1);
      setValidationErrors({});
      if (forgotPasswordStep === 3) {
        setSelectedColor("");
        setSelectedCurrency("");
      }
      if (forgotPasswordStep === 4) {
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      }
    } else {
      setIsForgotPassword(false);
      setForgotPasswordData({
        identifier: "",
        email: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSelectedUser(null);
      setSelectedColor("");
      setSelectedCurrency("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  };

  if (!isForgotPassword) {
    return (
      <div className="login-container">
        <div className="login-wrapper">
          {step === 1 && (
            <div className="login-content">
              <h2 className="login-title">Connectez-vous à HAAS</h2>

              <form onSubmit={handleNextStep}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control login-input"
                    placeholder="Adresse email ou nom d'utilisateur"
                    value={loginInfo.identifier}
                    onChange={(e) =>
                      setLoginInfo({ ...loginInfo, identifier: e.target.value })
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-dark btn-block login-btn w-100">
                  Suivant
                </button>
              </form>

              <div className="login-footer">
                <span className="no-account">Vous n'avez pas de compte ? </span>
                <a href="/signup" className="signup-link">
                  Inscrivez-vous
                </a>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="login-content">
              <button
                type="button"
                className="btn-back"
                onClick={handleBackButton}
                aria-label="Go back">
                ←
              </button>

              <h2 className="login-title">Entrez votre mot de passe</h2>

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control login-input"
                    placeholder="Nom d'utilisateur"
                    value={loginInfo.identifier}
                    disabled
                  />
                </div>

                <div className="mb-3 password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control login-input"
                    placeholder="Mot de passe"
                    value={loginInfo.motDePasse}
                    onChange={(e) =>
                      setLoginInfo({ ...loginInfo, motDePasse: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }>
                    <i
                      className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>

                <a
                  onClick={handleForgotPassword}
                  href="#"
                  className="forgot-password">
                  Mot de passe oublié ?
                </a>

                <button
                  type="submit"
                  className="btn btn-dark btn-block login-btn w-100 mt-4"
                  disabled={loginAttempts >= 3}>
                  Se connecter
                </button>

                {error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {error}
                  </div>
                )}
              </form>

              <div className="login-footer">
                <span className="no-account">Vous n'avez pas de compte ? </span>
                <a href="/signup" className="signup-link">
                  Inscrivez-vous
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {forgotPasswordStep >= 2 && (
          <button
            type="button"
            className="btn-back"
            onClick={handleBackForgotPassword}
            aria-label="Go back">
            ←
          </button>
        )}

        {forgotPasswordStep === 1 && (
          <div className="login-content">
            <h2 className="login-title">Recherchez votre compte X</h2>
            <p className="forgot-description">
              Entrez l'adresse email, le numéro de téléphone ou le nom
              d'utilisateur associé à votre compte pour modifier votre mot de
              passe.
            </p>

            <form onSubmit={handleForgotPasswordStep1}>
              <div className="mb-3">
                <input
                  type="text"
                  className={`form-control login-input ${
                    validationErrors.identifier ? "input-error" : ""
                  }`}
                  placeholder="Adresse email, numéro de téléphone ou nom d'utilisateur"
                  value={forgotPasswordData.identifier}
                  onChange={(e) =>
                    setForgotPasswordData({
                      ...forgotPasswordData,
                      identifier: e.target.value,
                    })
                  }
                  required
                />
                {validationErrors.identifier && (
                  <small className="text-danger">
                    {validationErrors.identifier}
                  </small>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-dark btn-block login-btn w-100">
                Suivant
              </button>
            </form>

            <div className="login-footer">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsForgotPassword(false);
                }}
                className="signup-link">
                Retour à la connexion
              </a>
            </div>
          </div>
        )}

        {forgotPasswordStep === 2 && (
          <div className="login-content">
            <h2 className="login-title">Confirmez votre adresse email</h2>
            <p className="forgot-description">
              Vérifiez votre identité en entrant l'adresse email associée à
              votre compte X.
            </p>

            <form onSubmit={handleForgotPasswordStep2}>
              <div className="mb-3">
                <input
                  type="email"
                  className={`form-control login-input login-input-focus ${
                    validationErrors.email ? "input-error" : ""
                  }`}
                  placeholder="Adresse email"
                  value={forgotPasswordData.email}
                  onChange={(e) =>
                    setForgotPasswordData({
                      ...forgotPasswordData,
                      email: e.target.value,
                    })
                  }
                  required
                />
                {validationErrors.email && (
                  <small className="text-danger">
                    {validationErrors.email}
                  </small>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-dark btn-block login-btn w-100">
                Suivant
              </button>
            </form>
          </div>
        )}

        {forgotPasswordStep === 3 && selectedUser && (
          <div className="login-content">
            <h2 className="login-title">Confirmez votre identité</h2>
            <p className="forgot-description">
              Sélectionnez la couleur et la devise que vous avez choisies lors
              de votre inscription.
            </p>

            <form onSubmit={handleForgotPasswordStep3}>
              <div className="selection-group">
                <label className="selection-label">Couleur préférée</label>
                <div className="color-grid">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`color-option ${
                        selectedColor === color.value ? "selected" : ""
                      }`}
                      onClick={() => setSelectedColor(color.value)}
                      title={color.name}
                      aria-label={`Select color ${color.name}`}
                      aria-pressed={selectedColor === color.value}>
                      <span
                        className="color-circle"
                        style={{ backgroundColor: color.value }}></span>
                      <span className="color-name">{color.name}</span>
                    </button>
                  ))}
                </div>
                {validationErrors.color && (
                  <small className="text-danger d-block mt-2">
                    {validationErrors.color}
                  </small>
                )}
              </div>

              <div className="selection-group mt-4">
                <label className="selection-label">Devise</label>
                <div className="currency-grid">
                  {currencies.map((currency) => (
                    <button
                      key={currency}
                      type="button"
                      className={`currency-option ${
                        selectedCurrency === currency ? "selected" : ""
                      }`}
                      onClick={() => setSelectedCurrency(currency)}
                      aria-label={`Select currency ${currency}`}
                      aria-pressed={selectedCurrency === currency}>
                      {currency}
                    </button>
                  ))}
                </div>
                {validationErrors.currency && (
                  <small className="text-danger d-block mt-2">
                    {validationErrors.currency}
                  </small>
                )}
              </div>

              {validationErrors.selection && (
                <div className="alert alert-danger mt-3" role="alert">
                  {validationErrors.selection}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-dark btn-block login-btn w-100">
                Confirmer
              </button>
            </form>
          </div>
        )}

        {forgotPasswordStep === 4 && (
          <div className="login-content">
            <h2 className="login-title">Créez un nouveau mot de passe</h2>
            <p className="forgot-description">
              Entrez un nouveau mot de passe pour votre compte.
            </p>

            <form onSubmit={handleForgotPasswordStep4}>
              <div className="mb-3 password-field">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className={`form-control login-input ${
                    validationErrors.newPassword ? "input-error" : ""
                  }`}
                  placeholder="Nouveau mot de passe"
                  value={forgotPasswordData.newPassword}
                  onChange={(e) =>
                    setForgotPasswordData({
                      ...forgotPasswordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }>
                  <i
                    className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
                {validationErrors.newPassword && (
                  <small className="text-danger">
                    {validationErrors.newPassword}
                  </small>
                )}
              </div>

              <div className="mb-3 password-field">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-control login-input ${
                    validationErrors.confirmPassword ? "input-error" : ""
                  }`}
                  placeholder="Confirmez le mot de passe"
                  value={forgotPasswordData.confirmPassword}
                  onChange={(e) =>
                    setForgotPasswordData({
                      ...forgotPasswordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }>
                  <i
                    className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
                {validationErrors.confirmPassword && (
                  <small className="text-danger">
                    {validationErrors.confirmPassword}
                  </small>
                )}
              </div>

              {validationErrors.submit && (
                <div className="alert alert-danger" role="alert">
                  {validationErrors.submit}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-dark btn-block login-btn w-100">
                Changer le mot de passe
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
