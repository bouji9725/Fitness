import Button from "@frontend/components/ui/Button";
import Card from "@frontend/components/ui/Card";

type SaveWorkoutBarProps = {
  onSave: () => void;
  onReset: () => void;
  isDirty: boolean;
  isAllComplete: boolean;
  lastSavedAt: string | null;
};

export default function SaveWorkoutBar({
  onSave,
  onReset,
  isDirty,
  isAllComplete,
  lastSavedAt,
}: SaveWorkoutBarProps) {
  const canSave = isDirty || isAllComplete;

  return (
    <Card className="sticky top-[4.5rem] z-10 flex flex-col gap-4 border border-white/10 bg-slate-950/80 p-5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Workout session
          </p>
          {isAllComplete && (
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
              All done
            </span>
          )}
        </div>

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

        <Button onClick={onSave} disabled={!canSave}>
          {isAllComplete ? "Complete workout" : "Save workout"}
        </Button>
      </div>
    </Card>
  );
}
