
import type { SetEntry } from "@/types/workout";
import type { WorkoutSessionAction } from "@/lib/workout-session-reducer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { parseNumberInput } from "@/lib/utils/number";

type SetRowProps = {
  exerciseId: string;
  set: SetEntry;
  dispatch: React.Dispatch<WorkoutSessionAction>;
};

export default function SetRow({
  exerciseId,
  set,
  dispatch,
}: SetRowProps) {
  return (
    <div className="grid min-w-0 gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] sm:items-end">
      <div className="min-w-0">
        <Label htmlFor={`${exerciseId}-${set.id}-reps`}>Reps</Label>
        <Input
          id={`${exerciseId}-${set.id}-reps`}
          type="number"
          min={0}
          value={set.reps}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_SET_REPS",
              exerciseId,
              setId: set.id,
              reps: parseNumberInput(e.target.value) ?? 0,
            })
          }
        />
      </div>

      <div className="min-w-0">
        <Label htmlFor={`${exerciseId}-${set.id}-weight`}>Weight</Label>
        <Input
          id={`${exerciseId}-${set.id}-weight`}
          type="number"
          min={0}
          value={set.weight}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_SET_WEIGHT",
              exerciseId,
              setId: set.id,
              weight: parseNumberInput(e.target.value) ?? 0,
            })
          }
        />
      </div>

      <div className="flex min-w-0 gap-2 sm:min-w-fit">
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            dispatch({
              type: "REMOVE_SET",
              exerciseId,
              setId: set.id,
            })
          }
          className="flex-1 sm:flex-none"
        >
          Remove
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            dispatch({
              type: "ADD_SET",
              exerciseId,
            })
          }
          className="flex-1 sm:flex-none"
        >
          Add Set
        </Button>
      </div>
    </div>
  );
}