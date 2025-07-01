import { useState } from "react";
import { ChevronDown, Search, X, Loader2 } from "lucide-react";
import { useFiltersQuery } from "../hooks/useFilterMetadata";
import type { MarksFilterState } from "../types/filter.types";
import FilterSkeleton from "./FilterSkeleton";

interface MarksFilterProps {
  filters: MarksFilterState;
  setFilters: (filters: MarksFilterState) => void;
  onApply: () => void;
  onReset: () => void;
  // Add these new props
  loadingFilter?: string | null; // which filter is currently loading
  onFilterChange?: (filterName: string, value: string) => Promise<void>; // async handler
}

interface SearchableDropdownProps {
  label: string;
  name: string;
  value: string;
  options: Array<{
    code?: string;
    name?: string;
    value: string;
    display: string;
  }>;
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  // Add these new props
  isLoading?: boolean;
  disabled?: boolean;
}

const SearchableDropdown = ({
  label,
  name,
  value,
  options,
  onChange,
  placeholder = "All",
  isLoading = false,
  disabled = false,
}: SearchableDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter(
    (option) =>
      option.display.toLowerCase().includes(search.toLowerCase()) ||
      (option.code && option.code.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (selectedValue: string) => {
    onChange(name, selectedValue);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-sm font-medium text-gray-700">{label}:</label>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none bg-white text-left flex items-center justify-between transition-colors duration-200 ${
            disabled
              ? "cursor-not-allowed opacity-50 bg-gray-100"
              : "focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-gray-400"
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.display : placeholder}
          </span>
          <div className="flex items-center gap-2">
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {isOpen && !disabled && (
          <>
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
              {/* Search Input */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${label.toLowerCase()}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded p-1 transition-colors duration-200"
                    >
                      <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="max-h-48 overflow-y-auto">
                <div
                  className="px-4 py-3 hover:bg-blue-100 hover:text-blue-500 cursor-pointer text-sm border-b border-gray-100 transition-colors duration-200"
                  onClick={() => handleSelect("")}
                >
                  {placeholder}
                </div>
                {filteredOptions.map((option, index) => (
                  <div
                    key={option.value || index}
                    className="px-4 py-3 hover:bg-blue-100 hover:text-blue-500  cursor-pointer text-sm border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                    onClick={() => handleSelect(option.value)}
                  >
                    <div className="font-medium text-gray-900 hover:text-blue-500 ">
                      {option.display}
                    </div>
                  </div>
                ))}
                {filteredOptions.length === 0 && search && (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No {label.toLowerCase()} found
                  </div>
                )}
              </div>
            </div>

            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </div>
    </div>
  );
};

const MarksFilter = ({
  filters,
  setFilters,
  onReset,
  loadingFilter = null,
  onFilterChange,
}: MarksFilterProps) => {
  const { data, isLoading } = useFiltersQuery();

  const handleDropdownChange = async (name: string, value: string) => {
    if (onFilterChange) {
      await onFilterChange(name, value);
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  if (isLoading) {
    return <FilterSkeleton />;
  }

  // Prepare options for each dropdown
  const classOptions =
    data?.classes.map((cls) => ({ value: cls, display: cls })) || [];
  const divisionOptions =
    data?.divisions.map((div) => ({ value: div, display: div })) || [];
  const studentOptions =
    data?.students.map((student) => ({
      value: student.admission,
      display: student.name,
      code: student.admission,
    })) || [];
  const subjectOptions =
    data?.subjects.map((sub) => ({
      value: sub.code,
      display: sub.name,
      code: sub.code,
    })) || [];
  const termOptions =
    data?.terms.map((term) => ({ value: term, display: term })) || [];
  const partOptions =
    data?.parts.map((part) => ({ value: part, display: part })) || [];
  const assessmentOptions =
    data?.assessment_items.map((item) => ({
      value: item.code,
      display: item.name,
      code: item.code,
    })) || [];

  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-300 mb-8">
      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <SearchableDropdown
          label="Class"
          name="class_field"
          value={filters.class_field || ""}
          options={classOptions}
          onChange={handleDropdownChange}
          isLoading={loadingFilter === "class_field"}
          disabled={loadingFilter !== null && loadingFilter !== "class_field"}
        />

        <SearchableDropdown
          label="Division"
          name="division"
          value={filters.division || ""}
          options={divisionOptions}
          onChange={handleDropdownChange}
          isLoading={loadingFilter === "division"}
          disabled={loadingFilter !== null && loadingFilter !== "division"}
        />

        <SearchableDropdown
          label="Student"
          name="admission"
          value={filters.admission || ""}
          options={studentOptions}
          onChange={handleDropdownChange}
          isLoading={loadingFilter === "admission"}
          disabled={loadingFilter !== null && loadingFilter !== "admission"}
          placeholder={`All (${data?.student_count || 0})`}
        />

        <SearchableDropdown
          label="Subject"
          name="subject"
          value={filters.subject || ""}
          options={subjectOptions}
          onChange={handleDropdownChange}
          isLoading={loadingFilter === "subject"}
          disabled={loadingFilter !== null && loadingFilter !== "subject"}
        />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SearchableDropdown
          label="Term"
          name="term"
          value={filters.term || ""}
          options={termOptions}
          onChange={handleDropdownChange}
          isLoading={loadingFilter === "term"}
          disabled={loadingFilter !== null && loadingFilter !== "term"}
        />

        <SearchableDropdown
          label="Part"
          name="part"
          value={filters.part || ""}
          options={partOptions}
          onChange={handleDropdownChange}
          isLoading={loadingFilter === "part"}
          disabled={loadingFilter !== null && loadingFilter !== "part"}
        />

        <SearchableDropdown
          label="Assessment Item"
          name="assessmentitem"
          value={filters.assessmentitem || ""}
          options={assessmentOptions}
          onChange={handleDropdownChange}
          isLoading={loadingFilter === "assessmentitem"}
          disabled={
            loadingFilter !== null && loadingFilter !== "assessmentitem"
          }
        />

        {/* Buttons */}
        <div className="flex items-end gap-3">
          <button
            type="button"
            disabled={loadingFilter !== null}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium min-w-20 transition-colors duration-200 ${
              loadingFilter !== null
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-600 hover:bg-gray-700 cursor-pointer"
            } text-white`}
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarksFilter;
