import { theme } from "@/config/theme";

export default function VideoPlayer({ src }) {
  if (!src) return null;

  return (
    <div
      style={{
        marginTop: "18px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <video
        src={src}
        controls
        style={{
          width: "100%",
          maxHeight: "450px",
          borderRadius: "12px",
          display: "block",
        }}
      />
    </div>
  );
}
