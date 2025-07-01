import { MdEdit } from "react-icons/md";

const TableSkeletonLoader = () => {
  return (
    <div className="border border-gray-500 rounded-md overflow-x-auto mt-6">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-50 text-gray-800 border-b-2 border-gray-300">
          <tr>
            <th className="p-3 text-left font-semibold">Admission No</th>
            <th className="p-3 text-left font-semibold">Student Name</th>
            <th className="p-3 text-left font-semibold">Class</th>
            <th className="p-3 text-left font-semibold">Division</th>
            <th className="p-3 text-left font-semibold">Subject</th>
            <th className="p-3 text-left font-semibold">Term</th>
            <th className="p-3 text-left font-semibold">Part</th>
            <th className="p-3 text-left font-semibold">Assessment</th>
            <th className="p-3 text-left font-semibold">
              <div className="flex items-center gap-2">
                <span>Marks</span>
                <MdEdit className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">(Click to edit)</span>
              </div>
            </th>
            <th className="p-3 text-left font-semibold">Max Marks</th>
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
