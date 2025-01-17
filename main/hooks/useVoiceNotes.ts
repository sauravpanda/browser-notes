import { useState, useCallback } from 'react';

export interface VoiceItem {
  id: string;
  text: string;
  labels: string[];
  priority: number;
}

interface VoiceNoteState {
  isRecording: boolean;
  currentItem: VoiceItem | null;
  voiceItems: VoiceItem[];
  isProcessing: boolean;
}

const sampleVoiceNotes: VoiceItem[] = [
  {
    id: '1',
    text: "Remember to buy groceries, milk and bread, and also schedule a doctor's appointment next week.",
    labels: ['Shopping List', 'Health', 'Reminders (Personal)'],
    priority: 2,
  },
  {
    id: '2',
    text: "Prepare presentation for the team meeting on Friday. Include Q2 results and projections for Q3.",
    labels: ['Meeting Notes', 'Tasks/Action Items (Work)', 'Important'],
    priority: 1,
  },
  {
    id: '3',
    text: "Book flights and hotel for the conference in San Francisco next month. Check if budget approval is needed.",
    labels: ['Travel', 'Work', 'Action Items'],
    priority: 3,
  }
];

export function useVoiceNotes() {
  const [state, setState] = useState<VoiceNoteState>({
    isRecording: false,
    currentItem: null,
    voiceItems: [],
    isProcessing: false,
  });

  const startRecording = useCallback(() => {
    setState(prev => ({ ...prev, isRecording: true }));
  }, []);

  const stopRecording = useCallback(() => {
    setState(prev => ({ ...prev, isRecording: false, isProcessing: true }));
    // Simulate transcription and LLM processing
    setTimeout(() => {
      const newItem = sampleVoiceNotes[state.voiceItems.length % sampleVoiceNotes.length];
      setState(prev => ({
        ...prev,
        currentItem: newItem,
        voiceItems: [...prev.voiceItems, newItem],
        isProcessing: false,
      }));
    }, 2000);
  }, [state.voiceItems.length]);

  return {
    ...state,
    startRecording,
    stopRecording,
  };
}

