const StaffLoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white rounded-xl shadow-md px-6 py-5 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-3">Staff login</h1>
        <p className="text-xs text-slate-500 mb-4">
          Later this page will log in store workers and connect them to a
          specific branch.
        </p>
        <input
          className="w-full border rounded px-3 py-2 text-sm mb-2"
          placeholder="Email"
        />
        <input
          className="w-full border rounded px-3 py-2 text-sm mb-4"
          placeholder="Password"
          type="password"
        />
        <button className="w-full bg-slate-900 text-white rounded-full py-2 text-sm font-semibold">
          Login (stub)
        </button>
      </div>
    </div>
  );
};

export default StaffLoginPage;
