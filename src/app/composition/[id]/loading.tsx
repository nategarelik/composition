export default function Loading() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <h1 className="text-xl font-bold text-white mb-2">
          Loading Composition
        </h1>
        <p className="text-gray-400">Preparing 3D visualization...</p>
      </div>
    </main>
  );
}
