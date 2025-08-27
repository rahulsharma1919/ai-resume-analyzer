import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume.AI | Home" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    // Only fetch resumes if logged in
    if (!auth?.user) return;

    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };

    loadResumes();
  }, [auth?.user, kv]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex flex-col">
      <Navbar />

      <section className="main-section flex-1">
        <div className="page-heading py-16">
          <h1>Track Your Applications & Resume Ratings</h1>

          {auth?.user ? (
            !loadingResumes && resumes?.length === 0 ? (
              <h2>
                No resumes found. Upload your first resume to get feedback.
              </h2>
            ) : (
              <h2>Review your submissions and check AI-powered feedback.</h2>
            )
          ) : (
            <h2>Upload your resume to get ATS score and AI feedback.</h2>
          )}
        </div>

        {/* Loader */}
        {auth?.user && loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}

        {/* Logged-in resumes */}
        {auth?.user && !loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {/* Logged-in but no resumes */}
        {auth?.user && !loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg hover:scale-105 hover:from-blue-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-3"
              style={{
                letterSpacing: "0.03em",
                boxShadow: "0 4px 24px 0 rgba(80, 70, 180, 0.12)",
              }}
            >
              <FiUpload size={24} />
              Upload Resume
            </Link>
          </div>
        )}

        {/* Logged-out state: show gif + upload button */}
        {!auth?.user && (
          <div className="flex flex-col items-center justify-center mt-10 gap-6">
            <img src="/images/resume-scan-2.gif" className="w-[220px]" />
            <Link
              to="/upload"
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg hover:scale-105 hover:from-blue-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-3"
              style={{
                letterSpacing: "0.03em",
                boxShadow: "0 4px 24px 0 rgba(80, 70, 180, 0.12)",
              }}
            >
              <FiUpload size={24} />
              Upload Resume
            </Link>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="w-full mt-8 py-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-center font-sans shadow-lg rounded-t-2xl">
        <div className="flex flex-col items-center gap-2">
          <span className="font-semibold text-base">
            Made with{" "}
            <span className="text-red-400" role="img" aria-label="heart">
              ♥
            </span>{" "}
            by{" "}
            <a
              href="https://github.com/rahulsharma1919"
              className="cursor-pointer underline"
            >
              Rahul Sharma
            </a>
          </span>
          <span className="text-xs opacity-80">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>
      </footer>
    </main>
  );
}
