import { useEffect, useState } from "react";
import api from "../services/api";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ setActiveChat, activeChat, user, onlineUsers }) {
  const [conversations, setConversations] = useState([]);

  const navigate = useNavigate();
const [search, setSearch] = useState("");
const [searchResults, setSearchResults] = useState([]);
const [showGalaxy, setShowGalaxy] = useState(false);  
useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/conversations");
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchConversations();
  }, []);

useEffect(() => {
  socket.on("userLastSeenUpdate", (data) => {
    setConversations((prev) =>
      prev.map((c) => {
        const updatedParticipants = c.participants.map((p) =>
          p._id === data.userId
            ? { ...p, lastSeen: data.lastSeen }
            : p
        );

        return {
          ...c,
          participants: updatedParticipants,
        };
      })
    );
  });

  return () => socket.off("userLastSeenUpdate");
}, []);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
const searchUsers = async (value) => {
  setSearch(value);

  if (!value.trim()) {
    setSearchResults([]);
    return;
  }

  try {
    const res = await api.get(
      `/users/search?username=${value}`
    );

    setSearchResults(res.data);
  } catch (err) {
    console.log(err);
  }
};
const startConversation = async (targetUserId) => {
  try {
    const res = await api.post("/conversations", {
      userId: targetUserId,
    });

    const newConversation = res.data;

    const updated = await api.get("/conversations");

    setConversations(updated.data);

    const active = updated.data.find(
      (c) => c._id === newConversation._id
    );

    if (active) {
      setActiveChat(active);
    }

    setSearch("");
    setSearchResults([]);
  } catch (err) {
    console.log(err);
  }
};
  return (
    <div className=" w-full md:w-80  flex flex-col bg-[#0b0b10] text-white border-r border-white/10">

      {/* HEADER */}
      <div className="p-5 border-b border-white/10 bg-white/5 backdrop-blur-xl">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold tracking-wider">
    <span className="text-white">IF</span>
    <span className="text-indigo-400 animate-logoGlow">
      talk
    </span>
  </h1>
   <div className="h-[2px] bg-indigo-500 animate-logoLine mt-1 rounded-full" />

            <p className="text-xs text-white/40">
              Conversations that feel alive
            </p>
          </div>

          <button
            onClick={logout}
            className="px-3 py-1 text-xs rounded-lg border border-rose-400/20 bg-rose-500/10 hover:bg-rose-500/20 transition-all duration-300 hover:scale-105"
          >
            Logout
          </button>

        </div>
      </div>

      {/* SEARCH */}
      {/* SEARCH + GALAXY */}
<div className="p-4">

  <div className="flex gap-2">

    <input
      value={search}
      onChange={(e) => searchUsers(e.target.value)}
      placeholder="Search users..."
      className="
        flex-1
        px-4 py-2
        text-sm
        rounded-xl
        bg-white/5
        border border-white/10
        text-white
        outline-none
        focus:border-amber-400/50
      "
    />

    <button
      onClick={() => setShowGalaxy(!showGalaxy)}
      className="
        px-4
        rounded-xl
        bg-indigo-500/10
        border border-indigo-500/20
        hover:bg-indigo-500/20
        transition
      "
    >
      🪐
    </button>

  </div>

  {searchResults.length > 0 && (
    <div className="mt-2 bg-white/5 rounded-xl overflow-hidden border border-white/10">

      {searchResults.map((u) => (
        <div
          key={u._id}
          onClick={() => startConversation(u._id)}
          className="px-4 py-3 cursor-pointer hover:bg-white/10 transition"
        >
          <div className="text-sm text-white">
            {u.username}
          </div>

          <div className="text-xs text-white/40">
            {u.email}
          </div>
        </div>
      ))}

    </div>
  )}

</div>
<div className="px-4 pb-2 text-xs uppercase tracking-widest text-white/40">
  💬 Chats
</div>

      {/* LIST */}
      {/* LIST */}

{showGalaxy ? (

  <div className="relative flex-1 overflow-hidden bg-[#050816]">

  {/* STARS */}
  {Array.from({ length: 80 }).map((_, i) => (
    <span
      key={i}
      className="absolute animate-star-float"
      style={{
        width: "2px",
        height: "2px",
        background: "white",
        borderRadius: "999px",
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${8 + Math.random() * 10}s`,
      }}
    />
  ))}

  {/* PLANETS */}
  {conversations.map((c, i) => {
    const otherUser = c.participants.find(
      (p) => String(p._id) !== String(user._id)
    );

    const isOnline = onlineUsers.includes(otherUser?._id);

    return (
      <div
        key={c._id}
        onClick={() => {
          setActiveChat(c);
          setShowGalaxy(false);
        }}
        className="absolute cursor-pointer group"
        style={{
          top: `${15 + (i % 5) * 15}%`,
          left: `${10 + (i * 18) % 80}%`,
        }}
      >
        {/* ORBIT RING */}
        <div className="absolute inset-0 w-20 h-20 -left-2 -top-2 border border-white/10 rounded-full animate-spin-slow" />

        {/* PLANET */}
        <div
          className={`
            relative w-16 h-16 rounded-full
            flex items-center justify-center
            transition-all duration-300
            hover:scale-110
            ${
              isOnline
                ? "shadow-[0_0_30px_rgba(34,197,94,0.8)]"
                : "shadow-[0_0_25px_rgba(99,102,241,0.5)]"
            }
          `}
        >
          <img
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${otherUser?.username}`}
            className="w-14 h-14 rounded-full"
            alt=""
          />
        </div>

        <p className="text-xs text-center mt-2 text-white/70">
          {otherUser?.username}
        </p>
      </div>
    );
  })}
</div>

) : (
      <div className="flex-1 overflow-y-auto px-2 space-y-2">

        {conversations.map((c, i) => {
          const myId = user?._id;

          const otherUser = c.participants.find(
            (p) => String(p._id) !== String(myId)
          );

          const isOnline = onlineUsers.includes(otherUser?._id);
          const isMine = String(c.lastMessageSender) === String(myId);
          const isActive = activeChat?._id === c._id;

          // random avatar from internet (stable per user)
          const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${otherUser?.username}`;

          return (
            <div
              key={c._id}
              onClick={() => setActiveChat(c)}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`relative cursor-pointer rounded-xl p-3
transition-all duration-300
hover:bg-white/5
hover:translate-x-1
${
  isActive
    ? "bg-white/10 border border-indigo-500/20"
    : ""
}`}
            >

              {/* soft aura */}
              {isActive && (
                <div className="absolute inset-0 bg-amber-400/10 blur-2xl rounded-xl animate-pulse" />
              )}

              <div className="relative flex items-center gap-3">

                {/* AVATAR (REMOTE IMAGE) */}
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/10 shadow-lg transition-transform duration-300 group-hover:scale-110">

                  <img
                    src={avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />

                  {/* ONLINE DOT */}
                  {isOnline && (
                    <div className="absolute bottom-0 right-0">
  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
  <span className="relative block w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0b0b10]" />
</div>
                  )}
                </div>

                {/* TEXT */}
                <div className="flex-1 min-w-0">

                  <div className="flex justify-between items-center">
                    <div>
  <h3 className="text-sm font-medium text-white/90 truncate">
    {otherUser?.username || "Unknown"}
  </h3>

  <p className="text-[10px] text-emerald-400">
    {isOnline ? "Online" : "Offline"}
  </p>
</div>
                  </div>

                  <p className="text-xs text-white/40 truncate mt-0.5">
                    {c.lastMessage
                      ? isMine
                        ? `You: ${c.lastMessage}`
                        : c.lastMessage
                      : "No messages yet..."}
                  </p>

                </div>

              </div>
            </div>
          );
        })}
        
      </div>
)}
      {/* ANIMATION KEYFRAMES */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
            @keyframes starFloat {
  0% {
    transform: translateY(0px);
    opacity: 0.3;
  }

  50% {
    transform: translateY(-10px);
    opacity: 1;
  }

  100% {
    transform: translateY(0px);
    opacity: 0.3;
  }
}

.animate-star-float {
  animation: starFloat ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin 12s linear infinite;
}
  @keyframes logoLine {
  0% {
    width: 0%;
  }

  50% {
    width: 100%;
  }

  100% {
    width: 0%;
  }
}

.animate-logoLine {
  animation: logoLine 4s ease-in-out infinite;
}
  @keyframes logoGlow {
  0% {
    text-shadow:
      0 0 5px rgba(99,102,241,.5),
      0 0 10px rgba(99,102,241,.3);
  }

  50% {
    text-shadow:
      0 0 15px rgba(99,102,241,.9),
      0 0 30px rgba(99,102,241,.7);
  }

  100% {
    text-shadow:
      0 0 5px rgba(99,102,241,.5),
      0 0 10px rgba(99,102,241,.3);
  }
}

.animate-logoGlow {
  animation: logoGlow 3s ease-in-out infinite;
}
        `}
      </style>

    </div>
  );
}