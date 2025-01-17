interface SuggestedActionsProps {
  actions: string[];
}

export default function SuggestedActions({ actions }: SuggestedActionsProps) {
  if (actions.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-gray-700">Suggested Actions</h2>
      <ul className="space-y-2">
        {actions.map((action, index) => (
          <li key={index}>
            <button className="w-full text-left bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-md transition-colors">
              {action}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

