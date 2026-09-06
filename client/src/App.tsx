import { useState } from "react";

import Dashboard from "./components/Dashboard";
import Login from "./pages/Login";

const App = () => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const handleLogin = (newToken: string) => {
    localStorage.setItem("token", newToken);

    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    setToken(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard token={token} onLogout={handleLogout} />;
};

export default App;
