import Card from "@frontend/components/ui/Card";
import Button from "@frontend/components/ui/Button";
import type { UserProfile } from "@shared/types/profile";

type Props = {
  goal: UserProfile["goal"];
  onEdit: () => void;
};

const GOAL_LABELS: Record<NonNullable<UserProfile["goal"]>, string> = {
  "lose-weight": "Lose Weight",
  "gain-muscle": "Gain Muscle",
  "body-recomp": "Body Recomposition",
  maintenance: "Maintenance",
};

const GOAL_DESCRIPTIONS: Record<NonNullable<UserProfile["goal"]>, string> = {
  "lose-weight":
    "Targeting a calorie deficit to reduce body fat while preserving muscle.",
  "gain-muscle": "Targeting a calorie surplus to build lean muscle mass.",
  "body-recomp":
    "Simultaneously reducing fat and building muscle at maintenance calories.",
  maintenance: "Sustaining current body weight and composition.",
};

export default function FitnessGoalCard({ goal, onEdit }: Props) {
  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Goal
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
            Fitness goal
          </h3>
        </div>
        <Button variant="secondary" onClick={onEdit}>
          Edit
        </Button>
      </div>

      {goal ? (
        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p className="text-base font-semibold text-white">
            {GOAL_LABELS[goal]}
          </p>
          <p className="text-sm text-slate-300">{GOAL_DESCRIPTIONS[goal]}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          No goal set. Edit your profile to choose a fitness goal.
        </div>
      )}
    </Card>
  );
}
