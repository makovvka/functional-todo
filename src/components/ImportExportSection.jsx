export function ImportExportSection({
  isExportOpen,
  exportText,
  openExport,
  closeExport,
  isImportOpen,
  importText,
  setImportText,
  importError,
  openImport,
  cancelImport,
  confirmImport,
}) {
  return (
    <div style={{ marginTop: "12px" }}>
      <div
        style={{
          display: "flex",
          gap: "8px",
          fontSize: "13px",
        }}
      >
        <button
          onClick={openExport}
          style={{
            flex: 1,
            padding: "6px 8px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#f9fafb",
            cursor: "pointer",
          }}
        >
          Eksportuj JSON
        </button>
        <button
          onClick={openImport}
          style={{
            flex: 1,
            padding: "6px 8px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#f9fafb",
            cursor: "pointer",
          }}
        >
          Importuj JSON
        </button>
      </div>

      {}
      {isExportOpen && (
        <div style={{ marginTop: "16px" }}>
          <h3 style={{ fontSize: "14px", marginBottom: "4px" }}>
            Eksportowane dane (JSON):
          </h3>
          <textarea
            value={exportText}
            readOnly
            rows={4}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontFamily: "monospace",
              fontSize: "12px",
            }}
          />
          <div style={{ marginTop: "8px", textAlign: "right" }}>
            <button
              onClick={closeExport}
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: "#f9fafb",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Zamknij
            </button>
          </div>
        </div>
      )}

      {}
      {isImportOpen && (
        <div style={{ marginTop: "16px" }}>
          <h3 style={{ fontSize: "14px", marginBottom: "4px" }}>
            Wklej dane JSON do importu:
          </h3>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontFamily: "monospace",
              fontSize: "12px",
            }}
          />
          {importError && (
            <div
              style={{
                marginTop: "4px",
                color: "#b91c1c",
                fontSize: "12px",
              }}
            >
              {importError}
            </div>
          )}
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
            }}
          >
            <button
              onClick={cancelImport}
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: "#f3f4f6",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Anuluj
            </button>
            <button
              onClick={confirmImport}
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid #111827",
                background: "#111827",
                color: "white",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Importuj
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
