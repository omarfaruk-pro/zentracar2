import { useEffect, useRef, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function Chat({ chatId, userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const axiosSecure = useAxiosSecure();
  const chatEndRef = useRef(null);

  // Fetch messages periodically
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;
      const res = await axiosSecure.get(`/chat/${chatId}`);
      setMessages(res.data.messages || []);
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [chatId]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await axiosSecure.post(`/chat/${chatId}/message`, {
      senderId: userId,
      text,
    });
    setText("");
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 border-l border-gray-300">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => {
          const isMine = msg.senderId === userId;
          return (
            <div
              key={idx}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                  isMine
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-[10px] text-gray-400 block mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-gray-300 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-full transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
