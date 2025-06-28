import { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { useFiltersQuery } from "../hooks/useFilterMetadata";
import type { MarksFilterState } from "../types/filter.types";

interface MarksFilterProps {
  filters: MarksFilterState;
  setFilters: (filters: MarksFilterState) => void;
  onApply: () => void;
  onReset: () => void;
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
}

const SearchableDropdown = ({
  label,
  name,
  value,
  options,
  onChange,
  placeholder = "All",
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-left flex items-center justify-between transition-colors duration-200 hover:border-gray-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.display : placeholder}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
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
                    {/* {option.code && (
                      <div className="text-xs text-gray-500 mt-1">
                        Code: {option.code}
                      </div>
                    )} */}
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

const MarksFilter = ({ filters, setFilters, onReset }: MarksFilterProps) => {
  const { data, isLoading } = useFiltersQuery();

  const handleDropdownChange = (name: string, value: string) => {
    setFilters({ ...filters, [name]: value });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-300 mb-8">
        {/* Skeleton for filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
              <div className="h-11 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
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
        />

        <SearchableDropdown
          label="Division"
          name="division"
          value={filters.division || ""}
          options={divisionOptions}
          onChange={handleDropdownChange}
        />

        <SearchableDropdown
          label="Student"
          name="admission"
          value={filters.admission || ""}
          options={studentOptions}
          onChange={handleDropdownChange}
        />

        <SearchableDropdown
          label="Subject"
          name="subject"
          value={filters.subject || ""}
          options={subjectOptions}
          onChange={handleDropdownChange}
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
        />

        <SearchableDropdown
          label="Part"
          name="part"
          value={filters.part || ""}
          options={partOptions}
          onChange={handleDropdownChange}
        />

        <SearchableDropdown
          label="Assessment Item"
          name="assessmentitem"
          value={filters.assessmentitem || ""}
          options={assessmentOptions}
          onChange={handleDropdownChange}
        />

        {/* Buttons */}
        <div className="flex items-end gap-3">
          <button
            type="button"
            className="flex-1 bg-gray-600 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium min-w-20 cursor-pointer"
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
