// FilterSkeleton.jsx
const FilterSkeleton = () => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-300 mb-8">
      {/* First Row - 4 dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
            <div className="h-11 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Second Row - 3 dropdowns + button area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
            <div className="h-11 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        ))}
        <div className="flex items-end gap-3">
          <div className="flex-1 h-11 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default FilterSkeleton;
