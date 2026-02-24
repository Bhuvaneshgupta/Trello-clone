import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Zap } from "lucide-react";

const Login = () => {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-soft"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse-soft"></div>

      <div className="relative z-10 text-center animate-fadeInUp">
        <div className="mb-8 flex justify-center">
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30">
            <Zap size={48} className="text-yellow-300" />
          </div>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-200">
          Trello Clone
        </h1>

        <p className="text-lg text-white/80 mb-12 max-w-md mx-auto">
          Organize your tasks effortlessly. Drag, drop, and conquer your
          productivity goals.
        </p>

        <button
          onClick={loginWithGoogle}
          className="group relative px-8 py-4 rounded-xl font-bold text-lg text-indigo-600 bg-white shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </span>
        </button>

        <p className="text-white/60 text-sm mt-8">
          No account needed, just sign in with Google to get started
        </p>
      </div>
    </div>
  );
};

export default Login;
