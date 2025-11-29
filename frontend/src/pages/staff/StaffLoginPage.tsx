import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const StaffLoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("staff@dragon.local");
  const [password, setPassword] = useState("staff123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await login(email, password);
      if (user && user.role !== "STAFF") {
        setError("Not a staff account");
      } else {
        navigate("/staff");
      }
    } catch (err: any) {
      console.error(err);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white rounded-xl shadow-md px-6 py-5 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-3">Staff login</h1>
        <p className="text-xs text-slate-500 mb-4">
          Use staff account created by backend seed.
        </p>

        {error && (
          <p className="mb-2 text-xs text-red-500">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white rounded-full py-2 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login as staff"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffLoginPage;
