import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#05060a] overflow-hidden relative">

      {/* CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.25),transparent_60%)] animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.25),transparent_60%)] animate-pulse" />

      <div className="absolute w-[600px] h-[600px] bg-purple-600 blur-[160px] opacity-20 rounded-full top-[-200px] left-[-200px]" />
      <div className="absolute w-[600px] h-[600px] bg-blue-600 blur-[160px] opacity-20 rounded-full bottom-[-200px] right-[-200px]" />

      {/* CARD */}
      <div className="w-[420px] z-10 p-8 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl animate-[fadeIn_0.8s_ease]">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Join IFtalk</h1>
          <p className="text-white/50 text-sm mt-2">
            Start your real-time messaging journey
          </p>
        </div>

        {/* USERNAME */}
        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 bg-white/5 text-white rounded-xl border border-white/10 outline-none focus:border-purple-500"
        />

        {/* EMAIL */}
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 bg-white/5 text-white rounded-xl border border-white/10 outline-none focus:border-purple-500"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 bg-white/5 text-white rounded-xl border border-white/10 outline-none focus:border-purple-500"
        />

        {/* BUTTON */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3 rounded-xl font-medium text-white
          bg-gradient-to-r from-purple-600 to-blue-600
          hover:scale-[1.03] active:scale-[0.97]
          transition-all duration-300 shadow-lg shadow-purple-600/20"
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-center text-sm text-white/50 mt-6 cursor-pointer hover:text-white"
        >
          Already have an account?
        </p>
      </div>

      {/* ANIMATION */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}