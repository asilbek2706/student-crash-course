import { useState } from "react";
import Swal from "sweetalert2";

interface LoginProps {
  onLogin: (token: string) => void;
}

const API_URL = import.meta.env.VITE_API_URL;

const Login = ({ onLogin }: LoginProps) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      await Swal.fire({
        title: "Parol kiriting!",
        text: "Tizimga kirish uchun parolni kiriting.",
        icon: "warning",
        confirmButtonText: "Tushunarli",
        confirmButtonColor: "#4f46e5",
      });

      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Parol noto'g'ri");
      }

      localStorage.setItem("token", data.token);

      onLogin(data.token);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Tizimga kirishda xatolik yuz berdi";

      await Swal.fire({
        title: "Kirish rad etildi!",
        text: message,
        icon: "error",
        confirmButtonText: "Qayta urinish",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">🎓</div>

        <h1>Student Manager</h1>
        <p>Tizimga kirish uchun parolni kiriting</p>

        <form onSubmit={handleSubmit}>
          <div className="login-input-group">
            <label htmlFor="password">Parol</label>

            <input
              id="password"
              type="password"
              placeholder="Parolingizni kiriting"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Tekshirilmoqda..." : "Kirish"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
