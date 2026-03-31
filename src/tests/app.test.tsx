import { render, screen, waitFor } from "@testing-library/react";
import { installCortexUIRuntime } from "@cortexui/runtime";
import { createMetadataSnapshot, runComponentComplianceChecks } from "@cortexui/testing";
import { App } from "../app/App";

describe("CortexUI demo app", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    const runtime = installCortexUIRuntime(window);
    window.__CORTEX_UI__ = runtime;
  });

  it("renders screen metadata for the customer profile screen", () => {
    render(<App />);

    const screenRoot = screen.getByRole("main");

    expect(screenRoot).toHaveAttribute("data-ai-screen", "customer-profile");
    expect(screenRoot).toHaveAttribute("data-ai-entity", "customer");
    expect(screenRoot).toHaveAttribute("data-ai-entity-id", "customer-001");
    expect(screenRoot).toBeAIContractValid();
  });

  it("exposes expected data-ai attributes for the main save action", () => {
    render(<App />);

    const saveButton = screen.getByRole("button", { name: "Save profile" });
    const compliance = runComponentComplianceChecks(saveButton, {
      requiredAttributes: ["data-ai-id", "data-ai-role", "data-ai-action"]
    });

    expect(saveButton).toHaveAIAttributes({
      "data-ai-id": "save-profile-button",
      "data-ai-role": "action",
      "data-ai-action": "save-profile"
    });
    expect(compliance.contract.valid).toBe(true);
  });

  it("registers actions in the runtime and exposes form schema", async () => {
    render(<App />);

    await waitFor(() => {
      const runtime = window.__CORTEX_UI__;

      expect(runtime).not.toBeNull();
      expect(
        runtime?.getAvailableActions().some((action) => action.id === "save-profile")
      ).toBe(true);
      expect(runtime?.getFormSchema("customer-profile-form")?.fields.length).toBeGreaterThan(0);
    });
  });

  it("creates a metadata snapshot that documents AI-readable markup", () => {
    render(<App />);

    const form = document.getElementById("customer-profile-form");
    const snapshot = createMetadataSnapshot("customer-profile-form", form!);

    expect(snapshot.target).toBe("customer-profile-form");
    expect(snapshot.attributes["data-ai-role"]).toBe("form");
  });
});
