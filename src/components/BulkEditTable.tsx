import { useState, useEffect } from "react";
import type { Mark } from "../types/mark.types";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoWarningOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { Save, RefreshCw } from "lucide-react";
import TableSkeletonLoader from "./TableSkeletonLoader";
import Pagination from "./Pagination";
import { toast } from "sonner";

interface BulkEditTableProps {
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
  onBulkUpdate: (updates: { slno: string; mark: number }[]) => Promise<void>;
  isUpdatingMark?: boolean;
}

const BulkEditTable = ({
  data,
  isLoading,
  isError,
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
  onBulkUpdate,
  isUpdatingMark = false,
}: BulkEditTableProps) => {
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pageSizeOptions = [10, 20, 50, 100];

  // Initialize edit data when data changes
  useEffect(() => {
    if (data?.results) {
      const initialData: Record<string, string> = {};
      data.results.forEach((mark) => {
        initialData[mark.slno] = mark.mark.toString();
      });
      setEditData(initialData);
      setHasChanges(false);
      setErrors({});
    }
  }, [data]);

  const handleMarkChange = (slno: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [slno]: value,
    }));
    setHasChanges(true);

    // Clear error for this field
    if (errors[slno]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[slno];
        return newErrors;
      });
    }
  };

  const validateChanges = () => {
    if (!data?.results) return false;

    const newErrors: Record<string, string> = {};
    let hasValidationErrors = false;

    data.results.forEach((mark) => {
      const newValue = editData[mark.slno];
      const numValue = parseFloat(newValue);
      const maxMark = Number(mark.maxmark);

      if (isNaN(numValue)) {
        newErrors[mark.slno] = "Please enter a valid number";
        hasValidationErrors = true;
      } else if (numValue < 0) {
        newErrors[mark.slno] = "Mark cannot be negative";
        hasValidationErrors = true;
      } else if (numValue > maxMark) {
        newErrors[mark.slno] = `Cannot exceed maximum mark of ${maxMark}`;
        hasValidationErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasValidationErrors;
  };

  const handleBulkSave = async () => {
    if (!data?.results) return;

    if (!validateChanges()) {
      toast.error("Please fix validation errors before saving");
      return;
    }

    // Get only changed marks
    const changes = data.results
      .filter((mark) => {
        const newValue = parseFloat(editData[mark.slno]);
        return newValue !== mark.mark;
      })
      .map((mark) => ({
        slno: mark.slno,
        mark: parseFloat(editData[mark.slno]),
      }));

    if (changes.length === 0) {
      toast.info("No changes to save");
      return;
    }

    try {
      await onBulkUpdate(changes);
      setHasChanges(false);
      toast.success(`Successfully updated ${changes.length} marks`);
    } catch (error) {
      console.error("Failed to update marks:", error);
      toast.error("Failed to update marks. Please try again.");
    }
  };

  const handleReset = () => {
    if (data?.results) {
      const resetData: Record<string, string> = {};
      data.results.forEach((mark) => {
        resetData[mark.slno] = mark.mark.toString();
      });
      setEditData(resetData);
      setHasChanges(false);
      setErrors({});
      toast.info("Changes reset");
    }
  };

  if (isLoading) {
    return <TableSkeletonLoader />;
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

  return (
    <div className="rounded-md overflow-hidden mt-6 shadow-sm border border-gray-300">
      {/* Bulk Actions Header */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MdEdit className="h-5 w-5 text-blue-600" />
          <span className="text-blue-800 font-medium">Bulk Edit Mode</span>
          <span className="text-sm text-blue-600">
            - Edit multiple marks and save all at once
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={!hasChanges || isUpdatingMark}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Changes
          </button>
          <button
            onClick={handleBulkSave}
            disabled={!hasChanges || isUpdatingMark}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUpdatingMark ? (
              <AiOutlineLoading3Quarters className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save All Changes
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto rounded-md">
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
                  <span className="text-xs text-gray-500">(Editable)</span>
                </div>
              </th>
              <th className="p-3 text-left font-semibold">Max Marks</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.results.map((mark, index) => {
              const hasError = errors[mark.slno];
              const isChanged =
                parseFloat(editData[mark.slno] || "0") !== mark.mark;

              return (
                <tr
                  key={mark.slno}
                  className={`border-b hover:bg-gray-50 transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  } ${hasError ? "bg-red-50" : ""} ${
                    isChanged ? "bg-yellow-50" : ""
                  }`}
                >
                  <td className="p-2 font-semibold text-gray-900 bg-[#ffe3e3] border border-[#ffa8a8]">
                    {mark.admission}
                  </td>
                  <td className="p-2 font-semibold text-gray-900 bg-[#fff3bf] border border-[#ffe066]">
                    {mark.student_name}
                  </td>
                  <td className="p-2 text-gray-700 border border-gray-300 text-center">
                    {mark.class_field}
                  </td>
                  <td className="p-2 text-gray-700 border border-gray-300 text-center">
                    {mark.division}
                  </td>
                  <td className="p-2 text-gray-700 border border-gray-300">
                    {mark.subject_name}
                  </td>
                  <td className="p-2 text-gray-700 border border-gray-300">
                    {mark.term}
                  </td>
                  <td className="p-2 text-gray-700 border border-gray-300">
                    {mark.part}
                  </td>
                  <td className="p-2 text-gray-700 border-b border-l border-gray-300">
                    {mark.assessmentitem_name}
                  </td>

                  <td className="p-2 relative bg-blue-100 font-semibold text-right border border-blue-600">
                    <div className="flex flex-col gap-1">
                      <input
                        type="number"
                        value={editData[mark.slno] || ""}
                        onChange={(e) =>
                          handleMarkChange(mark.slno, e.target.value)
                        }
                        className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none text-center font-semibold bg-white shadow-sm ${
                          hasError
                            ? "border-red-300 focus:border-red-500"
                            : isChanged
                            ? "border-yellow-300 focus:border-yellow-500"
                            : "border-blue-300 focus:border-blue-500"
                        }`}
                        min="0"
                        max={mark.maxmark}
                        step="0.001"
                        disabled={isUpdatingMark}
                        style={{ fontSize: "14px" }}
                      />
                      {hasError && (
                        <div className="text-xs text-red-600 text-center">
                          {hasError}
                        </div>
                      )}
                      {isChanged && !hasError && (
                        <div className="text-xs text-yellow-600 text-center">
                          Changed
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-2 text-gray-600 font-semibold bg-[#d3f9d8] text-right border border-[#a9e34b]">
                    {mark.maxmark}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Global Error Message */}
      {Object.keys(errors).length > 0 && (
        <div className="p-3 bg-red-50 border-t border-red-200 flex items-center gap-2">
          <IoWarningOutline className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">
            Please fix {Object.keys(errors).length} validation error(s) before
            saving.
          </p>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
        {/* Results Info and Page Size Selector */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700 font-sans">
            Showing {startItem} to {endItem} of {totalItems} results
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 font-sans">Show:</label>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700 font-sans">entries</span>
          </div>
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default BulkEditTable;
