import { theme } from "@/config/theme";

export default function YomCard({ title, text, date }) {
  return (
    <div
      style={{
        padding: "24px",
        borderRadius: "14px",
        background: "#ffffff",
        borderRight: `6px solid ${theme.colors.gold}`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        lineHeight: "1.8",
        color: theme.colors.darkText,
      }}
    >
      {title && (
        <h1 style={{ color: theme.colors.primary, marginBottom: "14px" }}>
          {title}
        </h1>
      )}

      {date && (
        <div
          style={{
            fontSize: "0.9rem",
            marginBottom: "16px",
            opacity: 0.7,
          }}
        >
          {date}
        </div>
      )}

      {text && (
        <div
          style={{
            whiteSpace: "pre-line",
            fontSize: "1.1rem",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}
