const TableSkeletonLoader = () => {
  return (
    <div className="border border-gray-500 rounded-md overflow-x-auto mt-6">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-[#2c7be5] text-white">
          <tr>
            <th className="p-3 text-left">Admission No</th>
            <th className="p-3 text-left">Student Name</th>
            <th className="p-3 text-left">Class</th>
            <th className="p-3 text-left">Division</th>
            <th className="p-3 text-left">Subject</th>
            <th className="p-3 text-left">Term</th>
            <th className="p-3 text-left">Part</th>
            <th className="p-3 text-left">Assessment</th>
            <th className="p-3 text-left">Max Marks</th>
            <th className="p-3 text-left">Marks</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(8)].map((_, i) => (
            <tr key={i} className="border-b">
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeletonLoader;
