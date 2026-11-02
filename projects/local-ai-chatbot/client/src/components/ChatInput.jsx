import { useState } from "react";
import { Send } from "lucide-react";

function ChatInput({ onSend, loading }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    onSend(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto w-full p-4">
      <div className="flex items-center gap-3 bg-[#2f2f2f] rounded-2xl p-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message your local AI..."
          className="flex-1 bg-transparent outline-none text-white p-2"
        />

        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="bg-white text-black p-3 rounded-xl disabled:opacity-40"
        >
          <Send size={19} />
        </button>
      </div>
    </form>
  );
}

export default ChatInput;
