import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MarksFilter from "../components/MarksFilter";
import MarksTable from "../components/MarksTable";
import {
  useMarksQuery,
  useUpdateMarkMutation,
  useBulkUpdateMarksMutation,
} from "../hooks/useMarksQuery";
import { useSettingsStore } from "../stores/useSettingsStore";
import type { MarksFilterState } from "../types/filter.types";
import { Settings } from "lucide-react";

const MarksView = () => {
  const navigate = useNavigate();
  const { editMode } = useSettingsStore();

  // State management
  const [filters, setFilters] = useState<MarksFilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loadingFilter, setLoadingFilter] = useState<string | null>(null);

  // Query for marks data
  const { data, isLoading, isError, error } = useMarksQuery({
    filters,
    enabled: true,
    page: currentPage,
    pageSize,
  });

  // Mutations
  const updateMarkMutation = useUpdateMarkMutation();
  const bulkUpdateMarksMutation = useBulkUpdateMarksMutation();

  // Handle query errors
  if (isError) {
    console.error("Failed to fetch marks:", error);
    toast.error("Failed to fetch marks data");
  }

  const handleApply = () => {
    // Reset to first page when applying new filters
    setCurrentPage(1);
    console.log("Filters applied:", filters);
  };

  const handleReset = () => {
    setFilters({});
    setCurrentPage(1);
    console.log("Filters reset");
  };

  const handleFilterChange = async (filterName: string, value: string) => {
    setLoadingFilter(filterName);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setFilters((prev) => ({ ...prev, [filterName]: value }));
      setCurrentPage(1);
      console.log(`Filter ${filterName} changed to:`, value);
    } catch (error) {
      console.error(`Error updating filter ${filterName}:`, error);
      toast.error(`Failed to update ${filterName} filter`);
    } finally {
      setLoadingFilter(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    console.log("Page size changed to:", newPageSize);
  };

  const handleMarkUpdate = async (id: string, newMark: number) => {
    try {
      await updateMarkMutation.mutateAsync({ id, mark: newMark });
    } catch (error) {
      throw error;
    }
  };

  const handleBulkMarkUpdate = async (
    updates: { slno: string; mark: number }[]
  ) => {
    try {
      await bulkUpdateMarksMutation.mutateAsync(updates);
      toast.success(`Successfully updated ${updates.length} marks`);
    } catch (error) {
      console.error("Bulk update failed:", error);
      toast.error("Failed to update marks. Please try again.");
      throw error;
    }
  };

  return (
    <section className="min-h-screen bg-[#f9fafb] flex items-start justify-center p-6">
      <div className="w-full max-w-[1400px] bg-white rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-semibold text-orange-500">
              Marks View
            </h2>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-sm font-medium text-blue-800">
                {editMode === "single" ? "Single Edit" : "Bulk Edit"} Mode
              </span>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:shadow-md px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
              title="Change edit mode"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white hover:shadow-lg hover:scale-105 px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ease-in-out cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Mode Info Banner */}
        <div
          className={`mb-4 p-3 rounded-lg border-l-4 ${
            editMode === "single"
              ? "bg-blue-50 border-blue-400 text-blue-800"
              : "bg-purple-50 border-purple-400 text-purple-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {editMode === "single"
                ? "🎯 Single Edit Mode"
                : "📝 Bulk Edit Mode"}
            </span>
            <span className="text-sm">
              {editMode === "single"
                ? "Click on any mark to edit it individually"
                : "Edit multiple marks at once and save all changes together"}
            </span>
          </div>
        </div>

        <MarksFilter
          filters={filters}
          setFilters={setFilters}
          onApply={handleApply}
          onReset={handleReset}
          loadingFilter={loadingFilter}
          onFilterChange={handleFilterChange}
        />

        <MarksTable
          data={data}
          isLoading={isLoading}
          isError={isError}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          onMarkUpdate={handleMarkUpdate}
          onBulkMarkUpdate={handleBulkMarkUpdate}
          isUpdatingMark={updateMarkMutation.isPending}
          isBulkUpdating={bulkUpdateMarksMutation.isPending}
        />
      </div>
    </section>
  );
};

export default MarksView;
