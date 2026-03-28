import Button from "@/components/ui/Button";

type SaveWorkoutBarProps = {
  onSave: () => void;
  onReset: () => void;
  isDirty: boolean;
  lastSavedAt: string | null;
};

export default function SaveWorkoutBar({
  onSave,
  onReset,
  isDirty,
  lastSavedAt,
}: SaveWorkoutBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-900">Workout Session</p>
        <p className="text-sm text-slate-500">
          {lastSavedAt
            ? `Last saved: ${new Date(lastSavedAt).toLocaleString()}`
            : "Not saved yet"}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="ghost" onClick={onReset}>
          Reset to Template
        </Button>

        <Button type="button" onClick={onSave} disabled={!isDirty}>
          Save Workout
        </Button>
      </div>
    </div>
  );
}