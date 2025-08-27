import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { FiTrash2, FiArrowLeft } from "react-icons/fi";
import Navbar from "~/components/Navbar";

const WipeApp = () => {
  const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [wiping, setWiping] = useState(false);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    setWiping(true);
    for (const file of files) {
      await fs.delete(file.path);
    }
    await kv.flush();
    setWiping(false);
    navigate("/");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="text-center text-sm text-gray-600 font-medium tracking-wide">
            Loading, please wait...
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center text-sm text-red-500">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen font-sans">
      <section className="flex justify-center items-center min-h-[80vh]">
        <div className="bg-white/90 rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-md">
          <h1 className="text-xl font-bold text-center mb-2 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-transparent bg-clip-text">
            Wipe All App Data
          </h1>
          <h2 className="text-sm text-gray-600 text-center mb-4">
            This will permanently delete all your uploaded files and resume
            data.
          </h2>
          <div className="mb-4">
            <div className="text-xs text-gray-700 font-medium mb-2">
              Authenticated as:{" "}
              <span className="font-semibold">{auth.user?.username}</span>
            </div>
            <div className="text-xs text-gray-700 mb-1">Existing files:</div>
            <div className="flex flex-col gap-2 max-h-32 overflow-y-auto mb-2">
              {files.length === 0 ? (
                <div className="text-xs text-gray-400">No files found.</div>
              ) : (
                files.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-row gap-2 items-center"
                  >
                    <span className="text-xs text-gray-600">{file.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          <button
            className="w-full px-5 py-2 rounded-xl bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white font-semibold text-base shadow-md hover:scale-105 hover:from-red-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2 mb-3"
            onClick={handleDelete}
            disabled={wiping || files.length === 0}
          >
            <FiTrash2 size={18} />
            {wiping ? "Wiping Data..." : "Wipe App Data"}
          </button>
          <button
            className="w-full px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold text-base shadow hover:scale-105 hover:from-blue-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2"
            onClick={() => navigate("/")}
          >
            <FiArrowLeft size={18} />
            Back to Homepage
          </button>
        </div>
      </section>
    </main>
  );
};

export default WipeApp;
