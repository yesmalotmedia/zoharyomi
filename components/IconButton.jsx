import { theme } from "@/config/theme";

export default function IconButton({ icon, text }) {
  return (
    <div
      style={{
        background: theme.colors.orange,
        padding: "18px",
        borderRadius: "14px",
        textAlign: "center",
        width: "120px",
        color: "white",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        cursor: "pointer",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "6px" }}>{icon}</div>
      <div style={{ fontWeight: 600 }}>{text}</div>
    </div>
  );
}
