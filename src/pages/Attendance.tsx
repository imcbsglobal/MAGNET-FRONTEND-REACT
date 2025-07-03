import { useNavigate } from "react-router-dom";

const Attendance = () => {
  const navigate = useNavigate();
  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
      <div className="flex flex-col gap-5 items-center justify-center bg-white p-4 border border-yellow-300 rounded-2xl w-[800px] h-[500px]">
        <h2 className="font-bold text-xl text-orange-500">
          Coming Soon On Progress...
        </h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white hover:shadow-lg hover:scale-105 px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ease-in-out cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    </section>
  );
};

export default Attendance;
