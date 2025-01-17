import { useState, useCallback, useRef, useEffect } from 'react';
import { BrowserAI } from '@browserai/browserai';

export interface VoiceItem {
  id: string;
  text: string;
  labels: string[];
  priority: number;
}

interface PerformanceMetrics {
  audioProcessingTime: number;
  transcriptionTime: number;
  analysisTime: number;
  memoryUsage: number;
  totalProcessed: number;
}

interface VoiceNoteState {
  isRecording: boolean;
  currentItem: VoiceItem | null;
  voiceItems: VoiceItem[];
  isProcessing: boolean;
  isModelLoaded: boolean;
  performanceMetrics: PerformanceMetrics;
}

export function useVoiceNotes() {
  const [state, setState] = useState<VoiceNoteState>({
    isRecording: false,
    currentItem: null,
    voiceItems: [],
    isProcessing: false,
    isModelLoaded: false,
    performanceMetrics: {
      audioProcessingTime: 0,
      transcriptionTime: 0,
      analysisTime: 0,
      memoryUsage: 0,
      totalProcessed: 0,
    },
  });

  const audioAIRef = useRef<BrowserAI>();
  const chatAIRef = useRef<BrowserAI>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Initialize BrowserAI instances
  useEffect(() => {
    audioAIRef.current = new BrowserAI();
    chatAIRef.current = new BrowserAI();
    
    const loadModels = async () => {
      try {
        await audioAIRef.current?.loadModel('whisper-tiny-en');
        await chatAIRef.current?.loadModel('smollm2-135m-instruct');
        setState(prev => ({ ...prev, isModelLoaded: true }));
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    loadModels();

  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
      setState(prev => ({ ...prev, isRecording: true }));
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current) return;

    setState(prev => ({ ...prev, isRecording: false, isProcessing: true }));
    const startTime = performance.now();

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = async () => {
      try {
        // Audio processing timing
        const audioStartTime = performance.now();
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioEndTime = performance.now();
        const audioProcessingTime = audioEndTime - audioStartTime;

        // Transcription timing
        const transcriptionStartTime = performance.now();
        const transcription = await audioAIRef.current?.transcribeAudio(audioBlob);
        const transcriptionEndTime = performance.now();
        const transcriptionTime = transcriptionEndTime - transcriptionStartTime;
        
        if (transcription?.text) {
          // Analysis timing
          const analysisStartTime = performance.now();
          const prompt = `Analyze this note and suggest up to 3 relevant labels from the following list: Reminders (Personal), Shopping List, To-Do List (Personal), Ideas (Personal), Journal/Reflections, Health, Finances, Travel, Home, Relationships, Entertainment, Recipes, Dreams, Meeting Notes, Project Notes, Tasks/Action Items (Work), Client Notes, Ideas (Work), Research, Training. Also assign a priority level (1-3, where 1 is highest priority). Format the response as JSON with "labels" array and "priority" number. Note text: "${transcription.text}"`;
          const analysis = await chatAIRef.current?.generateText(prompt, {
            maxTokens: 1000,
            temperature: 0.3,
            system_prompt: "You are a helpful assistant that analyzes notes and returns only valid JSON responses."
          });
          const analysisEndTime = performance.now();
          const analysisTime = analysisEndTime - analysisStartTime;

          let labels: string[] = [];
          let priority: number = 2;
          console.log(analysis);
          try {
            const parsedAnalysis = JSON.parse(analysis?.toString() || '{}');
            labels = parsedAnalysis.labels || [];
            priority = parsedAnalysis.priority || 2;
          } catch (error) {
            console.error('Error parsing AI analysis:', error);
          }

          const newItem: VoiceItem = {
            id: Date.now().toString(),
            text: transcription.text,
            labels,
            priority,
          };

          setState(prev => ({
            ...prev,
            currentItem: newItem,
            voiceItems: [...prev.voiceItems, newItem],
            isProcessing: false,
            performanceMetrics: {
              audioProcessingTime,
              transcriptionTime,
              analysisTime,
              memoryUsage: prev.performanceMetrics.memoryUsage,
              totalProcessed: prev.performanceMetrics.totalProcessed + 1,
            },
          }));
        }
      } catch (error) {
        console.error('Error processing audio:', error);
        setState(prev => ({ ...prev, isProcessing: false }));
      }
    };
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
  };
}

