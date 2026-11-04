import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import ChatInterface from "./components/ChatInterface";
import { getDocuments } from "./services/api";

function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Normalize document data
  const normalizeDocument = (doc) => ({
    ...doc,
    id: doc.id || doc._id,
    name: doc.name || doc.originalName,
  });

  // Load previously uploaded documents
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const result = await getDocuments();
        const loadedDocuments = (result.documents || []).map(normalizeDocument);

        setDocuments(loadedDocuments);
      } catch (err) {
        console.error("Document loading error:", err);
        setError("Unable to load documents. Please check your backend server.");
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  // Handle successful PDF upload
  const handleUploadSuccess = (uploadedDocument) => {
    const newDocument = normalizeDocument(uploadedDocument);

    setDocuments((previous) => [
      newDocument,
      ...previous.filter((doc) => doc.id !== newDocument.id),
    ]);

    setSelectedDocument(newDocument);
    setError("");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f4f4]">
      {/* Sidebar */}
      <aside className="hidden w-80 shrink-0 md:block">
        <Sidebar
          documents={documents}
          selectedDocument={selectedDocument}
          onSelect={setSelectedDocument}
          onUploadSuccess={handleUploadSuccess}
          loading={loading}
        />
      </aside>

      {/* Main workspace */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Workspace header */}
        <header className="flex h-[73px] shrink-0 items-center justify-between border-b border-[#e0e0e0] bg-white px-6">
          <div>
            <h2 className="font-semibold text-[#161616]">PDF Workspace</h2>
            <p className="text-xs text-[#6f6f6f]">
              Ask questions and explore your documents
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#198038]" />
            <span className="text-xs font-medium text-[#525252]">
              Local AI Workspace
            </span>
          </div>
        </header>

        {/* Error notification */}
        {error && (
          <div className="bg-[#fff1f1] px-6 py-3 text-sm text-[#da1e28]">
            {error}
          </div>
        )}

        {/* Chat interface */}
        <div className="min-h-0 flex-1">
          <ChatInterface selectedDocument={selectedDocument} />
        </div>
      </main>
    </div>
  );
}

export default App;
