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
    <div className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-4">
      <div className="space-y-1">
        <Label htmlFor={`reps-${set.id}`}>Reps</Label>
        <Input
          id={`reps-${set.id}`}
          type="number"
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

      <div className="space-y-1">
        <Label htmlFor={`weight-${set.id}`}>Weight</Label>
        <Input
          id={`weight-${set.id}`}
          type="number"
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

      <div className="flex items-end">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={set.completed}
            onChange={() =>
              dispatch({
                type: "TOGGLE_SET_COMPLETED",
                exerciseId,
                setId: set.id,
              })
            }
            className="h-5 w-5 rounded border-slate-300"
          />
          Completed
        </label>
      </div>

      <div className="flex items-end gap-2">
        <Button
          type="button"
          variant="secondary"
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
          variant="secondary"
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