import { useDispatch } from "react-redux";
import { setLanguage } from "./languageSlice";
import { useTranslation } from "./UseTranslation";

const LanguageSwitcher = () => {
  const dispatch = useDispatch();
  const { currentLanguage, availableLanguages } = useTranslation();

  const languageNames = {
    en: "English",
    fr: "Français",
    de: "Deutsch",
  };

  const handleLanguageChange = (lang) => {
    dispatch(setLanguage(lang));
  };

  return (
    <div className="language-switcher">
      <div className="language-switcher-label">
        <span className="globe-icon">🌐</span>
        {languageNames[currentLanguage]}
      </div>
      <div className="language-switcher-menu">
        {availableLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`language-option ${lang === currentLanguage ? "active" : ""}`}
            title={languageNames[lang]}>
            <span className="flag">
              {lang === "en" && "🇬🇧"}
              {lang === "fr" && "🇫🇷"}
              {lang === "de" && "🇩🇪"}
            </span>
            {languageNames[lang]}
          </button>
        ))}
      </div>

      <style jsx>{`
        .language-switcher {
          position: relative;
          display: inline-block;
        }

        .language-switcher-label {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .language-switcher-label:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .globe-icon {
          font-size: 16px;
        }

        .language-switcher-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          overflow: hidden;
          min-width: 140px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .language-switcher:hover .language-switcher-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .language-option {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 10px 16px;
          border: none;
          background: transparent;
          color: #333;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .language-option:hover {
          background-color: #f0f0f0;
        }

        .language-option.active {
          background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
          color: #667eea;
          font-weight: 600;
        }

        .flag {
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;
