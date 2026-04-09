import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

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
    <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">
          Workout Session
        </h3>
        <p className="text-sm text-slate-500">
          {lastSavedAt
            ? `Last saved: ${new Date(lastSavedAt).toLocaleString()}`
            : "Not saved yet"}
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onReset}>
          Reset to Template
        </Button>

        <Button type="button" onClick={onSave} disabled={!isDirty}>
          Save Workout
        </Button>
      </div>
    </Card>
  );
}