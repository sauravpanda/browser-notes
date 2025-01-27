"use client";

import { useState } from "react";
import { useVoiceNotes } from "../hooks/useVoiceNotes";
import RecordButton from "./components/RecordButton";
import ProcessingIndicator from "./components/ProcessingIndicator";
import VoiceItemCard from "./components/VoiceItemCard";
import LabelSelector from "./components/LabelSelector";
import { Plus, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PerformanceMetrics from "./components/PerformanceMetrics";

const ALL_LABELS = [
  "Reminders (Personal)",
  "Shopping List",
  "To-Do List (Personal)",
  "Ideas (Personal)",
  "Journal/Reflections",
  "Health",
  "Finances",
  "Travel",
  "Home",
  "Relationships",
  "Entertainment",
  "Recipes",
  "Dreams",
  "Meeting Notes",
  "Project Notes",
  "Tasks/Action Items (Work)",
  "Client Notes",
  "Ideas (Work)",
  "Research",
  "Training",
  "Feedback",
  "Planning",
  "Email Drafts/Reminders",
  "Course Notes",
  "Book Notes",
  "Article Notes",
  "Language Learning",
  "Skills Development",
  "Writing Ideas",
  "Music Ideas",
  "Art Ideas",
  "Design Ideas",
  "Action Items",
  "Questions",
  "Follow-up",
  "Decisions",
  "Important",
  "Urgent",
  "Reference",
  "Quotes",
  "Inspiration",
];

export default function Home() {
  const {
    isRecording,
    isModelLoaded,
    currentItem,
    voiceItems,
    isProcessing,
    performanceMetrics,
    startRecording,
    stopRecording,
  } = useVoiceNotes();

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);

  const handleLabelsChange = (newLabels: string[]) => {
    if (selectedItemIndex !== null) {
      const updatedItems = [...voiceItems];
      updatedItems[selectedItemIndex] = {
        ...updatedItems[selectedItemIndex],
        labels: newLabels,
      };
      // You would typically update the state here. For now, we'll just log the change.
      console.log("Updated items:", updatedItems);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 text-indigo-900">
            Smart Voice Notes
          </h1>
          <p className="text-lg text-indigo-700">
            Capture your thoughts, organize your life
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <RecordButton
              isRecording={isRecording}
              isModelLoaded={isModelLoaded}
              onStart={startRecording}
              onStop={stopRecording}
            />
          </div>
          {isProcessing && <ProcessingIndicator />}
        </div>

        <AnimatePresence>
          {voiceItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <VoiceItemCard
                item={item}
                onManageLabels={() => {
                  setSelectedItemIndex(index);
                  setIsLabelModalOpen(true);
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {voiceItems.length === 0 && (
          <div className="text-center py-12">
            <Mic className="w-16 h-16 mx-auto text-indigo-300 mb-4" />
            <p className="text-xl text-gray-600">
              No voice notes yet. Start recording!
            </p>
          </div>
        )}

        <Dialog open={isLabelModalOpen} onOpenChange={setIsLabelModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Labels</DialogTitle>
              <DialogDescription>
                Add or remove labels for this voice note.
              </DialogDescription>
            </DialogHeader>
            {selectedItemIndex !== null && (
              <LabelSelector
                labels={voiceItems[selectedItemIndex].labels}
                onLabelsChange={handleLabelsChange}
                allLabels={ALL_LABELS}
              />
            )}
            <Button onClick={() => setIsLabelModalOpen(false)}>Close</Button>
          </DialogContent>
        </Dialog>
        <PerformanceMetrics
          data={performanceMetrics}
          isProcessing={isProcessing}
        />
      </div>
    </main>
  );
}
