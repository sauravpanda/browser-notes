import { Tag, Edit2 } from 'lucide-react';
import { VoiceItem } from '../../hooks/useVoiceNotes';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface VoiceItemCardProps {
  item: VoiceItem;
  onManageLabels: () => void;
}

export default function VoiceItemCard({ item, onManageLabels }: VoiceItemCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="font-semibold text-lg text-gray-800">Voice Note</h3>
        <Badge variant={item.priority === 1 ? "destructive" : item.priority === 2 ? "default" : "secondary"}>
          Priority: {item.priority}
        </Badge>
      </CardHeader>
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
      </CardFooter>
    </Card>
  );
}

