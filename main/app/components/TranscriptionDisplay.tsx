interface TranscriptionDisplayProps {
  transcription: string;
}

export default function TranscriptionDisplay({ transcription }: TranscriptionDisplayProps) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">Transcription</h2>
      <div className="bg-gray-100 p-3 rounded-md min-h-[100px]">
        {transcription || 'Your transcription will appear here...'}
      </div>
    </div>
  );
}

