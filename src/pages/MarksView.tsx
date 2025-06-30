import { RiLogoutBoxRFill } from "react-icons/ri";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import MarksFilter from "../components/MarksFilter";
import MarksTable from "../components/MarksTable";
import { useMarksQuery, useUpdateMarkMutation } from "../hooks/useMarksQuery";
import type { MarksFilterState } from "../types/filter.types";

const MarksView = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // State management
  const [filters, setFilters] = useState<MarksFilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loadingFilter, setLoadingFilter] = useState<string | null>(null);

  // Query for marks data
  const { data, isLoading, isError } = useMarksQuery({
    filters,
    enabled: true,
    page: currentPage,
    pageSize,
  });

  // Mutation for updating marks
  const updateMarkMutation = useUpdateMarkMutation();

  const handleLogout = () => {
    toast.dismiss();
    toast("Are you sure you want to logout?", {
      action: {
        label: "Logout",
        onClick: () => {
          logout();
          navigate("/");
          toast.success("Logged out successfully");
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          console.log("Logout cancelled");
        },
      },
    });
  };

  const handleApply = () => {
    // Reset to first page when applying new filters
    setCurrentPage(1);
    console.log("Filters applied:", filters);
  };

  const handleReset = () => {
    setFilters({});
    setCurrentPage(1); // Reset to first page when clearing filters
    console.log("Filters reset");
  };

  // New async filter change handler
  const handleFilterChange = async (filterName: string, value: string) => {
    setLoadingFilter(filterName);

    try {
      // Simulate API call delay or add actual dependent filter loading logic
      // For example, if changing class should reload divisions, students, etc.
      await new Promise((resolve) => setTimeout(resolve, 500)); // Remove this in production

      // Add your specific filter dependency logic here
      // For example:
      // if (filterName === 'class_field') {
      //   await refetchDivisions(value);
      //   await refetchStudents(value);
      // }

      // Update the filter state
      setFilters((prev) => ({ ...prev, [filterName]: value }));

      // Reset to first page when filter changes
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
    setCurrentPage(1); // Reset to first page when changing page size
    console.log("Page size changed to:", newPageSize);
  };

  const handleMarkUpdate = async (id: string, newMark: number) => {
    try {
      await updateMarkMutation.mutateAsync({ id, mark: newMark });
    } catch (error) {
      // Error is handled in the mutation's onError callback
      throw error;
    }
  };

  return (
    <section className="min-h-screen bg-[#f9fafb] flex items-start justify-center p-6">
      <div className="w-full max-w-[1400px] bg-white rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold text-[#2c7be5]">Marks View</h2>
          <div className="flex gap-5 items-center">
            <h3 className="text-3xl font-semibold text-[#2c7be5]">{user}</h3>
            <RiLogoutBoxRFill
              onClick={handleLogout}
              className="text-4xl text-[#2c7be5] cursor-pointer hover:text-red-600 transition-colors duration-200"
            />
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
          isUpdatingMark={updateMarkMutation.isPending}
        />
      </div>
    </section>
  );
};

export default MarksView;
