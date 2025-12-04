import { theme } from "@/config/theme";

export default function LayoutContainer({ children }) {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Heebo, Arial, sans-serif",
        direction: "rtl",
        color: "#222",
      }}
    >
      {children}
    </div>
  );
}
