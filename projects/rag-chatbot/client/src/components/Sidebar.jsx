import {
  FileText,
  Sparkles,
  Library,
  Cpu,
  PanelLeft,
  CircleHelp,
} from "lucide-react";

import FileUpload from "./FileUpload";
import DocumentList from "./DocumentList";

function Sidebar({
  documents,
  selectedDocument,
  onSelect,
  onUploadSuccess,
  loading = false,
}) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-[#e0e0e0] bg-white">
      {/* Brand */}
      <div className="flex h-[73px] shrink-0 items-center gap-3 border-b border-[#e0e0e0] px-5">
        <div className="flex h-10 w-10 items-center justify-center bg-[#0f62fe] text-white">
          <FileText size={22} />
        </div>

        <div>
          <h1 className="text-lg font-semibold tracking-tight text-[#161616]">
            DocuMind AI
          </h1>
          <p className="text-xs text-[#6f6f6f]">Intelligent PDF Assistant</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-[#e0e0e0] px-4 py-4">
        <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8d8d8d]">
          Workspace
        </p>

        <div className="flex items-center gap-3 bg-[#edf5ff] px-3 py-3 text-[#0043ce]">
          <PanelLeft size={18} />
          <span className="text-sm font-semibold">Document workspace</span>
        </div>
      </div>

      {/* Upload */}
      <div className="border-b border-[#e0e0e0] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#161616]">
            Add documents
          </h2>
          <Sparkles size={16} className="text-[#0f62fe]" />
        </div>

        <FileUpload onUploadSuccess={onUploadSuccess} />
      </div>

      {/* Document library */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Library size={17} className="text-[#525252]" />
            <h2 className="text-sm font-semibold text-[#161616]">
              Document library
            </h2>
          </div>

          <span className="bg-[#f4f4f4] px-2 py-1 text-xs font-medium text-[#525252]">
            {documents.length}
          </span>
        </div>

        {loading ? (
          <p className="px-2 py-6 text-center text-sm text-[#8d8d8d]">
            Loading documents...
          </p>
        ) : (
          <DocumentList
            documents={documents}
            selectedDocument={selectedDocument}
            onSelect={onSelect}
          />
        )}
      </div>

      {/* Bottom information */}
      <div className="shrink-0 border-t border-[#e0e0e0] p-4">
        <div className="flex items-center gap-3 bg-[#f4f4f4] p-3">
          <div className="flex h-9 w-9 items-center justify-center bg-[#e5f6ff] text-[#00539a]">
            <Cpu size={19} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#161616]">
              Local AI Engine
            </p>
            <p className="text-xs text-[#6f6f6f]">Ollama · Llama 3.1</p>
          </div>

          <span
            className="h-2 w-2 rounded-full bg-[#198038]"
            title="Configured local AI engine"
          />
        </div>

        <div className="mt-3 flex items-center gap-2 px-2 text-xs text-[#6f6f6f]">
          <CircleHelp size={14} />
          <span>Private document workspace</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
