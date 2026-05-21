import { describe, it, expect } from "vitest";
import { distributeMacrosToMeals } from "../nutrition";
import type { MacroTarget, MealStructure } from "@shared/types/nutrition";

const daily: MacroTarget = {
  calories: 2000,
  proteinGrams: 150,
  carbsGrams: 200,
  fatGrams: 60,
};

const zero: MacroTarget = {
  calories: 0,
  proteinGrams: 0,
  carbsGrams: 0,
  fatGrams: 0,
};

function sumMacro(plan: ReturnType<typeof distributeMacrosToMeals>, key: keyof MacroTarget): number {
  return plan.slots.reduce((acc, s) => acc + s.target[key], 0);
}

// ── Structure and slot names ─────────────────────────────────────────────────

describe("3-meals", () => {
  const plan = distributeMacrosToMeals(daily, "3-meals", "rest");

  it("returns 3 slots", () => expect(plan.slots).toHaveLength(3));

  it("names slots Breakfast · Lunch · Dinner", () => {
    expect(plan.slots.map((s) => s.name)).toEqual(["Breakfast", "Lunch", "Dinner"]);
  });

  it("assigns ascending indexes", () => {
    expect(plan.slots.map((s) => s.index)).toEqual([0, 1, 2]);
  });

  it("gives Breakfast ~30% of protein", () => {
    expect(plan.slots[0].target.proteinGrams).toBeCloseTo(daily.proteinGrams * 0.30, 0);
  });

  it("gives Lunch/Dinner ~35% of protein each (within 1 g of rounding)", () => {
    const target = daily.proteinGrams * 0.35;
    for (const slot of [plan.slots[1], plan.slots[2]]) {
      expect(slot.target.proteinGrams).toBeGreaterThanOrEqual(Math.floor(target));
      expect(slot.target.proteinGrams).toBeLessThanOrEqual(Math.ceil(target));
    }
  });
});

describe("3-meals-1-snack", () => {
  const plan = distributeMacrosToMeals(daily, "3-meals-1-snack", "rest");

  it("returns 4 slots", () => expect(plan.slots).toHaveLength(4));

  it("names slots Breakfast · Snack · Lunch · Dinner", () => {
    expect(plan.slots.map((s) => s.name)).toEqual(["Breakfast", "Snack", "Lunch", "Dinner"]);
  });

  it("Snack gets ~15% of carbs", () => {
    expect(plan.slots[1].target.carbsGrams).toBeCloseTo(daily.carbsGrams * 0.15, 0);
  });
});

describe("3-meals-2-snacks", () => {
  const plan = distributeMacrosToMeals(daily, "3-meals-2-snacks", "rest");

  it("returns 5 slots", () => expect(plan.slots).toHaveLength(5));

  it("names slots correctly", () => {
    expect(plan.slots.map((s) => s.name)).toEqual([
      "Breakfast", "Snack 1", "Lunch", "Snack 2", "Dinner",
    ]);
  });

  it("each snack gets ~10% of fat", () => {
    expect(plan.slots[1].target.fatGrams).toBeCloseTo(daily.fatGrams * 0.10, 0);
    expect(plan.slots[3].target.fatGrams).toBeCloseTo(daily.fatGrams * 0.10, 0);
  });
});

describe("2-meals-1-snack", () => {
  const plan = distributeMacrosToMeals(daily, "2-meals-1-snack", "rest");

  it("returns 3 slots", () => expect(plan.slots).toHaveLength(3));

  it("names slots Meal 1 · Snack · Meal 2", () => {
    expect(plan.slots.map((s) => s.name)).toEqual(["Meal 1", "Snack", "Meal 2"]);
  });

  it("Meal 1 and Meal 2 receive equal protein", () => {
    expect(plan.slots[0].target.proteinGrams).toBe(plan.slots[2].target.proteinGrams);
  });
});

// ── Intermittent fasting ─────────────────────────────────────────────────────

describe("intermittent-fasting-16-8", () => {
  it("returns 2 equal slots", () => {
    const plan = distributeMacrosToMeals(daily, "intermittent-fasting-16-8", "rest");
    expect(plan.slots).toHaveLength(2);
    expect(plan.slots[0].target.proteinGrams).toBe(plan.slots[1].target.proteinGrams);
    expect(plan.slots[0].target.carbsGrams).toBe(plan.slots[1].target.carbsGrams);
    expect(plan.slots[0].target.fatGrams).toBe(plan.slots[1].target.fatGrams);
  });

  it("defaults time labels to ~12:00 and ~16:00", () => {
    const plan = distributeMacrosToMeals(daily, "intermittent-fasting-16-8", "rest");
    expect(plan.slots[0].timeLabel).toBe("~12:00");
    expect(plan.slots[1].timeLabel).toBe("~16:00");
  });

  it("shifts time labels when fastingWindowStart is set", () => {
    const plan = distributeMacrosToMeals(daily, "intermittent-fasting-16-8", "rest", {
      fastingWindowStart: "14:00",
    });
    expect(plan.slots[0].timeLabel).toBe("~14:00");
    expect(plan.slots[1].timeLabel).toBe("~18:00");
  });

  it("handles midnight-crossing fasting window", () => {
    const plan = distributeMacrosToMeals(daily, "intermittent-fasting-16-8", "rest", {
      fastingWindowStart: "22:00",
    });
    expect(plan.slots[1].timeLabel).toBe("~02:00");
  });
});

