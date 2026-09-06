import { useEffect, useState } from "react";

import StudentManager from "./StudentManager";
import Header from "./Header";

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

const Dashboard = ({ token, onLogout }: DashboardProps) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);

    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  return (
    <div className="app">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onLogout={onLogout}
      />

      <main className="main-content">
        <StudentManager token={token} onLogout={onLogout} />
      </main>
    </div>
  );
};

export default Dashboard;
