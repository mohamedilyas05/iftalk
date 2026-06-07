import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import MessageInput from "./MessageInput";
import socket from "../socket";

export default function ChatWindow({ activeChat, user, onlineUsers, goBack, theme,
  setTheme, }) {
  const [messages, setMessages] = useState([]);
const [typingUser, setTypingUser] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [chatVisible, setChatVisible] = useState(true);
  const bottomRef = useRef(null);

  const me = user;

  useEffect(() => {
  if (!activeChat) return;

  setChatVisible(false);

  const timer = setTimeout(async () => {
    try {
      const res = await api.get(
        `/messages/${activeChat._id}`
      );

      setMessages(res.data);
      setChatVisible(true);
    } catch (err) {
      console.log(err);
    }
  }, 150);

  return () => clearTimeout(timer);
}, [activeChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
  socket.on("receiveMessage", (message) => {
    setMessages((prev) => {
      const exists = prev.find((m) => m._id === message._id);
      if (exists) return prev;

      return [...prev, message];
    });
  });

  socket.on("userTyping", ({ username }) => {
    setTypingUser(username);
  });

  socket.on("userStopTyping", () => {
    setTypingUser("");
  });

  return () => {
    socket.off("receiveMessage");
    socket.off("userTyping");
    socket.off("userStopTyping");
  };
}, []);

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0b0b10] text-white/40">
        <div className="text-center animate-pulse">
          <div className="text-lg text-white/70">Welcome to IFtalk</div>
          <div className="text-sm">Select a chat to start messaging</div>
        </div>
      </div>
    );
  }
  const otherUser = activeChat?.participants?.find(
  (p) => String(p._id) !== String(user._id)
);

