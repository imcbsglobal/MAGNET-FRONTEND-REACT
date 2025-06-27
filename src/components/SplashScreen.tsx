const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#f9fafb] z-[9999] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-[#2c7be5] mb-4">Magnet App</h1>
      <p className="text-lg text-gray-600 mb-8">
        Welcome to the Student Marks System
      </p>
      <div className="w-12 h-12 border-4 border-[#2c7be5] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default SplashScreen;
