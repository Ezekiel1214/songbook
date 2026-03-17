import { motion } from "framer-motion";

export const ART_STYLES = [
  { id: "watercolor", label: "Watercolor", emoji: "🎨" },
  { id: "cartoon", label: "Cartoon", emoji: "✏️" },
  { id: "oil-painting", label: "Oil Painting", emoji: "🖼️" },
  { id: "pixel-art", label: "Pixel Art", emoji: "👾" },
  { id: "anime", label: "Anime", emoji: "🌸" },
  { id: "stained-glass", label: "Stained Glass", emoji: "🏛️" },
] as const;

export type ArtStyle = typeof ART_STYLES[number]["id"];

interface ArtStylePickerProps {
  selected: ArtStyle;
  onChange: (style: ArtStyle) => void;
}

const ArtStylePicker = ({ selected, onChange }: ArtStylePickerProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Art Style</label>
      <div className="grid grid-cols-3 gap-2">
        {ART_STYLES.map((style) => (
          <motion.button
            key={style.id}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(style.id)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl text-sm transition-all duration-200 ${
              selected === style.id
                ? "bg-primary/15 border-primary/40 text-foreground border shadow-sm shadow-primary/10"
                : "bg-secondary/30 border-border/30 text-muted-foreground border hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            <span className="text-lg">{style.emoji}</span>
            <span className="font-medium text-xs">{style.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ArtStylePicker;
