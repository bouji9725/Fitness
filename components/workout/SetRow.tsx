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

// Single editable set row.
// Keep editing controls compact and easy to scan.
export default function SetRow({ exerciseId, set, dispatch }: SetRowProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
        <div>
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

        <div>
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
          <label className="flex min-h-11 items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 text-sm text-slate-200">
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
              className="h-4 w-4 rounded border-slate-300"
            />
            Completed
          </label>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          variant="danger"
          onClick={() =>
            dispatch({
              type: "REMOVE_SET",
              exerciseId,
              setId: set.id,
            })
          }
        >
          Remove set
        </Button>

        <Button
          variant="secondary"
          onClick={() =>
            dispatch({
              type: "ADD_SET",
              exerciseId,
            })
          }
        >
          Add set
        </Button>
      </div>
    </div>
  );
}