import { motion } from "framer-motion";

export type StoryTone = "whimsical" | "dramatic" | "dark" | "romantic" | "humorous";

interface TonePickerProps {
  selected: StoryTone;
  onChange: (tone: StoryTone) => void;
}

const tones: { value: StoryTone; label: string; emoji: string; description: string }[] = [
  { value: "whimsical", label: "Whimsical", emoji: "✨", description: "Playful & magical" },
  { value: "dramatic", label: "Dramatic", emoji: "🎭", description: "Epic & intense" },
  { value: "dark", label: "Dark", emoji: "🌑", description: "Mysterious & haunting" },
  { value: "romantic", label: "Romantic", emoji: "💕", description: "Tender & poetic" },
  { value: "humorous", label: "Humorous", emoji: "😄", description: "Witty & fun" },
];

const TonePicker = ({ selected, onChange }: TonePickerProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Story Tone</label>
      <div className="flex flex-wrap gap-2">
        {tones.map((tone) => (
          <motion.button
            key={tone.value}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(tone.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
              selected === tone.value
                ? "bg-primary/20 border-primary/50 text-primary border"
                : "bg-secondary/30 border-border/30 text-muted-foreground border hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            <span>{tone.emoji}</span>
            <span className="font-medium">{tone.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TonePicker;
