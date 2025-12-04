import { theme } from "@/config/theme";
export default function SectionTitle({ text }) {
  return (
    <h2
      style={{
        fontSize: "1.9rem",
        margin: "30px 0 18px",
        paddingRight: "12px",
        borderRight: "6px solid #d4af37",
        fontWeight: 600,
      }}
    >
      {text}
    </h2>
  );
}
