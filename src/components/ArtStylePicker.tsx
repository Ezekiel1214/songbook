import { cn } from "@/lib/utils";

export const ART_STYLES = [
  { id: "watercolor", label: "Watercolor", emoji: "🎨", description: "Soft, dreamy watercolor paintings" },
  { id: "cartoon", label: "Cartoon", emoji: "✏️", description: "Fun, colorful cartoon illustrations" },
  { id: "oil-painting", label: "Oil Painting", emoji: "🖼️", description: "Rich, textured oil painting style" },
  { id: "pixel-art", label: "Pixel Art", emoji: "👾", description: "Retro pixel art aesthetic" },
  { id: "anime", label: "Anime", emoji: "🌸", description: "Japanese anime illustration style" },
  { id: "stained-glass", label: "Stained Glass", emoji: "🏛️", description: "Gothic stained glass window art" },
] as const;

export type ArtStyle = typeof ART_STYLES[number]["id"];

interface ArtStylePickerProps {
  selected: ArtStyle;
  onChange: (style: ArtStyle) => void;
}

const ArtStylePicker = ({ selected, onChange }: ArtStylePickerProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-lyrical-deepPurple">Art Style</label>
      <div className="grid grid-cols-3 gap-2">
        {ART_STYLES.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-sm",
              selected === style.id
                ? "border-primary bg-primary/10 shadow-md"
                : "border-border hover:border-primary/50 hover:bg-muted"
            )}
          >
            <span className="text-xl">{style.emoji}</span>
            <span className="font-medium text-foreground">{style.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ArtStylePicker;
