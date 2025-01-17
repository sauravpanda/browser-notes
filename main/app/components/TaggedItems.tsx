import { Tag } from 'lucide-react';

interface TaggedItem {
  text: string;
  tag: string;
  priority: number;
}

interface TaggedItemsProps {
  items: TaggedItem[];
}

export default function TaggedItems({ items }: TaggedItemsProps) {
  if (items.length === 0) return null;

  const sortedItems = [...items].sort((a, b) => a.priority - b.priority);

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">Tagged Items</h2>
      <ul className="space-y-2">
        {sortedItems.map((item, index) => (
          <li key={index} className="flex items-center bg-gray-50 p-2 rounded-md">
            <Tag className="w-4 h-4 mr-2 text-blue-500" />
            <span className="flex-grow">{item.text}</span>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {item.tag}
            </span>
            <span className="ml-2 text-sm text-gray-500">Priority: {item.priority}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

