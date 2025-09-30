import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AlertModal from "../component/AlertModal";
import { useAuth } from "../auth/AuthContext";
export default function Login() {
  const API = process.env.REACT_APP_API_URL;
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertCfg, setAlertCfg] = useState({
    title: "",
    message: "",
    mode: "info",
    confirmText: "OK",
    onConfirm: () => setAlertOpen(false),
  });

  function showAlert(title, message) {
    setAlertCfg({
      title,
      message,
      mode: "error",
      confirmText: "OK",
      onConfirm: () => setAlertOpen(false),
    });
    setAlertOpen(true);
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.token) {
        showAlert("Login failed", data.message || "Invalid credentials");
        return;
      }
      console.log(data.token);

      localStorage.setItem("token", data.token);
      login(data.token);
      navigate(from, { replace: true });
    } catch (err) {
      showAlert("Error", err.message);
    }
  }

  return (
    <div className="">
      <div className="container mx-auto h-[100vh] grid items-center">
        <div className="flex">
          <div className="w-1/2 text-white grid align-items-center">
            <div>
              <div>
                <img className="w-[250px]" src="images/logo-test.png" alt="" />
              </div>
              <div className="text-6xl font-semibold">Hello,</div>
              <div className="text-4xl font-semibold">
                Welcome to KPI Management System
              </div>
            </div>
            <div>
              Please sign in to begin tracking your performance, reviewing your
              goals, and gaining valuable insights into your progress and
              achievements.
            </div>
          </div>

          <div className="w-1/2">
            <div className="bg-white rounded-[40px] h-[60vh] px-[15%] flex items-center">
              <form onSubmit={handleLogin} className="w-full">
                <div className="text-center text-4xl font-semibold mb-5">
                  Sign in
                </div>

                <label className="block mb-5">
                  <span className="block pb-2">Username</span>
                  <input
                    className="w-full border p-2 rounded"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                  />
                </label>

                <label className="block mb-5">
                  <span className="block pb-2">Password</span>
                  <input
                    className="w-full border p-2 rounded"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                  />
                </label>

                <div className="text-end mb-5">
                  <div className="text-maroon text-base">Forgot password ?</div>
                </div>

                <button type="submit" className="btn btn-submit-login w-full">
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <AlertModal
        open={alertOpen}
        title={alertCfg.title}
        message={alertCfg.message}
        mode={alertCfg.mode}
        confirmText={alertCfg.confirmText}
        onConfirm={alertCfg.onConfirm}
        onCancel={() => setAlertOpen(false)}
      />
    </div>
  );
}
