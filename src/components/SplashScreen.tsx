import logo from "../assets/logo-dummy.png";

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#f9fafb] z-[9999] flex flex-col items-center justify-center">
      <img src={logo} alt="Logo" className="w-20 mb-4" />
      <h1 className="text-4xl font-bold text-[#fb923c] mb-4">MAGNET SCHOOL</h1>
      <p className="text-lg text-black mb-8">
        Welcome to the School Management Portal
      </p>
      <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default SplashScreen;