// ── Training day split ───────────────────────────────────────────────────────

describe("training-day-split", () => {
  const plan = distributeMacrosToMeals(daily, "training-day-split", "training");

  it("returns 4 slots", () => expect(plan.slots).toHaveLength(4));

  it("names slots Pre-workout · Post-workout · Breakfast · Dinner", () => {
    expect(plan.slots.map((s) => s.name)).toEqual([
      "Pre-workout", "Post-workout", "Breakfast", "Dinner",
    ]);
  });

  it("routes ~35% of carbs to the two workout slots", () => {
    const workoutCarbs =
      plan.slots[0].target.carbsGrams + plan.slots[1].target.carbsGrams;
    expect(workoutCarbs).toBeCloseTo(daily.carbsGrams * 0.35, 0);
  });

  it("post-workout slot has more protein than pre-workout", () => {
    expect(plan.slots[1].target.proteinGrams).toBeGreaterThan(
      plan.slots[0].target.proteinGrams
    );
  });

  it("omits time labels when workoutTime is not provided", () => {
    expect(plan.slots[0].timeLabel).toBeUndefined();
    expect(plan.slots[1].timeLabel).toBeUndefined();
  });

  it("computes time labels from workoutTime", () => {
    const timed = distributeMacrosToMeals(daily, "training-day-split", "training", {
      workoutTime: "10:00",
    });
    expect(timed.slots[0].timeLabel).toBe("09:00"); // T − 1 h
    expect(timed.slots[1].timeLabel).toBe("10:45"); // T + 45 min
  });

  it("handles workout time near midnight", () => {
    const timed = distributeMacrosToMeals(daily, "training-day-split", "training", {
      workoutTime: "00:30",
    });
    expect(timed.slots[0].timeLabel).toBe("23:30"); // T − 1 h wraps
  });
});

// ── Rest day split ───────────────────────────────────────────────────────────

describe("rest-day-split", () => {
  const plan = distributeMacrosToMeals(daily, "rest-day-split", "rest");

  it("returns 3 slots named Breakfast · Lunch · Dinner", () => {
    expect(plan.slots.map((s) => s.name)).toEqual(["Breakfast", "Lunch", "Dinner"]);
  });

  it("Breakfast has more fat than Dinner", () => {
    expect(plan.slots[0].target.fatGrams).toBeGreaterThanOrEqual(
      plan.slots[2].target.fatGrams
    );
  });

  it("Dinner has more carbs than Breakfast", () => {
    expect(plan.slots[2].target.carbsGrams).toBeGreaterThan(
      plan.slots[0].target.carbsGrams
    );
  });
});

// ── Zero-target edge case ────────────────────────────────────────────────────

describe("zero daily targets", () => {
  const structures: MealStructure[] = [
    "3-meals",
    "3-meals-1-snack",
    "3-meals-2-snacks",
    "2-meals-1-snack",
    "intermittent-fasting-16-8",
    "training-day-split",
    "rest-day-split",
  ];

  for (const structure of structures) {
    it(`all slots are zero for ${structure}`, () => {
      const plan = distributeMacrosToMeals(zero, structure, "rest");
      for (const slot of plan.slots) {
        expect(slot.target.proteinGrams).toBe(0);
        expect(slot.target.carbsGrams).toBe(0);
        expect(slot.target.fatGrams).toBe(0);
        expect(slot.target.calories).toBe(0);
      }
    });
  }
});

// ── Totals invariant ─────────────────────────────────────────────────────────

describe("macro totals always sum to daily target (rounded)", () => {
  const structures: MealStructure[] = [
    "3-meals",
    "3-meals-1-snack",
    "3-meals-2-snacks",
    "2-meals-1-snack",
    "intermittent-fasting-16-8",
    "training-day-split",
    "rest-day-split",
  ];

  for (const structure of structures) {
    describe(structure, () => {
      const plan = distributeMacrosToMeals(daily, structure, "training");

      it("protein sums to daily target", () => {
        expect(sumMacro(plan, "proteinGrams")).toBe(Math.round(daily.proteinGrams));
      });

      it("carbs sums to daily target", () => {
        expect(sumMacro(plan, "carbsGrams")).toBe(Math.round(daily.carbsGrams));
      });

      it("fat sums to daily target", () => {
        expect(sumMacro(plan, "fatGrams")).toBe(Math.round(daily.fatGrams));
      });
    });
  }
});

// ── Slot calories derived from macros ────────────────────────────────────────

describe("slot calories equal protein×4 + carbs×4 + fat×9", () => {
  const plan = distributeMacrosToMeals(daily, "training-day-split", "training", {
    workoutTime: "08:00",
  });

  for (const slot of plan.slots) {
    it(`${slot.name} calories are internally consistent`, () => {
      const expected = Math.round(
        slot.target.proteinGrams * 4 +
        slot.target.carbsGrams * 4 +
        slot.target.fatGrams * 9
      );
      expect(slot.target.calories).toBe(expected);
    });
  }
});

// ── Return shape ─────────────────────────────────────────────────────────────

describe("return shape", () => {
  it("echoes structure, dayType, and dailyTarget onto the plan", () => {
    const plan = distributeMacrosToMeals(daily, "3-meals", "training");
    expect(plan.structure).toBe("3-meals");
    expect(plan.dayType).toBe("training");
    expect(plan.dailyTarget).toBe(daily);
  });
});
