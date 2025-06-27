import { RiLogoutBoxRFill } from "react-icons/ri";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import MarksFilter from "../components/MarksFilter";
import MarksTable from "../components/MarksTable";

const MarksView = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
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

  return (
    <section className="min-h-screen bg-[#f9fafb] flex items-start justify-center p-6">
      <div className="w-full max-w-[1400px] bg-white rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold text-[#2c7be5] ">Marks View</h2>
          <div className="flex gap-5 items-center">
            <h3 className="text-3xl font-semibold text-[#2c7be5]">{user}</h3>
            <RiLogoutBoxRFill
              onClick={handleLogout}
              className="text-4xl text-[#2c7be5] cursor-pointer translate-y-[2px] hover:text-red-600"
            />
          </div>
        </div>
        <MarksFilter />
        <MarksTable />
      </div>
    </section>
  );
};

export default MarksView;
