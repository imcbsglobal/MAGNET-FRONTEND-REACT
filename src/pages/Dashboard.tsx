import { useNavigate } from "react-router-dom";
import { BookOpenCheck, CalendarCheck2, Settings } from "lucide-react";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { toast } from "sonner";
import { useAuthStore } from "../stores/useAuthStore";

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const items = [
    {
      name: "Mark View / Edit",
      icon: <BookOpenCheck size={32} />,
      path: "/marks",
      color: "bg-blue-100",
    },
    {
      name: "Attendance",
      icon: <CalendarCheck2 size={32} />,
      path: "/attendance",
      color: "bg-green-100",
    },
    {
      name: "Settings",
      icon: <Settings size={32} />,
      path: "/settings",
      color: "bg-yellow-100",
    },
    {
      name: "Logout",
      icon: <RiLogoutBoxRFill size={34} />,
      color: "bg-red-100",
      logout: true, // <-- this flag tells us this is a logout item
    },
  ];

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f9fafb] font-handwritten">
      <div className="w-full max-w-md flex flex-col space-y-6 p-8 bg-yellow-300 rounded-3xl shadow-xl mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome, <span className="text-orange-600">{user}</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            We're glad to have you back
          </p>
        </div>
        {items.map((item) => (
          <div
            key={item.name}
            onClick={() => {
              if (item.logout) {
                handleLogout();
              } else if (item.path) {
                navigate(item.path);
              }
            }}
            className={`cursor-pointer ${item.color} rounded-xl p-3 sm:p-5 shadow-md border border-blue-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200`}
          >
            <div className="flex items-center gap-4">
              {item.icon}
              <h2 className="text-sm sm:text-lg text-black font-semibold">
                {item.name}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
