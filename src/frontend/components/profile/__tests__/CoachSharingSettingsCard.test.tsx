import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import CoachSharingSettingsCard from "../CoachSharingSettingsCard";

describe("CoachSharingSettingsCard", () => {
  it("shows 'Sharing disabled' when not enabled", () => {
    render(
      <CoachSharingSettingsCard enabled={false} onManage={vi.fn()} />
    );
    expect(screen.getByText("Sharing disabled")).toBeInTheDocument();
  });

  it("shows 'Sharing enabled' when enabled", () => {
    render(
      <CoachSharingSettingsCard enabled={true} onManage={vi.fn()} />
    );
    expect(screen.getByText("Sharing enabled")).toBeInTheDocument();
  });

  it("shows coach name when sharing is enabled with a name", () => {
    render(
      <CoachSharingSettingsCard
        enabled={true}
        coachName="Coach Bob"
        onManage={vi.fn()}
      />
    );
    expect(screen.getByText("Coach: Coach Bob")).toBeInTheDocument();
  });

  it("does not show coach name when sharing disabled even if name provided", () => {
    render(
      <CoachSharingSettingsCard
        enabled={false}
        coachName="Coach Bob"
        onManage={vi.fn()}
      />
    );
    expect(screen.queryByText("Coach: Coach Bob")).not.toBeInTheDocument();
  });

  it("shows 'Enable sharing' button when disabled", () => {
    render(
      <CoachSharingSettingsCard enabled={false} onManage={vi.fn()} />
    );
    expect(
      screen.getByRole("button", { name: "Enable sharing" })
    ).toBeInTheDocument();
  });

  it("shows 'Manage sharing' button when enabled", () => {
    render(
      <CoachSharingSettingsCard enabled={true} onManage={vi.fn()} />
    );
    expect(
      screen.getByRole("button", { name: "Manage sharing" })
    ).toBeInTheDocument();
  });

  it("shows link to share page only when enabled", () => {
    render(
      <CoachSharingSettingsCard enabled={true} onManage={vi.fn()} />
    );
    expect(screen.getByRole("link", { name: /View share page/i })).toBeInTheDocument();
  });

  it("does not show share page link when disabled", () => {
    render(
      <CoachSharingSettingsCard enabled={false} onManage={vi.fn()} />
    );
    expect(screen.queryByRole("link", { name: /View share page/i })).not.toBeInTheDocument();
  });

  it("calls onManage when the manage button is clicked", async () => {
    const onManage = vi.fn();
    render(<CoachSharingSettingsCard enabled={false} onManage={onManage} />);
    await userEvent.click(screen.getByRole("button", { name: "Enable sharing" }));
    expect(onManage).toHaveBeenCalledOnce();
  });
});
