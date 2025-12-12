export function StatsBar({ stats }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          fontSize: "13px",
          marginBottom: "8px",
        }}
      >
        <StatPill label="Wszystkie" value={stats.total} />
        <StatPill label="Zrobione" value={stats.done} />
        <StatPill label="Do zrobienia" value={stats.notDone} />
      </div>
      <div
        style={{
          marginTop: "4px",
          background: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
          height: "8px",
        }}
      >
        <div
          style={{
            width: `${stats.progress}%`,
            height: "100%",
            background: "#16a34a",
            transition: "width 0.2s",
          }}
        />
      </div>
      <div
        style={{
          marginTop: "2px",
          fontSize: "11px",
          color: "#6b7280",
          textAlign: "right",
        }}
      >
        Postęp: {stats.progress}%
      </div>
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div
      style={{
        padding: "6px 10px",
        borderRadius: "999px",
        background: "#e5e7eb",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          minWidth: "24px",
          height: "24px",
          borderRadius: "999px",
          background: "white",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          fontSize: "13px",
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: "13px" }}>{label}</span>
    </div>
  );
}
