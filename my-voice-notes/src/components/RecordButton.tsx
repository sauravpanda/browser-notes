import { Mic, Square, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button"

interface RecordButtonProps {
  isRecording: boolean;
  isModelLoaded: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function RecordButton({ isRecording, isModelLoaded, onStart, onStop }: RecordButtonProps) {
  return (
    <Button
      variant={isRecording ? "destructive" : "default"}
      size="lg"
      onClick={isRecording ? onStop : onStart}
      disabled={!isModelLoaded}
      className="relative overflow-hidden"
    >
      {!isModelLoaded ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Loading Models...
        </>
      ) : isRecording ? (
        <>
          <Square className="w-5 h-5 mr-2" />
          Stop Recording
          <motion.div
            className="absolute inset-0 bg-red-500 opacity-20"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        </>
      ) : (
        <>
          <Mic className="w-5 h-5 mr-2" />
          Record Note
        </>
      )}
    </Button>
  );
}

