import { useLoadingStore } from "../stores/useLoadingStore";

const GlobalLoader = () => {
  const { loading } = useLoadingStore();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default GlobalLoader;
