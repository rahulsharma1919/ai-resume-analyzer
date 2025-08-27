import { Link, useNavigate, useLocation } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { FiUpload, FiLogOut, FiLogIn, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const checkResumes = async () => {
      const resumes = await kv.list("resume:*", true);
      setHasData(Array.isArray(resumes) && resumes.length > 0);
    };
    checkResumes();
  }, [location.pathname]);

  const handleLogin = () => navigate("/auth?next=/");
  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };
  const handleUploadClick = (e: React.MouseEvent) => {
    if (!auth.isAuthenticated) {
      e.preventDefault();
      navigate("/auth?next=/upload");
    }
  };

  return (
    <nav className="navbar sticky top-0 z-50 px-8 py-4 flex items-center justify-between shadow-lg font-sans bg-white">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Resume.AI
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <Link
          to="/upload"
          className="transition-all duration-200 font-semibold px-5 py-2 rounded-xl shadow flex items-center gap-2 font-sans bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
          onClick={handleUploadClick}
        >
          <FiUpload size={20} />
          Upload Resume
        </Link>
        {hasData && (
          <Link
            to="/wipe"
            className="transition-all duration-200 font-semibold px-5 py-2 rounded-xl shadow flex items-center gap-2 font-sans bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
          >
            <FiTrash2 size={20} />
            Wipe Data
          </Link>
        )}
        {auth.isAuthenticated ? (
          <button
            className="transition-all duration-200 font-semibold px-5 py-2 rounded-xl shadow flex items-center gap-2 font-sans bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600"
            onClick={handleLogout}
          >
            <FiLogOut size={20} />
            Logout
          </button>
        ) : (
          <button
            className="transition-all duration-200 font-semibold px-5 py-2 rounded-xl shadow flex items-center gap-2 font-sans bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600"
            onClick={handleLogin}
          >
            <FiLogIn size={20} />
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
