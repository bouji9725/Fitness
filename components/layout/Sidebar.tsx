import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workouts", label: "Workouts" },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-6 lg:block">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Fitsler Pro</h1>
        <p className="text-sm text-slate-500">Tracking & Progress</p>
      </div>

      <nav aria-label="Sidebar navigation">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-xl px-3 py-2 text-slate-700 transition hover:bg-slate-100"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}