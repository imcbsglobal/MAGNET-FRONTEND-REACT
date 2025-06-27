const MarksTable = () => {
  return (
    <div className="border rounded-md overflow-x-auto">
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
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-3">John Doe</td>
            <td className="p-3">Math</td>
            <td className="p-3">85</td>
            <td className="p-3">A</td>
          </tr>
          <tr className="border-b">
            <td className="p-3">Jane Smith</td>
            <td className="p-3">Science</td>
            <td className="p-3">78</td>
            <td className="p-3">B</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MarksTable;
