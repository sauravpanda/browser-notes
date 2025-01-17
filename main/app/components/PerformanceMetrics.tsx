'use client'

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function PerformanceMetrics() {
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);
  const [audioToTextTime, setAudioToTextTime] = useState<number | null>(null);
  const [parsingTime, setParsingTime] = useState<number | null>(null);

  useEffect(() => {
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        // @ts-ignore: Unreachable code error
        setMemoryUsage(Math.round(performance.memory.usedJSHeapSize / (1024 * 1024)));
      }
    };

    updateMemoryUsage();
    const intervalId = setInterval(updateMemoryUsage, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Simulate audio-to-text and parsing times
    setAudioToTextTime(Math.random() * 2 + 1);
    setParsingTime(Math.random() * 1 + 0.5);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="fixed top-4 right-4 bg-white rounded-lg shadow-md p-3 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Performance</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="end" className="bg-white p-4 rounded-lg shadow-lg max-w-xs">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Memory Usage: {memoryUsage !== null ? `${memoryUsage} MB` : 'N/A'}</p>
            <p className="text-sm font-medium text-gray-700">Audio to Text: {audioToTextTime !== null ? `${audioToTextTime.toFixed(2)}s` : 'N/A'}</p>
            <p className="text-sm font-medium text-gray-700">Parsing Time: {parsingTime !== null ? `${parsingTime.toFixed(2)}s` : 'N/A'}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

