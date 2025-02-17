import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../api/authApi";
import { loginSuccess } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import icons

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Error state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser({ email, password });

      if (res?.data?.token) {
        dispatch(loginSuccess(res.data));
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r bg-fuchsia-500 animate-gradient">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 transform transition-all  hover:shadow-3xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Welcome Back!
        </h2>
        {error && (
          <p className="text-red-600 text-sm text-center mb-4" aria-live="polite">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
              required
            />
          </div>
          <div className="flex flex-col gap-2 relative">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all w-full pr-12"
                required
              />
              {/* Eye Icon for Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`px-6 py-3 mt-4 rounded-lg text-white font-semibold flex justify-center items-center ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-fuchsia-500 hover:bg-fuchsia-700 transition-all transform "
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
