'use client'

import { useState, useEffect } from 'react';
import { Activity, Clock, Cpu } from 'lucide-react';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

interface PerformanceData {
  audioProcessingTime: number;
  transcriptionTime: number;
  analysisTime: number;
  memoryUsage: number;
  totalProcessed: number;
}

interface PerformanceMetricsProps {
  data?: PerformanceData;
  isProcessing?: boolean;
}

export default function PerformanceMetrics({ data, isProcessing }: PerformanceMetricsProps) {
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);
  const [processingTimes, setProcessingTimes] = useState<number[]>([]);
  const [averageProcessingTime, setAverageProcessingTime] = useState<number>(0);

  useEffect(() => {
    const updateMemoryUsage = () => {
      if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
        try {
          // @ts-ignore: Chrome-specific API
          const usedMemory = Math.round(performance.memory.usedJSHeapSize / (1024 * 1024));
          setMemoryUsage(usedMemory);
        } catch (error) {
          console.warn('Memory usage measurement not supported');
          setMemoryUsage(null);
        }
      }
    };

    updateMemoryUsage();
    const intervalId = setInterval(updateMemoryUsage, 2000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (data) {
      const totalTime = data.audioProcessingTime + data.transcriptionTime + data.analysisTime;
      setProcessingTimes(prev => [...prev, totalTime].slice(-5)); // Keep last 5 times
    }
  }, [data]);

  useEffect(() => {
    if (processingTimes.length > 0) {
      const average = processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;
      setAverageProcessingTime(average);
    }
  }, [processingTimes]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="fixed top-4 right-4 bg-white rounded-lg shadow-md p-4 min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Performance Metrics</span>
            </div>
            
            <div className="space-y-3">
              {/* Memory Usage */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Memory className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Memory</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {memoryUsage !== null ? `${memoryUsage} MB` : 'N/A'}
                </span>
              </div>

              {/* Processing Times */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Avg. Processing</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {averageProcessingTime > 0 ? `${averageProcessingTime.toFixed(1)}ms` : 'N/A'}
                </span>
              </div>

              {/* Current Processing */}
              {data && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Audio Processing</span>
                    <span>{data.audioProcessingTime.toFixed(1)}ms</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Transcription</span>
                    <span>{data.transcriptionTime.toFixed(1)}ms</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Analysis</span>
                    <span>{data.analysisTime.toFixed(1)}ms</span>
                  </div>
                </div>
              )}

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="ml-2 text-xs text-blue-500">Processing...</span>
                </div>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" align="center">
          <div className="text-sm">
            <p>Memory Usage: System memory consumption</p>
            <p>Processing Time: Average time to process voice notes</p>
            {data?.totalProcessed && (
              <p>Total Processed: {data.totalProcessed} notes</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

