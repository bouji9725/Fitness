import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecentWorkoutsList from "../RecentWorkoutsList";
import type { WorkoutSessionRecord } from "@shared/types/workout";

function makeRecord(id: string, name: string, notes?: string): WorkoutSessionRecord {
  return {
    session: {
      id,
      templateId: "t1",
      templateName: name,
      performedAt: "2026-01-01T10:00:00Z",
      status: "completed",
      exercises: [],
      createdAt: "2026-01-01T10:00:00Z",
      updatedAt: "2026-01-01T10:00:00Z",
      notes,
    },
    savedAt: "2026-01-01T10:05:00Z",
  };
}

const defaults = {
  hasMore: false,
  loadingMore: false,
  onLoadMore: () => {},
  onDelete: async () => {},
};

describe("RecentWorkoutsList", () => {
  describe("empty state", () => {
    it("shows empty state message when items is empty", () => {
      render(<RecentWorkoutsList {...defaults} items={[]} />);
      expect(
        screen.getByText(/No workouts yet/i)
      ).toBeInTheDocument();
    });
  });

  describe("session list", () => {
    it("renders each session's template name", () => {
      const items = [makeRecord("s1", "Push Day"), makeRecord("s2", "Pull Day")];
      render(<RecentWorkoutsList {...defaults} items={items} />);
      expect(screen.getByText("Push Day")).toBeInTheDocument();
      expect(screen.getByText("Pull Day")).toBeInTheDocument();
    });

    it("renders a Delete button for each session", () => {
      const items = [makeRecord("s1", "Push Day"), makeRecord("s2", "Pull Day")];
      render(<RecentWorkoutsList {...defaults} items={items} />);
      expect(screen.getAllByRole("button", { name: /Delete/i })).toHaveLength(2);
    });

    it("shows session notes when present", () => {
      const items = [makeRecord("s1", "Push Day", "felt great today")];
      render(<RecentWorkoutsList {...defaults} items={items} />);
      expect(screen.getByText(/felt great today/)).toBeInTheDocument();
    });

    it("does not show notes section when notes is absent", () => {
      const items = [makeRecord("s1", "Push Day")];
      render(<RecentWorkoutsList {...defaults} items={items} />);
      expect(screen.queryByRole("paragraph", { name: /felt/i })).not.toBeInTheDocument();
    });
  });

  describe("load more", () => {
    it("shows Load more button when hasMore=true", () => {
      render(
        <RecentWorkoutsList
          {...defaults}
          items={[makeRecord("s1", "Push Day")]}
          hasMore={true}
        />
      );
      expect(screen.getByRole("button", { name: "Load more" })).toBeInTheDocument();
    });

    it("does not show Load more button when hasMore=false", () => {
      render(
        <RecentWorkoutsList
          {...defaults}
          items={[makeRecord("s1", "Push Day")]}
          hasMore={false}
        />
      );
      expect(screen.queryByRole("button", { name: "Load more" })).not.toBeInTheDocument();
    });

    it("shows 'Loading…' text when loadingMore=true", () => {
      render(
        <RecentWorkoutsList
          {...defaults}
          items={[makeRecord("s1", "Push Day")]}
          hasMore={true}
          loadingMore={true}
        />
      );
      expect(screen.getByRole("button", { name: "Loading…" })).toBeInTheDocument();
    });

    it("calls onLoadMore when Load more is clicked", () => {
      const onLoadMore = vi.fn();
      render(
        <RecentWorkoutsList
          {...defaults}
          items={[makeRecord("s1", "Push Day")]}
          hasMore={true}
          onLoadMore={onLoadMore}
        />
      );
      fireEvent.click(screen.getByRole("button", { name: "Load more" }));
      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });
  });

  describe("delete", () => {
    it("calls onDelete with the correct session id", async () => {
      const onDelete = vi.fn().mockResolvedValue(undefined);
      const items = [makeRecord("s1", "Push Day"), makeRecord("s2", "Pull Day")];
      render(<RecentWorkoutsList {...defaults} items={items} onDelete={onDelete} />);
      fireEvent.click(screen.getByRole("button", { name: /Delete Push Day/i }));
      await waitFor(() => expect(onDelete).toHaveBeenCalledWith("s1"));
    });

    it("shows 'Deleting…' while the delete is in progress", async () => {
      const onDelete = vi.fn(() => new Promise<void>(() => {}));
      const items = [makeRecord("s1", "Push Day")];
      render(<RecentWorkoutsList {...defaults} items={items} onDelete={onDelete} />);
      fireEvent.click(screen.getByRole("button", { name: /Delete Push Day/i }));
      expect(await screen.findByText("Deleting…")).toBeInTheDocument();
    });

    it("delete button is disabled while deleting", async () => {
      const onDelete = vi.fn(() => new Promise<void>(() => {}));
      const items = [makeRecord("s1", "Push Day")];
      render(<RecentWorkoutsList {...defaults} items={items} onDelete={onDelete} />);
      fireEvent.click(screen.getByRole("button", { name: /Delete Push Day/i }));
      const btn = await screen.findByRole("button", { name: /Delete Push Day/i });
      expect(btn).toBeDisabled();
    });
  });
});