const isOnline = onlineUsers.includes(
  otherUser?._id
);
const themeBackground = {
  snow: "bg-[#070A12]",
  space: "bg-black",
  rain: "bg-[#05070C]",
};
const getEffect = (text) => {
  const msg = text.toLowerCase();

  if (
    msg.includes("congratulations") ||
    msg.includes("congrats") ||
    msg.includes("well done")
  )
    return "congrats";

  if (
    msg.includes("love") ||
    msg.includes("❤️")
  )
    return "love";

  if (
    msg.includes("welcome") ||
    msg.includes("welcome aboard")
  )
    return "welcome";

  if (
    msg.includes("thanks") ||
    msg.includes("thank you") ||
    msg.includes("thx")
  )
    return "thanks";

  return null;
};
return (
 <div className={`h-screen flex flex-col relative text-white overflow-hidden ${themeBackground[theme]}`}>
    {/* ❄️ CINEMATIC SNOW BACKGROUND */}
<div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

  {/* 🌌 SPACE THEME */}
  {theme === "space" && (
    <>
      {/* Nebula Glow */}
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-violet-500/20 blur-[150px] rounded-full animate-pulse" />

      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-blue-500/20 blur-[150px] rounded-full animate-pulse" />

      {/* Stars */}
      {Array.from({ length: 120 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-star"
          style={{
            width: `${1 + Math.random() * 3}px`,
            height: `${1 + Math.random() * 3}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
      {/* Shooting Stars */}
{Array.from({ length: 3 }).map((_, i) => (
  <div
    key={`shooting-${i}`}
    className="shooting-star"
    style={{
      top: `${10 + i * 25}%`,
      animationDelay: `${i * 8}s`,
    }}
  />
))}
    </>
  )}

  {/* ❄️ SNOW THEME */}
  {theme === "snow" && (
    <>
      {Array.from({ length: 25 }).map((_, i) => (
        <span
          key={"far" + i}
          className="absolute top-[-10px] w-[2px] h-[2px] bg-white/30 rounded-full animate-snow-far"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${10 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}

      {Array.from({ length: 25 }).map((_, i) => (
        <span
          key={"mid" + i}
          className="absolute top-[-10px] w-[3px] h-[3px] bg-white/50 rounded-full animate-snow-mid"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${7 + Math.random() * 6}s`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        />
      ))}

      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={"near" + i}
          className="absolute top-[-10px] w-[4px] h-[4px] bg-white/80 rounded-full blur-[0.5px] animate-snow-near"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${5 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 6}s`,
          }}
        />
      ))}
    </>
  )}
  {/* 🌧️ RAIN THEME */}
{theme === "rain" && (
  <>
    {/* Storm Clouds */}
    <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0c12] to-[#05070C]" />

    {/* Lightning */}
    <div className="lightning-bolt" style={{ left: "20%", top: "8%" }}>
  <span className="lightning-branch"></span>
</div>

<div className="lightning-bolt" style={{ left: "70%", top: "12%" }}>
  <span className="lightning-branch"></span>
</div>

    {/* Rain */}
    {Array.from({ length: 180 }).map((_, i) => (
      <span
        key={`rain-${i}`}
        className="absolute top-[-50px] animate-rain"
        style={{
          left: `${Math.random() * 100}%`,
          height: `${10 + Math.random() * 25}px`,
          width: "1px",
          background: "rgba(255,255,255,0.35)",
          animationDuration: `${1 + Math.random() * 0.5}s`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    ))}
  </>
)}
</div>    
   {/* HEADER */}
<div className="
h-20
flex
items-center
px-5
border-b
border-white/10
bg-white/5
backdrop-blur-2xl
shadow-[0_8px_30px_rgba(0,0,0,0.25)]
z-20
flex-shrink-0
">

  {/* BACK BUTTON */}
  <button
    onClick={goBack}
    className="
      md:hidden
      mr-4
      text-xl
      text-white/70
      hover:text-white
      transition
    "
  >
    ←
  </button>

  {/* PROFILE */}
  <div
    onClick={() => setShowProfile(true)}
    className="
      flex
      items-center
      gap-3
      cursor-pointer
      group
    "
  >
    <div className="relative">

      <img
        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${otherUser?.username}`}
        alt=""
        className="
          w-14
          h-14
          rounded-full
          border
          border-white/10
          shadow-lg
          group-hover:scale-105
          transition
        "
      />

      {/* ONLINE DOT */}
      {isOnline && (
        <div className="absolute bottom-0 right-0">
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
          <span className="relative block w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#070A12]" />
        </div>
      )}

    </div>

    {/* USER INFO */}
    <div>
      <h2 className="font-semibold text-white text-base">
        {otherUser?.username}
      </h2>

      <p className="text-xs text-white/50">
        {isOnline
          ? "Online"
          : otherUser?.lastSeen
          ? `Last seen ${new Date(
              otherUser.lastSeen
            ).toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}`
          : "Offline"}
      </p>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="ml-auto flex items-center gap-2">

    {/* SNOW */}
    <button
      onClick={() => setTheme("snow")}
      className={`
        w-10 h-10 rounded-xl
        flex items-center justify-center
        transition-all duration-300
        ${
          theme === "snow"
            ? "bg-indigo-600 shadow-lg shadow-indigo-500/30 scale-105"
            : "bg-white/5 hover:bg-white/10"
        }
      `}
    >
      ❄️
    </button>

    {/* SPACE */}
    <button
      onClick={() => setTheme("space")}
      className={`
        w-10 h-10 rounded-xl
        flex items-center justify-center
        transition-all duration-300
        ${
          theme === "space"
            ? "bg-indigo-600 shadow-lg shadow-indigo-500/30 scale-105"
            : "bg-white/5 hover:bg-white/10"
        }
      `}
    >
      🌌
    </button>

    {/* RAIN */}
    <button
      onClick={() => setTheme("rain")}
      className={`
        w-10 h-10 rounded-xl
        flex items-center justify-center
        transition-all duration-300
        ${
          theme === "rain"
            ? "bg-indigo-600 shadow-lg shadow-indigo-500/30 scale-105"
            : "bg-white/5 hover:bg-white/10"
        }
      `}
    >
      🌧️
    </button>

  </div>
</div>    {/* MESSAGES AREA */}
   <div
  className={`
    flex-1
    min-h-0
    p-4
    overflow-y-auto
    space-y-3
    z-10
    relative
    transition-all
    duration-300
    ${
      chatVisible
        ? "opacity-100 translate-x-0"
        : "opacity-0 translate-x-5"
    }
  `}
>

      {messages.map((m, i) => {
        const isMine =
          String(m.sender?._id || m.sender) === String(me._id || me.id);

        return (
          <div
            key={m._id}
            style={{ animationDelay: `${i * 25}ms` }}
            className={`flex mb-2 animate-[msgIn_0.25s_ease_forwards]
            ${isMine ? "justify-end" : "justify-start"}`}
          >

            {/* 💬 MESSAGE BUBBLE */}
            <div
              className={`relative max-w-[72%] px-4 py-2 rounded-2xl text-sm break-words
              leading-relaxed transition-all duration-200 group
              hover:scale-[1.02] hover:-translate-y-[1px]
              ${
                isMine
  ? "bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white shadow-[0_0_30px_rgba(99,102,241,0.35)] rounded-br-md"
                  : "bg-white/5 border border-white/10 text-white/90 backdrop-blur-xl rounded-bl-md shadow-[0_0_20px_rgba(99,102,241,0.08)]"
              }`}
            >
              {getEffect(m.content) === "congrats" && (
  <div className="congrats-effect">✨✨✨</div>
)}

{getEffect(m.content) === "love" && (
  <div className="love-effect">❤️ ❤️ ❤️</div>
)}

{getEffect(m.content) === "welcome" && (
  <div className="welcome-effect">⭐ ⭐ ⭐</div>
)}

{getEffect(m.content) === "thanks" && (
  <div className="thanks-effect">🙏🏻 🙏🏻 🙏🏻</div>
)}

              {/* subtle glow edge on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-white/5 blur-xl"></div>

              <p className="relative z-10 whitespace-pre-wrap">
                {m.content}
              </p>

              {m.createdAt && (
                <p className="relative z-10 text-[10px] mt-1 opacity-50 text-right">
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>

          </div>
        );
      })}

      {typingUser && (
  <div className="text-sm text-white/50 italic px-1 mb-10">
    {typingUser} is typing...
  </div>
)}

<div ref={bottomRef} />
    </div>

    {/* INPUT */}
    <div className="border-t border-white/10 bg-white/5 backdrop-blur-xl z-10 flex-shrink-0">
      <MessageInput activeChat={activeChat} user={user} setMessages={setMessages}/>
    </div>
  {showProfile && (
  <div
    onClick={() => setShowProfile(false)}
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-[#111827] p-6 rounded-2xl w-80"
    >
      <img
        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${otherUser?.username}`}
        className="w-32 h-32 mx-auto rounded-full"
        alt=""
      />

      <h2 className="text-center text-xl mt-4">
        {otherUser?.username}
      </h2>

      <p className="text-center text-white/50">
        {otherUser?.email}
      </p>
    </div>
  </div>
)}
    {/* ANIMATIONS */}
    <style>
{`
@keyframes msgIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ❄️ SNOW LAYERS */
@keyframes snowFallFar {
  0% { transform: translateY(-10px) translateX(0px); opacity: 0; }
  10% { opacity: 0.3; }
  100% { transform: translateY(110vh) translateX(20px); opacity: 0; }
}

@keyframes snowFallMid {
  0% { transform: translateY(-10px) translateX(0px); opacity: 0; }
  10% { opacity: 0.6; }
  100% { transform: translateY(110vh) translateX(-30px); opacity: 0; }
}

@keyframes snowFallNear {
  0% { transform: translateY(-10px) translateX(0px); opacity: 0; }
  10% { opacity: 0.9; }
  100% { transform: translateY(110vh) translateX(40px); opacity: 0; }
}

.animate-snow-far {
  animation: snowFallFar linear infinite;
}

.animate-snow-mid {
  animation: snowFallMid linear infinite;
}

.animate-snow-near {
  animation: snowFallNear linear infinite;
}
  @keyframes starTwinkle {
  0% {
    opacity: 0.2;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.8);
  }

  100% {
    opacity: 0.2;
    transform: scale(1);
  }
}

.animate-star {
  animation: starTwinkle ease-in-out infinite;
}
  @keyframes rainFall {
  0% {
    transform: translateY(-100px);
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  100% {
    transform: translateY(120vh);
    opacity: 0;
  }
}

.animate-rain {
  animation: rainFall linear infinite;
}
  @keyframes rainFall {
  0% {
    transform: translateY(-100px) translateX(0px);
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  100% {
    transform: translateY(120vh) translateX(-40px);
    opacity: 0;
  }
}

.animate-rain {
  animation: rainFall linear infinite;
}
@keyframes lightningSky {
  0%, 92%, 100% {
    opacity: 0;
  }

  93% {
    opacity: 0.8;
  }

  94% {
    opacity: 0;
  }

  95% {
    opacity: 1;
  }

  96% {
    opacity: 0;
  }
}

.lightning-bolt {
  position: absolute;
  width: 4px;
  height: 140px;

  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0.95),
    rgba(255,255,255,0.2)
  );

  transform: skew(-20deg);
  filter: blur(1px);

  opacity: 0;
  animation: lightningSky 10s infinite;
}

.lightning-branch {
  position: absolute;
  width: 3px;
  height: 50px;
  background: white;

  transform: rotate(35deg);

  top: 40px;
  left: -15px;
}
  @keyframes shootingStar {
  0% {
    transform: translateX(-200px) translateY(0);
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  80% {
    opacity: 1;
  }

  100% {
    transform: translateX(120vw) translateY(250px);
    opacity: 0;
  }
}

.shooting-star {
  position: absolute;
  width: 150px;
  height: 2px;

  background: linear-gradient(
    to right,
    rgba(255,255,255,0),
    rgba(255,255,255,1)
  );

  border-radius: 999px;

  animation: shootingStar 25s linear infinite;

  transform: rotate(25deg);

  filter: drop-shadow(0 0 8px white);

  z-index: 1;
}
  @keyframes sparkle {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.4);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
}

.congrats-effect {
  position: absolute;
  inset: -10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  animation: sparkle 2s ease;
  pointer-events: none;
}

@keyframes heartFloat {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(-30px);
  }
}

.love-effect {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  font-size: 18px;
  animation: heartFloat 2s ease-out;
  pointer-events: none;
}

@keyframes starBurst {
  from {
    transform: scale(0);
    opacity: 1;
  }
  to {
    transform: scale(2);
    opacity: 0;
  }
}

.welcome-effect {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  font-size: 18px;
  animation: starBurst 1.5s ease;
  pointer-events: none;
}

@keyframes glowFade {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.thanks-effect {
  position: absolute;
  inset: -4px;
  border-radius: 20px;
  box-shadow:
    0 0 15px gold,
    0 0 30px gold;
  animation: glowFade 2s forwards;
  pointer-events: none;
}
`}
</style>

  </div>
);
}