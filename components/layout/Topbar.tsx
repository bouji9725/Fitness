export default function Topbar() {
  return (
    <header className="flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div>
        <p className="text-sm text-slate-500">Welcome back</p>
        <h2 className="text-lg font-semibold text-slate-900">Coach Dashboard</h2>
      </div>

      <div className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
        Abdel
      </div>
    </header>
  );
}