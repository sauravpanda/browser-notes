import { Tag, Edit2, ChevronDown, ChevronUp, Download } from "lucide-react";
import { VoiceItem } from "../../hooks/useVoiceNotes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface VoiceItemCardProps {
  item: VoiceItem;
  onManageLabels: () => void;
}

export default function VoiceItemCard({
  item,
  onManageLabels,
}: VoiceItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const handleDownload = () => {
    const blob = new Blob([item.text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `voice_note_${item.id || Date.now()}.txt`; // Use item ID or timestamp as filename
    link.click();
    URL.revokeObjectURL(url); // Clean up the URL object
  };
  const getFirstFewWords = (text: string, wordCount: number = 5) => {
    const words = text.split(" "); // Split the text into words
    return words.slice(0, wordCount).join(" "); // Join the first `wordCount` words
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="font-semibold text-lg text-gray-800">
          {getFirstFewWords(item.text)} ...
        </h3>
        <div className="flex items-center space-x-2">
          <Badge
            variant={
              item.priority === 1
                ? "destructive"
                : item.priority === 2
                ? "default"
                : "secondary"
            }
          >
            Priority: {item.priority}
          </Badge>
          <Button variant="ghost" size="sm" onClick={toggleExpand}>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <>
          <CardContent>
            <p className="text-gray-600 mb-4">{item.text}</p>
            <div className="flex flex-wrap gap-2">
              {item.labels.map((label, index) => (
                <Badge key={index} variant="outline">
                  <Tag className="w-3 h-3 mr-1" />
                  {label}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={onManageLabels}>
              <Edit2 className="w-4 h-4 mr-2" />
              Manage Labels
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
