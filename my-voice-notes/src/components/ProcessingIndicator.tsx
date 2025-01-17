import { Loader2 } from 'lucide-react';

export default function ProcessingIndicator() {
  return (
    <div className="flex items-center justify-center my-4 p-4 bg-indigo-50 rounded-lg">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mr-2" />
      <span className="text-indigo-700 font-medium">Processing your note...</span>
    </div>
  );
}

