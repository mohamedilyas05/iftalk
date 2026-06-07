import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import socket from "../socket";

export default function Chat() {
  const [activeChat, setActiveChat] = useState(null);
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
const [theme, setTheme] = useState("snow");
  // Load user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Join socket
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", user._id);

    return () => {
      socket.off("join");
    };
  }, [user]);

  // Online users
  useEffect(() => {
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    socket.on("getOnlineUsers", handleOnlineUsers);

    return () => {
      socket.off("getOnlineUsers", handleOnlineUsers);
    };
  }, []);
  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setShowSidebar(true);
    }
  };

  window.addEventListener("resize", handleResize);

  return () =>
    window.removeEventListener("resize", handleResize);
}, []);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#070A12] text-white">
        Loading IFtalk...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">

  {/* SIDEBAR */}
  <div
  className={`
    ${showSidebar ? "flex" : "hidden"}
    md:flex
    w-full
    md:w-80
  `}
>
  <Sidebar
    setActiveChat={(chat) => {
      setActiveChat(chat);

      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    }}
    activeChat={activeChat}
    user={user}
    onlineUsers={onlineUsers}
  />
</div>

  {/* CHAT WINDOW */}
  <div
  className={`
    ${!showSidebar ? "flex" : "hidden"}
    md:flex
    flex-1
  `}
>
  <ChatWindow
  activeChat={activeChat}
  user={user}
  onlineUsers={onlineUsers}
  goBack={() => setShowSidebar(true)}
  theme={theme}
  setTheme={setTheme}
/>
</div>

</div>
  );
}