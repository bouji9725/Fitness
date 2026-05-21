import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import RestTimer from "../RestTimer";

describe("RestTimer", () => {
  describe("initial render", () => {
    it("renders 'Rest timer' heading", () => {
      render(<RestTimer onClose={vi.fn()} />);
      expect(screen.getByText("Rest timer")).toBeInTheDocument();
    });

    it("renders all 4 preset buttons", () => {
      render(<RestTimer onClose={vi.fn()} />);
      expect(screen.getByRole("button", { name: "60s" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "90s" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "120s" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "180s" })).toBeInTheDocument();
    });

    it("renders Start button initially (timer not running)", () => {
      render(<RestTimer onClose={vi.fn()} />);
      expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
    });

    it("renders −15s and +15s adjustment buttons", () => {
      render(<RestTimer onClose={vi.fn()} />);
      expect(
        screen.getByRole("button", { name: "Decrease by 15 seconds" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Increase by 15 seconds" })
      ).toBeInTheDocument();
    });

    it("shows default time display (1:30 from 90s default)", () => {
      render(<RestTimer onClose={vi.fn()} />);
      expect(screen.getByText("1:30")).toBeInTheDocument();
    });
  });

  describe("onClose", () => {
    it("calls onClose when ✕ button is clicked", () => {
      const onClose = vi.fn();
      render(<RestTimer onClose={onClose} />);
      fireEvent.click(screen.getByRole("button", { name: "Close rest timer" }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("start / stop", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("shows Stop button after clicking Start", () => {
      render(<RestTimer onClose={vi.fn()} />);
      fireEvent.click(screen.getByRole("button", { name: "Start" }));
      expect(screen.getByRole("button", { name: "Stop" })).toBeInTheDocument();
    });

    it("shows Start button again after clicking Stop", () => {
      render(<RestTimer onClose={vi.fn()} />);
      fireEvent.click(screen.getByRole("button", { name: "Start" }));
      fireEvent.click(screen.getByRole("button", { name: "Stop" }));
      expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
    });

    it("clicking a preset button starts the timer and shows Stop", () => {
      render(<RestTimer onClose={vi.fn()} />);
      fireEvent.click(screen.getByRole("button", { name: "60s" }));
      expect(screen.getByRole("button", { name: "Stop" })).toBeInTheDocument();
    });

    it("shows 'Rest complete' and 'Restart' when countdown reaches zero", () => {
      render(<RestTimer onClose={vi.fn()} />);
      fireEvent.click(screen.getByRole("button", { name: "60s" }));
      act(() => {
        vi.advanceTimersByTime(60_000);
      });
      expect(screen.getByText("Rest complete")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Restart" })).toBeInTheDocument();
    });

    it("decrements display while running", () => {
      render(<RestTimer onClose={vi.fn()} />);
      fireEvent.click(screen.getByRole("button", { name: "60s" }));
      act(() => {
        vi.advanceTimersByTime(5_000);
      });
      expect(screen.getByText("0:55")).toBeInTheDocument();
    });
  });
});
