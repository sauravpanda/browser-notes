import { useState } from 'react';
import { Tag, X, Search } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface LabelSelectorProps {
  labels: string[];
  onLabelsChange: (labels: string[]) => void;
  allLabels: string[];
}

export default function LabelSelector({ labels, onLabelsChange, allLabels }: LabelSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLabels = allLabels.filter(
    label => label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleLabel = (label: string) => {
    if (labels.includes(label)) {
      onLabelsChange(labels.filter(l => l !== label));
    } else {
      onLabelsChange([...labels, label]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search labels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {labels.map((label) => (
          <Badge key={label} variant="secondary">
            {label}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleLabel(label)}
              className="ml-1 h-auto p-0 text-gray-500 hover:text-gray-700"
            >
              <X className="w-3 h-3" />
              <span className="sr-only">Remove {label} label</span>
            </Button>
          </Badge>
        ))}
      </div>
      <div className="max-h-60 overflow-y-auto border rounded-md">
        {filteredLabels.map((label) => (
          <Button
            key={label}
            variant="ghost"
            onClick={() => toggleLabel(label)}
            className={`flex items-center justify-start w-full px-4 py-2 text-left ${
              labels.includes(label) ? 'bg-blue-50 text-blue-700' : ''
            }`}
          >
            <Tag className={`w-4 h-4 mr-2 ${labels.includes(label) ? 'text-blue-500' : 'text-gray-500'}`} />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}

