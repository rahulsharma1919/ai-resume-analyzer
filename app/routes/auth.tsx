import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const meta = () => [
  { title: "Resume.AI | Auth" },
  { name: "description", content: "Log into your account" },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="shadow-xl rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200 p-8 w-full max-w-md">
        <section className="flex flex-col gap-6 items-center">
          <div className="flex flex-col items-center gap-2 text-center">

            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text tracking-tight">
              Welcome to Resume.AI
            </h1>
            <h2 className="text-base text-gray-600 font-medium">
              Log In to Continue Your Job Journey
            </h2>
            {next === "/upload" && (
              <div className="mt-2 text-sm text-pink-500 font-semibold">
                Please login to upload your resume.
              </div>
            )}
          </div>
          <div className="w-full flex flex-col items-center">
            {isLoading ? (
              <button className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow animate-pulse cursor-not-allowed">
                Signing you in...
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold shadow hover:scale-105 transition-all"
                    onClick={auth.signOut}
                  >
                    Log Out
                  </button>
                ) : (
                  <button
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow hover:scale-105 transition-all"
                    onClick={auth.signIn}
                  >
                    Log In
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
