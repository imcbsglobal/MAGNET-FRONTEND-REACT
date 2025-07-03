import { useSettingsStore, type EditMode } from "../stores/useSettingsStore";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const { editMode, setEditMode } = useSettingsStore();
  const navigate = useNavigate();

  const modes: { key: EditMode; title: string; description: string }[] = [
    {
      key: "single",
      title: "Single Edit Mode",
      description:
        "Edit one student’s marks at a time — perfect for detailed changes.",
    },
    {
      key: "bulk",
      title: "Bulk Edit Mode",
      description:
        "Edit marks for multiple students at once and save all together.",
    },
  ];

  return (
    <section className="min-h-screen flex flex-col justify-between bg-[#f9fafb]">
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-yellow-300 p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col items-center gap-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ⚙️ Settings
            </h1>
            <p className="text-gray-700 text-sm sm:text-base">
              Choose your preferred mode for editing student marks. You can
              always change it later.
            </p>
          </div>

          {/* Mode Selection */}
          <div className="w-full flex flex-col gap-4">
            {modes.map(({ key, title, description }) => {
              const isActive = editMode === key;
              return (
                <div
                  key={key}
                  onClick={() => setEditMode(key)}
                  className={`flex items-center justify-between border-2 rounded-xl p-4 cursor-pointer transition 
          border-orange-500 ${isActive ? "bg-blue-50" : "hover:bg-blue-100"}`}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                  {isActive && (
                    <CheckCircle2 className="text-green-500" size={28} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Dashboard Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-2 bg-white text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white hover:shadow-lg hover:scale-105 px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ease-in-out cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 font-sans text-sm text-gray-800">
        © {new Date().getFullYear()} Magnet School App. All rights reserved.
      </footer>
    </section>
  );
};

export default SettingsPage;
