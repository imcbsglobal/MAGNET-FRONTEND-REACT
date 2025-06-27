const MarksFilter = () => {
  return (
    <div className="bg-[#f8f9fa] p-6 rounded-xl border border-gray-300 mb-6">
      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Class</label>
          <select className="border rounded-md px-3 py-2 outline-none focus:border-[#2c7be5]">
            <option value="">All</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Division</label>
          <select className="border rounded-md px-3 py-2 outline-none focus:border-[#2c7be5]">
            <option value="">All</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Student</label>
          <select className="border rounded-md px-3 py-2 outline-none focus:border-[#2c7be5]">
            <option value="">All</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Subject</label>
          <select className="border rounded-md px-3 py-2 outline-none focus:border-[#2c7be5]">
            <option value="">All</option>
          </select>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Term</label>
          <select className="border rounded-md px-3 py-2 outline-none focus:border-[#2c7be5]">
            <option value="">All</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Part</label>
          <select className="border rounded-md px-3 py-2 outline-none focus:border-[#2c7be5]">
            <option value="">All</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Assessment Item
          </label>
          <select className="border rounded-md px-3 py-2 outline-none focus:border-[#2c7be5]">
            <option value="">All</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button className="flex-1 bg-[#2c7be5] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Apply
          </button>
          <button className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarksFilter;
