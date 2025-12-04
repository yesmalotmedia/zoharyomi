import { theme } from "@/config/theme";

export default function AudioPlayer({ src }) {
  if (!src) return null;

  return (
    <audio
      controls
      style={{
        width: "100%",
        marginTop: "12px",
        borderRadius: "8px",
      }}
      src={src}
    ></audio>
  );
}
