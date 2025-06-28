import { useState } from "react";
import type { Mark } from "../types/mark.types";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { MdEdit, MdVisibility } from "react-icons/md";
import EditMarkModal from "./EditMarkModal";

interface MarksTableProps {
  data:
    | {
        count: number;
        next: string | null;
        previous: string | null;
        results: Mark[];
      }
    | undefined;
  isLoading: boolean;
  isError: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  onMarkUpdate: (id: string, newMark: number) => Promise<void>;
  isUpdatingMark?: boolean;
}

const MarksTable = ({
  data,
  isLoading,
  isError,
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
  onMarkUpdate,
  isUpdatingMark = false,
}: MarksTableProps) => {
  const [selectedMark, setSelectedMark] = useState<Mark | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (mark: Mark) => {
    setSelectedMark(mark);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMark(null);
  };

  const pageSizeOptions = [10, 20, 50, 100];

  if (isLoading) {
    return (
      <div className="border rounded-md overflow-x-auto mt-6">
        <table className="w-full table-auto">
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
              <th className="p-3 text-left">Marks</th>
              <th className="p-3 text-left">Grade</th>
              <th className="p-3 text-left">Max Marks</th>
              <th className="p-3 text-left">Actions</th>
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
  }

  if (isError) {
    return (
      <div className="mt-6 p-8 text-center">
        <div className="text-red-500 text-lg font-medium mb-2">
          ⚠️ Error fetching marks
        </div>
        <p className="text-gray-600">
          Something went wrong while loading the marks data. Please try again.
        </p>
      </div>
    );
  }

  if (!data || data.results.length === 0) {
    return (
      <div className="mt-6 p-8 text-center">
        <div className="text-gray-500 text-lg font-medium mb-2">
          📊 No marks found
        </div>
        <p className="text-gray-600">
          No marks match your current filter selection. Try adjusting your
          filters.
        </p>
      </div>
    );
  }

  // Calculate pagination values
  const totalItems = data.count;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <>
      <div className="border rounded-md overflow-hidden mt-6 shadow-sm">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-[#2c7be5] text-white">
              <tr>
                <th className="p-3 text-left font-semibold">Admission No</th>
                <th className="p-3 text-left font-semibold">Student Name</th>
                <th className="p-3 text-left font-semibold">Class</th>
                <th className="p-3 text-left font-semibold">Division</th>
                <th className="p-3 text-left font-semibold">Subject</th>
                <th className="p-3 text-left font-semibold">Term</th>
                <th className="p-3 text-left font-semibold">Part</th>
                <th className="p-3 text-left font-semibold">Assessment</th>
                <th className="p-3 text-left font-semibold">Marks</th>
                <th className="p-3 text-left font-semibold">Grade</th>
                <th className="p-3 text-left font-semibold">Max Marks</th>
                <th className="p-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.results.map((mark, index) => (
                <tr
                  key={mark.slno}
                  className={`border-b hover:bg-gray-50 transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="p-3 font-medium text-gray-900">
                    {mark.admission}
                  </td>
                  <td className="p-3 text-gray-900">{mark.student_name}</td>
                  <td className="p-3 text-gray-700">{mark.class_field}</td>
                  <td className="p-3 text-gray-700">{mark.division}</td>
                  <td className="p-3 text-gray-700">{mark.subject_name}</td>
                  <td className="p-3 text-gray-700">{mark.term}</td>
                  <td className="p-3 text-gray-700">{mark.part}</td>
                  <td className="p-3 text-gray-700">
                    {mark.assessmentitem_name}
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-blue-600">
                      {mark.mark}
                    </span>
                  </td>
                  <td className="p-3">{mark.grade}</td>
                  <td className="p-3 text-gray-600">{mark.maxmark}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(mark)}
                        className="group relative p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-105"
                        title="View & Edit Details"
                      >
                        <MdVisibility className="h-4 w-4" />
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                          View Details
                        </span>
                      </button>
                      <button
                        onClick={() => handleViewDetails(mark)}
                        className="group relative p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200 transform hover:scale-105"
                        title="Quick Edit"
                      >
                        <MdEdit className="h-4 w-4" />
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                          Edit Mark
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between">
          {/* Results Info and Page Size Selector */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing {startItem} to {endItem} of {totalItems} results
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Show:</label>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center space-x-1">
              {/* First Page */}
              <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                title="First Page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>

              {/* Previous Page */}
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                title="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof page === "number" && onPageChange(page)
                    }
                    disabled={page === "..."}
                    className={`px-3 py-2 text-sm rounded-md transition-colors duration-200 min-w-[40px] ${
                      page === currentPage
                        ? "bg-[#2c7be5] text-white"
                        : page === "..."
                        ? "cursor-default text-gray-400"
                        : "hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Page */}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                title="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                title="Last Page"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Mark Modal */}
      <EditMarkModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mark={selectedMark}
        onMarkUpdate={onMarkUpdate}
        isUpdating={isUpdatingMark}
      />
    </>
  );
};

export default MarksTable;
