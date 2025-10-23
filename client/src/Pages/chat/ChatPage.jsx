import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

export default function ChatPage() {
  const { id: ownerId } = useParams(); 
  const { user } = useAuth();
  const userId = user?.uid;
  const axiosSecure = useAxiosSecure();

  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const getChat = async () => {
      const res = await axiosSecure.post("/chat", { userId, ownerId });
      setChatId(res.data._id);
    };
    if (userId && ownerId) getChat();
  }, [userId, ownerId]);


  useEffect(() => {
    if (!chatId) return;
    const fetchMessages = async () => {
      const res = await axiosSecure.get(`/chat/${chatId}`);
      setMessages(res.data?.messages || []);
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [chatId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    await axiosSecure.post(`/chat/${chatId}/message`, { senderId: userId, text });
    setText("");
  };

  return (
    <div className="flex h-[calc(100vh-375px)] xl:max-w-7xl lg:max-w-5xl md:max-w-3xl sm:max-w-xl mx-auto dark:bg-gray-100 bg-gray-700">
      <div className="w-1/3 dark:bg-gray-50 bg-gray-800  p-4">
        <h2 className="text-lg font-semibold mb-4 dark:text-black text-white">Chats</h2>
        <div className="text-sm text-gray-400 dark:text-gray-600">Chat with Owner</div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs ${
                  msg.senderId === userId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-gray-400 p-3 flex">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-400 rounded-full px-4 py-2 focus:outline-none bg-gray-600 dark:bg-gray-200"
          />
          <button
            onClick={handleSend}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
