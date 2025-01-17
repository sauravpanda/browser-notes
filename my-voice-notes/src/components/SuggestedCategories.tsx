interface SuggestedCategoriesProps {
  categories: string[];
}

export default function SuggestedCategories({ categories }: SuggestedCategoriesProps) {
  if (categories.length === 0) return null;

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">Suggested Categories</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            {category}
          </span>
        ))}
      </div>
    </div>
  );
}

