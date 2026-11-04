import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  User,
  LoaderCircle,
  FileText,
  Sparkles,
  MessageSquare,
} from "lucide-react";

import { askQuestion } from "../services/api";

function ChatInterface({ selectedDocument }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    setMessages([]);
    setError("");
    setQuestion("");
  }, [selectedDocument?.id, selectedDocument?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userQuestion = question.trim();

    if (!userQuestion || !selectedDocument || loading) return;

    const documentId = selectedDocument.id || selectedDocument._id;

    setQuestion("");
    setError("");

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    setLoading(true);

    try {
      const result = await askQuestion(userQuestion, documentId);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: result.answer,
          sources: result.sources || [],
        },
      ]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to generate an answer. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!selectedDocument) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#f4f4f4] px-6 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center bg-white shadow-sm">
          <FileText size={36} className="text-[#0f62fe]" />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-[#161616]">
          Your document workspace
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-[#525252]">
          Select a document from your library or upload a PDF to start exploring
          it with your local AI assistant.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f4f4f4]">
      {/* Document header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#e0e0e0] bg-white px-5 py-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#edf5ff]">
            <FileText size={20} className="text-[#0f62fe]" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-[#161616]">
              {selectedDocument.name ||
                selectedDocument.originalName ||
                "Selected document"}
            </h2>

            <p className="mt-1 text-xs text-[#6f6f6f]">Document conversation</p>
          </div>
        </div>

        <div className="ml-3 flex shrink-0 items-center gap-2 text-xs text-[#198038]">
          <span className="h-2 w-2 rounded-full bg-[#198038]" />
          <span className="hidden sm:inline">AI available</span>
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8">
        {messages.length === 0 && (
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center bg-[#0f62fe] text-white">
              <Sparkles size={23} />
            </div>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#0f62fe]">
              DocuMind AI Assistant
            </p>

            <h1 className="max-w-xl text-3xl font-light leading-tight tracking-tight text-[#161616] sm:text-4xl">
              What would you like to know about your document?
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-6 text-[#525252]">
              Ask questions in natural language. I'll search your uploaded PDF
              and generate answers using its content.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Summarize this document",
                "Explain the important points",
                "Find key dates and figures",
                "What are the main topics?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setQuestion(suggestion)}
                  className="flex items-center justify-between border border-[#e0e0e0] bg-white p-4 text-left text-sm text-[#393939] transition hover:border-[#0f62fe] hover:bg-[#edf5ff]"
                >
                  {suggestion}
                  <MessageSquare
                    size={16}
                    className="ml-3 shrink-0 text-[#0f62fe]"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl space-y-7">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 sm:gap-4 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#0f62fe] text-white">
                  <Bot size={19} />
                </div>
              )}

              <div
                className={`max-w-[88%] px-4 py-3 sm:px-5 ${
                  message.role === "user"
                    ? "bg-[#e8e8e8] text-[#161616]"
                    : "border border-[#e0e0e0] bg-white text-[#262626]"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-7">
                  {message.content}
                </p>

                {message.sources?.length > 0 && (
                  <div className="mt-4 border-t border-[#e0e0e0] pt-3">
                    <p className="mb-2 text-xs font-semibold text-[#525252]">
                      Retrieved PDF sources
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {message.sources.map((source, sourceIndex) => (
                        <span
                          key={sourceIndex}
                          className="bg-[#edf5ff] px-2.5 py-1 text-xs text-[#0043ce]"
                        >
                          Chunk {source.chunkIndex}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {message.role === "user" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#e0e0e0] text-[#393939]">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-sm text-[#525252]">
              <div className="flex h-9 w-9 items-center justify-center bg-[#0f62fe] text-white">
                <Bot size={19} />
              </div>
              <LoaderCircle size={18} className="animate-spin text-[#0f62fe]" />
              Searching your document...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-auto w-full max-w-3xl px-4 pb-3 text-sm text-[#da1e28] sm:px-8">
          {error}
        </div>
      )}

      {/* Message input */}
      <div className="shrink-0 border-t border-[#e0e0e0] bg-white px-4 py-4 sm:px-8">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex items-end gap-3 border border-[#8d8d8d] bg-white p-2 transition focus-within:border-[#0f62fe] focus-within:ring-1 focus-within:ring-[#0f62fe]">
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSubmit(event);
                }
              }}
              placeholder="Ask a question about your PDF..."
              rows={1}
              className="max-h-32 min-h-11 flex-1 resize-y bg-transparent px-3 py-3 text-sm text-[#161616] outline-none placeholder:text-[#8d8d8d]"
            />

            <button
              type="submit"
              disabled={!question.trim() || loading}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#0f62fe] text-white transition hover:bg-[#0043ce] disabled:cursor-not-allowed disabled:bg-[#c6c6c6]"
            >
              {loading ? (
                <LoaderCircle size={19} className="animate-spin" />
              ) : (
                <Send size={19} />
              )}
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#6f6f6f]">
            <span>Powered by Ollama · Llama 3.1</span>
            <span>Enter to send · Shift + Enter for new line</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatInterface;
