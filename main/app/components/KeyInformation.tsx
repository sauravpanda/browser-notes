interface KeyInformationProps {
  information: { [key: string]: string };
}

export default function KeyInformation({ information }: KeyInformationProps) {
  if (Object.keys(information).length === 0) return null;

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">Key Information</h2>
      <ul className="list-disc pl-5">
        {Object.entries(information).map(([key, value], index) => (
          <li key={index} className="text-gray-600">
            <span className="font-medium">{key}:</span> {value}
          </li>
        ))}
      </ul>
    </div>
  );
}

