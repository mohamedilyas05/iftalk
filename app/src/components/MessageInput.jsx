import { useState, useRef } from "react";
import api from "../services/api";
import socket from "../socket";

export default function MessageInput({ activeChat, user,setMessages, }) {
  const [text, setText] = useState("");
  const typingTimeout = useRef(null);
  const sendMessage = async () => {
    if (!text) return;

    const res = await api.post("/messages", {
      conversationId: activeChat._id,
      content: text,
    });

    const message = res.data;
    setMessages(prev => [...prev, message]);
    const otherUser = activeChat.participants.find(
      (p) => String(p._id) !== String(user._id)
    );

    socket.emit("sendMessage", {
      receiverId: otherUser._id,
      message,
    });

    setText("");
    socket.emit("stopTyping", {
  receiverId: otherUser._id,
});
  };
const handleTyping = (value) => {
  setText(value);

  const otherUser = activeChat?.participants?.find(
  (p) => String(p._id) !== String(user._id)
);

  if (!otherUser) return;

  socket.emit("typing", {
    receiverId: otherUser._id,
    username: user.username,
  });

  clearTimeout(typingTimeout.current);

  typingTimeout.current = setTimeout(() => {
    socket.emit("stopTyping", {
      receiverId: otherUser._id,
    });
  }, 1000);
};
  return (
  <div className="relative p-4 border-t border-white/10 bg-black/30 backdrop-blur-xl flex items-center gap-3">

    {/* glow background effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-blue-500/10 blur-xl"></div>

    {/* INPUT WRAPPER */}
    <div className="relative flex-1 flex items-center">

      <input
        value={text}
        onChange={(e) => handleTyping(e.target.value)}
        placeholder="Type something beautiful..."
        className="
          w-full px-4 py-3
          rounded-2xl
          bg-white/5
          text-white
          border border-white/10
          outline-none
          placeholder-white/40
          backdrop-blur-xl
          transition-all duration-300
          focus:border-indigo-400
          focus:ring-2 focus:ring-indigo-500/20
          focus:bg-white/10
        "
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
      />

      {/* subtle typing glow line */}
      <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent opacity-0 focus-within:opacity-100 transition"></div>

    </div>

    {/* SEND BUTTON */}
    <button
      onClick={sendMessage}
      disabled={!text.trim()}
      className={`
        relative px-6 py-3 rounded-2xl font-medium text-white
        transition-all duration-300 overflow-hidden

        ${
          text.trim()
            ? "bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 shadow-[0_0_25px_rgba(99,102,241,0.35)] hover:scale-[1.05] active:scale-95"
            : "bg-white/10 text-white/40 cursor-not-allowed"
        }
      `}
    >

      {/* animated shine effect */}
      {text.trim() && (
        <span className="absolute inset-0 bg-white/20 translate-x-[-100%] animate-[shine_1.5s_infinite]"></span>
      )}

      <span className="relative z-10">Send</span>

    </button>

    {/* animations */}
    <style>
      {`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
      `}
    </style>

  </div>
);
}