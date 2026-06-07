import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
  setError(
    err.response?.data?.message ||
    "Login failed"
  );
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070A12] relative overflow-hidden">

      {/* COLOR GLOW BACKGROUND (GOD LAYER) */}
      <div className="absolute w-[600px] h-[600px] bg-blue-600 blur-[160px] opacity-20 rounded-full top-[-200px] left-[-200px]" />
      <div className="absolute w-[600px] h-[600px] bg-purple-600 blur-[180px] opacity-20 rounded-full bottom-[-200px] right-[-200px]" />

      {/* GRID DEPTH */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* MAIN WRAPPER */}
      <div className="flex items-center gap-20 z-10">

        {/* LEFT IMAGE PANEL */}
        <div className="hidden lg:block w-[440px] h-[520px] relative">

          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80"
            className="w-full h-full object-cover rounded-2xl shadow-2xl"
            alt="visual"
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl" />

          {/* TEXT */}
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-2xl font-semibold tracking-tight">
              IFtalk
            </h2>
            <p className="text-sm text-white/70 mt-1">
              Real-time communication reimagined.
            </p>
          </div>

        </div>

        {/* RIGHT LOGIN PANEL */}
        <div className="w-[380px]">

          {/* CARD */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-[0_0_60px_rgba(59,130,246,0.15)]">

            {/* BRAND */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white tracking-tight">
                IFtalk
              </h1>
              <p className="text-white/40 text-sm mt-2">
                Welcome back
              </p>
            </div>

            {/* EMAIL */}
            <div className="mb-5">
              <label className="text-xs text-white/40">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500 transition"
                placeholder="Enter email"
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-6">
              <label className="text-xs text-white/40">Password</label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500 transition"
                placeholder="Enter password"
              />
            </div>
            {error && (
  <div className="mb-4 text-red-400 text-sm">
    {error}
  </div>
)}
            {/* BUTTON */}
            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl text-white font-medium
              bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
              hover:scale-[1.02] active:scale-[0.98]
              transition-all shadow-lg shadow-blue-600/20"
            >
              Login to IFtalk
            </button>

            {/* SECOND ACTION */}
            <p
              onClick={() => navigate("/register")}
              className="text-center text-sm text-white/40 mt-6 cursor-pointer hover:text-white transition"
            >
              Create new account →
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}