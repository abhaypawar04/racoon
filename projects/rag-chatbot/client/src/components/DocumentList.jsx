import { FileText, CheckCircle2, Circle } from "lucide-react";

function DocumentList({ documents, selectedDocument, onSelect }) {
  if (!documents.length) {
    return (
      <div className="px-3 py-8 text-center">
        <FileText size={28} className="mx-auto mb-3 text-[#a8a8a8]" />

        <p className="text-sm font-medium text-[#525252]">No documents yet</p>

        <p className="mt-1 text-xs leading-5 text-[#8d8d8d]">
          Upload a PDF to start building your library.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {documents.map((doc) => {
        const documentId = doc.id || doc._id;
        const isSelected =
          selectedDocument?.id === documentId ||
          selectedDocument?._id === documentId;

        return (
          <button
            key={documentId}
            type="button"
            onClick={() => onSelect(doc)}
            title={doc.originalName || doc.name}
            className={`group flex w-full items-center gap-3 border-l-2 px-3 py-3 text-left transition ${
              isSelected
                ? "border-[#0f62fe] bg-[#edf5ff]"
                : "border-transparent hover:bg-[#f4f4f4]"
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center ${
                isSelected ? "bg-white" : "bg-[#f4f4f4]"
              }`}
            >
              <FileText
                size={19}
                className={isSelected ? "text-[#0f62fe]" : "text-[#525252]"}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm ${
                  isSelected
                    ? "font-semibold text-[#161616]"
                    : "font-medium text-[#393939]"
                }`}
              >
                {doc.originalName || doc.name || "Untitled PDF"}
              </p>

              <p className="mt-1 text-xs text-[#8d8d8d]">PDF document</p>
            </div>

            {isSelected ? (
              <CheckCircle2 size={17} className="shrink-0 text-[#0f62fe]" />
            ) : (
              <Circle
                size={16}
                className="shrink-0 text-[#c6c6c6] opacity-0 transition group-hover:opacity-100"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default DocumentList;
