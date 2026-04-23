import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type SaveWorkoutBarProps = {
  onSave: () => void;
  onReset: () => void;
  isDirty: boolean;
  lastSavedAt: string | null;
};

// Sticky-style action bar for the workout session.
// Keep the actions simple and high-signal.
export default function SaveWorkoutBar({
  onSave,
  onReset,
  isDirty,
  lastSavedAt,
}: SaveWorkoutBarProps) {
  return (
    <Card className="flex flex-col gap-4 border border-white/10 bg-slate-950/70 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Workout session
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          {lastSavedAt
            ? `Last saved: ${new Date(lastSavedAt).toLocaleString()}`
            : "Changes have not been saved yet."}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={onReset}>
          Reset to template
        </Button>

        <Button onClick={onSave} disabled={!isDirty}>
          Save workout
        </Button>
      </div>
    </Card>
  );
}