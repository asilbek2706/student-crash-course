import React from "react";

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, onToggleDarkMode }) => {
  return (
    <header className="header container" style={{ marginBottom: "50px" }}>
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">🎓</span>

          <div>
            <h1>Student Manager</h1>
            <p>Talabalar boshqaruv tizimi</p>
          </div>
        </div>
      </div>

      <div className="header-right">
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleDarkMode}
          aria-label={darkMode ? "Yorug' rejim" : "Qorong'u rejim"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
};

export default Header;
