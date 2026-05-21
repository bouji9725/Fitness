import type { SetEntry } from "@shared/types/workout";
import type { WorkoutSessionAction } from "@frontend/workout-session-reducer";
import Button from "@frontend/components/ui/Button";
import Input from "@frontend/components/ui/Input";
import Label from "@frontend/components/ui/Label";
import { parseNumberInput } from "@shared/utils/number";

type SetRowProps = {
  exerciseId: string;
  set: SetEntry;
  dispatch: React.Dispatch<WorkoutSessionAction>;
};

export default function SetRow({ exerciseId, set, dispatch }: SetRowProps) {
  function adjustWeight(delta: number) {
    dispatch({
      type: "UPDATE_SET_WEIGHT",
      exerciseId,
      setId: set.id,
      weight: Math.max(0, (set.weight ?? 0) + delta),
    });
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
        <div>
          <Label htmlFor={`reps-${set.id}`}>Reps</Label>
          <Input
            id={`reps-${set.id}`}
            type="number"
            value={set.reps ?? ""}
            onFocus={(e) => e.target.select()}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_SET_REPS",
                exerciseId,
                setId: set.id,
                reps: parseNumberInput(e.target.value),
              })
            }
          />
        </div>

        <div>
          <Label htmlFor={`weight-${set.id}`}>Weight (kg)</Label>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => adjustWeight(-2)}
              aria-label="Decrease weight by 2 kg"
              className="flex h-11 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 active:scale-95"
            >
              −2
            </button>

            <Input
              id={`weight-${set.id}`}
              type="number"
              value={set.weight ?? ""}
              onFocus={(e) => e.target.select()}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_SET_WEIGHT",
                  exerciseId,
                  setId: set.id,
                  weight: parseNumberInput(e.target.value),
                })
              }
            />

            <button
              type="button"
              onClick={() => adjustWeight(2)}
              aria-label="Increase weight by 2 kg"
              className="flex h-11 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 active:scale-95"
            >
              +2
            </button>
          </div>
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
