import { useRef, useState } from "react";
import { FileUp, LoaderCircle, FileText, AlertCircle } from "lucide-react";

import { uploadPDF, generateEmbeddings } from "../services/api";

function FileUpload({ onUploadSuccess }) {
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a valid PDF file.");
      event.target.value = "";
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Upload PDF
      const result = await uploadPDF(file);

      if (!result.document) {
        throw new Error("PDF upload response is invalid.");
      }

      const document = result.document;
      const documentId = document.id || document._id;

      if (!documentId) {
        throw new Error("Document ID was not returned by the server.");
      }

      // Step 2: Generate embeddings
      await generateEmbeddings(documentId);

      // Step 3: Add document to the library
      onUploadSuccess(document);
    } catch (err) {
      console.error("PDF processing error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "PDF processing failed. Please try again.",
      );
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        disabled={loading}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="group flex w-full items-center gap-3 border border-[#0f62fe] bg-[#0f62fe] px-4 py-4 text-left text-white transition hover:bg-[#0043ce] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-white/15">
          {loading ? (
            <LoaderCircle size={21} className="animate-spin" />
          ) : (
            <FileUp size={21} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {loading ? "Processing PDF..." : "Upload a PDF"}
          </p>

          <p className="mt-1 text-xs text-blue-100">
            {loading
              ? "Generating AI embeddings"
              : "Select a document from your device"}
          </p>
        </div>
      </button>

      <div className="flex items-center gap-2 text-xs text-[#6f6f6f]">
        <FileText size={14} />
        <span>PDF files only · Maximum 15 MB</span>
      </div>

      {loading && (
        <div className="h-1 w-full overflow-hidden bg-[#e0e0e0]">
          <div className="h-full w-2/3 animate-pulse bg-[#0f62fe]" />
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 bg-[#fff1f1] p-3 text-sm text-[#da1e28]">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
