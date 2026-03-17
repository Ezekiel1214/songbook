import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface SkeletonLoaderProps {
  stage: string;
  progress: number;
}

const SkeletonLoader = ({ stage, progress }: SkeletonLoaderProps) => {
  return (
    <motion.div
      className="max-w-lg mx-auto text-center space-y-8 glass-panel p-8 md:p-10 rounded-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Book animation */}
      <div className="relative">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse-soft">
          <span className="text-4xl">📖</span>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-serif font-bold text-foreground">{stage}</h2>
        <p className="text-sm text-muted-foreground">This may take a minute...</p>
      </div>

      <Progress value={progress} className="h-2 bg-secondary" />

      {/* Skeleton story preview */}
      <div className="flex gap-4 mt-6">
        <div className="flex-1 rounded-xl overflow-hidden">
          <div className="h-32 skeleton-shimmer rounded-lg" />
        </div>
        <div className="flex-1 space-y-3 py-2">
          <div className="h-4 w-3/4 skeleton-shimmer rounded" />
          <div className="h-3 w-full skeleton-shimmer rounded" />
          <div className="h-3 w-5/6 skeleton-shimmer rounded" />
          <div className="h-3 w-2/3 skeleton-shimmer rounded" />
        </div>
      </div>
    </motion.div>
  );
};

export default SkeletonLoader;
