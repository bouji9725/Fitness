const FEATURES = [
  {
    label: "Workout tracking",
    desc: "Log sets, weights, and volume for every session",
  },
  {
    label: "Body progress",
    desc: "Record check-ins and compare month over month",
  },
  {
    label: "Nutrition targets",
    desc: "Calculate calories and macros from your real data",
  },
  {
    label: "Coach sharing",
    desc: "Export a progress report for your coach in one click",
  },
];

export default function AuthBrandPanel() {
  return (
    <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between app-panel border-r p-10 xl:p-14">
      {/* Background blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-15%] top-[-10%] h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-72 w-72 rounded-full bg-cyan-400/8 blur-3xl" />
      </div>

      {/* Brand mark */}
      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15">
          <span className="text-xl font-bold tracking-tight text-indigo-300">F</span>
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
          Fitsler
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white xl:text-4xl">
          Train with intent.<br />Track what matters.
        </h2>
        <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">
          A personal fitness platform for athletes who want to measure progress, not just feel busy.
        </p>
      </div>

      {/* Feature list */}
      <ul className="space-y-4">
        {FEATURES.map(({ label, desc }) => (
          <li key={label} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-indigo-400/30 bg-indigo-500/15">
              <svg aria-hidden="true" className="h-2.5 w-2.5 text-indigo-400" fill="none" viewBox="0 0 10 10">
                <path
                  d="M1.5 5l2.5 2.5 4.5-4.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <p className="text-sm font-medium text-slate-200">{label}</p>
              <p className="text-xs leading-5 text-slate-400">{desc}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer note */}
      <p className="text-xs text-slate-500">
        Your data stays on your account — no third-party sharing.
      </p>
    </div>
  );
}
