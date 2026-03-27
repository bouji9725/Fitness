import type { SetEntry } from "@/types/workout";
import type { WorkoutSessionAction } from "@/lib/workout-session-reducer";

type SetRowProps = {
  exerciseId: string;
  set: SetEntry;
  dispatch: React.Dispatch<WorkoutSessionAction>;
};

export default function SetRow({ exerciseId, set, dispatch }: SetRowProps) {
  return (
    <div className="grid grid-cols-[1fr_1fr_auto] gap-3 rounded-xl border border-slate-200 p-3">
      <input
        type="number"
        min={0}
        value={set.reps}
        onChange={(e) =>
          dispatch({
            type: "UPDATE_SET_REPS",
            exerciseId,
            setId: set.id,
            reps: Number(e.target.value),
          })
        }
        aria-label="Reps"
        className="min-h-11 rounded-xl border border-slate-200 px-3"
      />

      <input
        type="number"
        min={0}
        value={set.weight}
        onChange={(e) =>
          dispatch({
            type: "UPDATE_SET_WEIGHT",
            exerciseId,
            setId: set.id,
            weight: Number(e.target.value),
          })
        }
        aria-label="Weight"
        className="min-h-11 rounded-xl border border-slate-200 px-3"
      />

      <div className="flex items-center justify-center">
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
          aria-label="Completed set"
          className="h-5 w-5 rounded"
        />
      </div>
    </div>
  );
}