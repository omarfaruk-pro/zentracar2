import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Chat from "../../component/Chat";

export default function MessengerPage() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);


  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.uid) return;
      const res = await axiosSecure.get(`/my-chats/${user.uid}`);
      setChats(res.data);
    };
    fetchChats();
  }, [user]);

  console.log(user)

  const handleSelectChat = async (chat) => {
    const otherUser = chat.participantDetails.find((p) => p.uid !== user.uid);
    setSelectedChat(chat);
    setSelectedUser(otherUser);
  };

  return (
    <div className="flex h-[calc(100vh-375px)] bg-gray-100 xl:max-w-7xl lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-300 bg-white overflow-y-auto">
        <div className="p-4 border-b bg-blue-600 text-white font-semibold">
          Messages
        </div>
        <ul>
          {chats.map((chat) => {
            const other = chat.participantDetails.find(
              (p) => p._id !== user.uid
            );
            const lastMsg = chat.messages?.[chat.messages.length - 1];
            return (
              <li
                key={chat._id}
                onClick={() => handleSelectChat(chat)}
                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-blue-50 ${
                  selectedChat?._id === chat._id ? "bg-blue-100" : ""
                }`}
              >
                <img
                  src={other?.photoURL || "/default-avatar.png"}
                  alt={other?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-black">{other?.name || "Unknown"}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {lastMsg ? lastMsg.text : "No messages yet"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <Chat chatId={selectedChat._id} userId={user.uid} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>Select a conversation to start chatting 💬</p>
          </div>
        )}
      </div>
    </div>
  );
}
