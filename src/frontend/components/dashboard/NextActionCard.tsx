import Link from "next/link";
import Card from "@frontend/components/ui/Card";
import Button from "@frontend/components/ui/Button";
import type { UserProfile } from "@shared/types/profile";
import type { NutritionResults } from "@shared/types/nutrition";
import type { WorkoutSessionRecord } from "@shared/types/workout";
import type { BodyStatsEntry } from "@shared/types/progress";

type NextAction = {
  title: string;
  description: string;
  href: string;
  label: string;
};

function deriveNextAction(
  profile: UserProfile | null,
  latestBodyStats: BodyStatsEntry | null,
  nutritionSummary: NutritionResults | null,
  savedWorkouts: WorkoutSessionRecord[]
): NextAction {
  if (!profile?.name?.trim() || !profile.age || !profile.heightCm || !profile.sex) {
    return {
      title: "Complete your profile",
      description:
        "Add your age, height, and sex so Fitsler can calculate a personalised BMR and nutrition plan.",
      href: "/profile",
      label: "Complete profile",
    };
  }

  if (!latestBodyStats) {
    return {
      title: "Add your first body stats",
      description:
        "Record your current weight and body fat so the dashboard and nutrition calculator can use real data.",
      href: "/progress",
      label: "Add progress entry",
    };
  }

  if (!nutritionSummary) {
    return {
      title: "Calculate your nutrition plan",
      description:
        "Your body data is ready. Run the nutrition calculator to set your calorie and macro targets.",
      href: "/nutrition",
      label: "Calculate nutrition",
    };
  }

  if (savedWorkouts.length === 0) {
    return {
      title: "Log your first workout",
      description:
        "Pick a template and start tracking your training sessions.",
      href: "/workouts",
      label: "Start workout",
    };
  }

  return {
    title: "Keep tracking",
    description:
      "Everything looks great. Keep logging workouts, updating body stats, and reviewing your progress.",
    href: "/progress",
    label: "View progress",
  };
}

type Props = {
  profile: UserProfile | null;
  latestBodyStats: BodyStatsEntry | null;
  nutritionSummary: NutritionResults | null;
  savedWorkouts: WorkoutSessionRecord[];
};

export default function NextActionCard({
  profile,
  latestBodyStats,
  nutritionSummary,
  savedWorkouts,
}: Props) {
  const action = deriveNextAction(
    profile,
    latestBodyStats,
    nutritionSummary,
    savedWorkouts
  );

  return (
    <Card className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Next step
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
          {action.title}
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate-300">
          {action.description}
        </p>
      </div>
      <Link href={action.href}>
        <Button variant="primary">{action.label}</Button>
      </Link>
    </Card>
  );
}
