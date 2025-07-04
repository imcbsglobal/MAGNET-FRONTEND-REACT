import { useState } from "react";
import type { Mark } from "../types/mark.types";
import { useSettingsStore } from "../stores/useSettingsStore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCheckmarkCircle, IoWarningOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { Check, X, Save, Trash2 } from "lucide-react";
import TableSkeletonLoader from "./TableSkeletonLoader";
import Pagination from "./Pagination";

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
  onBulkMarkUpdate: (
    updates: { slno: string; mark: number }[]
  ) => Promise<void>;
  isUpdatingMark?: boolean;
  isBulkUpdating?: boolean;
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
  onBulkMarkUpdate,
  isUpdatingMark = false,
  isBulkUpdating = false,
}: MarksTableProps) => {
  const { editMode } = useSettingsStore();

  // Single edit mode states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState<string | null>(null);
  const [updatedMarks, setUpdatedMarks] = useState<Record<string, number>>({});

  // Bulk edit mode states
  const [bulkEdits, setBulkEdits] = useState<Record<string, number>>({});
  const [bulkEditValues, setBulkEditValues] = useState<Record<string, string>>(
    {}
  );
  const [bulkErrors, setBulkErrors] = useState<Record<string, string>>({});
  const [bulkSuccess, setBulkSuccess] = useState(false);

  const pageSizeOptions = [10, 20, 50, 100];

  // Single edit handlers
  const handleEditStart = (mark: Mark) => {
    setEditingId(mark.slno);
    setEditValue(mark.mark.toString());
    setError("");
    setSuccessId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue("");
    setError("");
  };

  const handleEditSave = async (mark: Mark) => {
    const newMark = parseFloat(editValue);
    const maxMark = Number(mark.maxmark);

    // Validation
    if (isNaN(newMark)) {
      setError("Please enter a valid number");
      return;
    }

    if (newMark === mark.mark) {
      setEditingId(null);
      setEditValue("");
      return;
    }

    if (newMark < 0) {
      setError("Mark cannot be negative");
      return;
    }

    if (newMark > maxMark) {
      setError(`Mark cannot exceed maximum mark of ${maxMark}`);
      return;
    }

    try {
      setError("");
      await onMarkUpdate(mark.slno, newMark);

      setUpdatedMarks((prev) => ({
        ...prev,
        [mark.slno]: newMark,
      }));

      setSuccessId(mark.slno);
      setEditingId(null);
      setEditValue("");

      setTimeout(() => {
        setSuccessId(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to update mark:", error);
      setError("Failed to update mark. Please try again.");
    }
  };

  // Bulk edit handlers
  const handleBulkEditChange = (mark: Mark, value: string) => {
    setBulkEditValues((prev) => ({
      ...prev,
      [mark.slno]: value,
    }));

    const newMark = parseFloat(value);
    const maxMark = Number(mark.maxmark);

    // Clear previous error
    setBulkErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[mark.slno];
      return newErrors;
    });

    // Validation
    if (value === "") {
      // Allow empty values (will be ignored during save)
      setBulkEdits((prev) => {
        const newEdits = { ...prev };
        delete newEdits[mark.slno];
        return newEdits;
      });
      return;
    }

    if (isNaN(newMark)) {
      setBulkErrors((prev) => ({
        ...prev,
        [mark.slno]: "Invalid number",
      }));
      return;
    }

    if (newMark < 0) {
      setBulkErrors((prev) => ({
        ...prev,
        [mark.slno]: "Cannot be negative",
      }));
      return;
    }

    if (newMark > maxMark) {
      setBulkErrors((prev) => ({
        ...prev,
        [mark.slno]: `Max: ${maxMark}`,
      }));
      return;
    }

    // Valid mark - add to bulk edits
    setBulkEdits((prev) => ({
      ...prev,
      [mark.slno]: newMark,
    }));
  };

  const handleBulkSave = async () => {
    if (Object.keys(bulkEdits).length === 0) {
      setError("No changes to save");
      return;
    }

    // Check for any errors
    if (Object.keys(bulkErrors).length > 0) {
      setError("Please fix all errors before saving");
      return;
    }

    // Validate that onBulkMarkUpdate is a function
    if (typeof onBulkMarkUpdate !== "function") {
      console.error("onBulkMarkUpdate is not a function:", onBulkMarkUpdate);
      setError("Bulk update function is not properly configured");
      return;
    }

    try {
      setError("");
      const updates = Object.entries(bulkEdits).map(([slno, mark]) => ({
        slno,
        mark,
      }));

      console.log("Attempting bulk update with:", updates);
      await onBulkMarkUpdate(updates);

      // Update local state
      setUpdatedMarks((prev) => ({
        ...prev,
        ...bulkEdits,
      }));

      // Clear bulk edit state
      setBulkEdits({});
      setBulkEditValues({});
      setBulkErrors({});
      setBulkSuccess(true);

      setTimeout(() => {
        setBulkSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to update marks:", error);
      setError("Failed to update marks. Please try again.");
    }
  };

  const handleBulkReset = () => {
    setBulkEdits({});
    setBulkEditValues({});
    setBulkErrors({});
    setError("");
  };

  const handleMarkClick = (mark: Mark) => {
    if (editMode === "single" && editingId === null && !isUpdatingMark) {
      handleEditStart(mark);
    }
  };

  const getDisplayMark = (mark: Mark) => {
    const value = Number(updatedMarks[mark.slno] ?? mark.mark);
    if (isNaN(value)) return "-";
    return value.toFixed(3);
  };

  const getBulkDisplayValue = (mark: Mark) => {
    return bulkEditValues[mark.slno] ?? "";
  };

  const hasBulkChanges = Object.keys(bulkEdits).length > 0;

  const handleBulkKeyDown = (
    e: React.KeyboardEvent,
    mark: Mark, // Changed parameter name for clarity
    currentIndex: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextIndex = currentIndex + 1;
      if (data && nextIndex < data.results.length) {
        // Added data check
        const nextSlno = data.results[nextIndex].slno;
        // Focus the next input
        const nextInput = document.querySelector(
          `input[data-slno="${nextSlno}"]`
        ) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
    console.debug(mark);
  };

  // Add debug logging
  console.log("MarksTable props:", {
    onMarkUpdate: typeof onMarkUpdate,
    onBulkMarkUpdate: typeof onBulkMarkUpdate,
    editMode,
    hasBulkChanges,
  });

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

  const totalItems = data.count;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="rounded-md overflow-hidden mt-6 shadow-sm border border-gray-300">
      {/* Bulk Edit Header */}
      {editMode === "bulk" && (
        <div className="bg-blue-50 border-b border-blue-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-blue-800">
              Bulk Edit Mode - {Object.keys(bulkEdits).length} changes pending
            </div>
            {bulkSuccess && (
              <div className="flex items-center gap-2 text-green-600">
                <IoCheckmarkCircle className="h-4 w-4" />
                <span className="text-sm font-medium">All changes saved!</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkReset}
              disabled={!hasBulkChanges || isBulkUpdating}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={handleBulkSave}
              disabled={
                !hasBulkChanges ||
                isBulkUpdating ||
                Object.keys(bulkErrors).length > 0
              }
              className="flex items-center gap-1 px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isBulkUpdating ? (
                <AiOutlineLoading3Quarters className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save All ({Object.keys(bulkEdits).length})
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto rounded-md">
          <thead className="bg-gray-50 text-gray-800 border-b-2 border-gray-300">
            <tr>
              <th className="p-3 text-left font-semibold">Student Name</th>
              <th className="p-3 text-left font-semibold">
                <div className="flex items-center gap-2">
                  <span>Marks</span>
                  <MdEdit className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-500">
                    ({editMode === "single" ? "Click to edit" : "Edit inline"})
                  </span>
                </div>
              </th>
              <th className="p-3 text-left font-semibold">Max Marks</th>
              <th className="p-3 text-left font-semibold">Admission No</th>
              <th className="p-3 text-left font-semibold">Class</th>
              <th className="p-3 text-left font-semibold">Division</th>
              <th className="p-3 text-left font-semibold">Subject</th>
              <th className="p-3 text-left font-semibold">Term</th>
              <th className="p-3 text-left font-semibold">Sub-Period</th>
              <th className="p-3 text-center font-semibold">Assessment</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.results.map((mark, index) => (
              <tr
                key={mark.slno}
                className={`border-b hover:bg-gray-50 transition-colors duration-150 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                } ${
                  editingId === mark.slno
                    ? "bg-blue-50 ring-2 ring-blue-200"
                    : ""
                } ${
                  successId === mark.slno ||
                  (bulkSuccess && bulkEdits[mark.slno])
                    ? "bg-green-50 ring-2 ring-green-200"
                    : ""
                } ${
                  bulkEdits[mark.slno] && editMode === "bulk"
                    ? "bg-yellow-50 ring-1 ring-yellow-200"
                    : ""
                }`}
              >
                <td className="p-2 font-semibold text-gray-900 bg-[#fff3bf] border-l border-b border-[#ffe066]">
                  {mark.student_name}
                </td>
                {/* Marks Column - Different rendering based on edit mode */}
                <td className="p-2 relative bg-blue-100 font-semibold text-right border border-blue-600">
                  <div className="flex items-center justify-center gap-2 min-w-[180px]">
                    {editMode === "single" ? (
                      // Single Edit Mode
                      <>
                        {editingId === mark.slno ? (
                          <>
                            <div className="relative flex-1">
                              <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 text-center font-semibold bg-white shadow-sm"
                                autoFocus
                                min="0"
                                max={mark.maxmark}
                                step="1"
                                disabled={isUpdatingMark}
                                style={{ fontSize: "14px" }}
                              />
                              {isUpdatingMark && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                  <AiOutlineLoading3Quarters className="h-4 w-4 animate-spin text-blue-600" />
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleEditSave(mark)}
                              disabled={isUpdatingMark}
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Save"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleEditCancel}
                              disabled={isUpdatingMark}
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <div
                            onClick={() => handleMarkClick(mark)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:ring-2 hover:ring-blue-200 flex-1 justify-center ${
                              successId === mark.slno
                                ? "bg-green-50 ring-2 ring-green-200"
                                : "hover:bg-gray-100"
                            }`}
                            title="Click to edit mark"
                          >
                            <span
                              className={`font-semibold text-lg ${
                                successId === mark.slno
                                  ? "text-green-600"
                                  : "text-blue-600"
                              }`}
                              style={{ minWidth: "60px", textAlign: "center" }}
                            >
                              {getDisplayMark(mark)}
                            </span>
                            {successId === mark.slno && (
                              <div className="flex items-center gap-1">
                                <IoCheckmarkCircle className="h-4 w-4 text-green-500" />
                                <span className="text-xs text-green-600 font-medium">
                                  Saved!
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      // Bulk Edit Mode
                      <div className="flex items-center gap-2 flex-1">
                        <div className="text-sm text-gray-600 font-medium min-w-[60px]">
                          {getDisplayMark(mark)}
                        </div>
                        <div className="flex-1 relative">
                          <input
                            type="number"
                            value={getBulkDisplayValue(mark)}
                            onChange={(e) =>
                              handleBulkEditChange(mark, e.target.value)
                            }
                            onKeyDown={(e) => handleBulkKeyDown(e, mark, index)} // ADD THIS
                            placeholder="New mark"
                            data-slno={mark.slno} // ADD THIS
                            className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 text-center text-sm ${
                              bulkErrors[mark.slno]
                                ? "border-red-300 focus:ring-red-200"
                                : bulkEdits[mark.slno]
                                ? "border-green-300 focus:ring-green-200"
                                : "border-gray-300 focus:ring-blue-200"
                            }`}
                            min="0"
                            max={mark.maxmark}
                            step="1" // Change from "0.001" to "1"
                            disabled={isBulkUpdating}
                          />
                          {bulkErrors[mark.slno] && (
                            <div className="absolute -bottom-5 left-0 text-xs text-red-600 whitespace-nowrap">
                              {bulkErrors[mark.slno]}
                            </div>
                          )}
                        </div>
                        {bulkEdits[mark.slno] && !bulkErrors[mark.slno] && (
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-2 text-gray-600 font-semibold bg-[#d3f9d8] text-right border border-[#a9e34b]">
                  {mark.maxmark}
                </td>

                <td className="p-2 text-right font-semibold text-gray-900 bg-[#ffe3e3] border border-[#ffa8a8]">
                  {mark.admission}
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
                  {mark.subperiod}
                </td>
                <td className="p-2 text-gray-700 border-b border-l border-gray-300">
                  {mark.assessmentitem_name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border-t border-red-200 flex items-center gap-2">
          <IoWarningOutline className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default MarksTable;
