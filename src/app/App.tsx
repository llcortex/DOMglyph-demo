import { useMemo, useState } from "react";
import { AIEvent, AIRole, AIState, createAIAttributes } from "@cortexui/ai-contract";
import { ActionButton, ConfirmDialog, StatusBanner } from "@cortexui/components";
import { Box, Stack, Text, ButtonBase, primitiveTheme } from "@cortexui/primitives";
import { colorTokens } from "@cortexui/tokens";
import { AIInspectorToggle } from "../components/AIInspectorToggle";
import { CustomerProfileForm, type ProfileFormValues } from "../components/CustomerProfileForm";
import { OrdersTable } from "../components/OrdersTable";
import { PreferencesCard, type PreferenceValues } from "../components/PreferencesCard";
import { RuntimeDebugPanel } from "../components/RuntimeDebugPanel";
import { MetadataPill } from "../components/MetadataPill";
import { mockCustomer } from "../data/mockCustomer";
import { mockOrders } from "../data/mockOrders";

type BannerState =
  | { kind: "success"; title: string; message: string; event: (typeof AIEvent)[keyof typeof AIEvent] }
  | { kind: "error"; title: string; message: string; event: (typeof AIEvent)[keyof typeof AIEvent] }
  | { kind: "info"; title: string; message: string; event: (typeof AIEvent)[keyof typeof AIEvent] }
  | null;

const screenAttributes = createAIAttributes({
  id: "customer-profile-screen",
  role: AIRole.SCREEN,
  screen: "customer-profile",
  entity: "customer",
  entityId: mockCustomer.id,
  state: AIState.IDLE
});

const profileSectionAttributes = createAIAttributes({
  id: "customer-profile-section",
  role: AIRole.SECTION,
  section: "profile-form"
});

const preferencesSectionAttributes = createAIAttributes({
  id: "customer-preferences-section",
  role: AIRole.SECTION,
  section: "preferences"
});

const ordersSectionAttributes = createAIAttributes({
  id: "recent-orders-section",
  role: AIRole.SECTION,
  section: "recent-orders"
});

const feedbackSectionAttributes = createAIAttributes({
  id: "status-feedback-section",
  role: AIRole.SECTION,
  section: "status-feedback"
});

export function App() {
  const [showAIView, setShowAIView] = useState(false);
  const [profileValues, setProfileValues] = useState<ProfileFormValues>({
    fullName: mockCustomer.fullName,
    email: mockCustomer.email,
    role: mockCustomer.role,
    status: mockCustomer.status
  });
  const [preferences, setPreferences] = useState<PreferenceValues>({
    emailNotifications: mockCustomer.emailNotifications,
    theme: mockCustomer.theme
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [preferencesSaving, setPreferencesSaving] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [statusBanner, setStatusBanner] = useState<BannerState>({
    kind: "info",
    title: "Demo ready",
    message: "Open the AI View or runtime panel to inspect the machine-readable contract.",
    event: AIEvent.ACTION_COMPLETED
  });

  const appTheme = useMemo(
    () => ({
      ...primitiveTheme,
      "--demo-background": "#f3efe7",
      "--demo-panel": colorTokens.values.surface,
      "--demo-panel-alt": "#f9f6f0",
      "--demo-ink": colorTokens.values.accent,
      "--demo-accent": "#0f766e",
      "--demo-accent-soft": "#d9f5ef",
      "--demo-danger-soft": "#ffe2de",
      "--demo-border": "#d8d3c8",
      "--demo-muted": "#6b6a67",
      "--demo-space-1": "0.25rem",
      "--demo-space-2": "0.5rem",
      "--demo-space-3": "0.75rem",
      "--demo-space-4": "1rem",
      "--demo-space-5": "1.5rem",
      "--demo-space-6": "2rem",
      "--demo-radius-lg": "20px",
      "--demo-font-sans": "\"IBM Plex Sans\", \"Segoe UI\", sans-serif",
      "--demo-font-mono": "\"IBM Plex Mono\", \"SFMono-Regular\", monospace"
    }),
    []
  );

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setStatusBanner(null);

    await wait(900);

    if (!profileValues.email.includes("@")) {
      setStatusBanner({
        kind: "error",
        title: "Profile save failed",
        message: "The email field needs a valid address before CortexUI reports success.",
        event: AIEvent.ACTION_FAILED
      });
      setProfileSaving(false);
      return;
    }

    setStatusBanner({
      kind: "success",
      title: "Profile saved",
      message: "Customer profile changes were accepted and surfaced as a runtime event.",
      event: AIEvent.ACTION_COMPLETED
    });
    setProfileSaving(false);
  };

  const handlePreferencesSave = async () => {
    setPreferencesSaving(true);
    setStatusBanner(null);

    await wait(700);

    setStatusBanner({
      kind: "success",
      title: "Preferences saved",
      message: "Theme and notification choices are available through the screen runtime.",
      event: AIEvent.ACTION_COMPLETED
    });
    setPreferencesSaving(false);
  };

  const handleDeleteConfirm = async () => {
    setDeletePending(true);
    setStatusBanner(null);

    await wait(800);

    setStatusBanner({
      kind: "error",
      title: "Customer deleted",
      message: "The destructive flow completed. In a real app this would navigate away or archive the record.",
      event: AIEvent.ACTION_COMPLETED
    });
    setDeletePending(false);
    setShowDeleteDialog(false);
  };

  return (
    <Box as="main" className="app-shell" style={appTheme} {...screenAttributes}>
      <Stack className="app-grid" gap="var(--demo-space-6)">
        <Stack className="hero-panel" gap="var(--demo-space-4)">
          <Stack direction="row" justify="space-between" align="flex-start" gap="var(--demo-space-4)">
            <Stack gap="var(--demo-space-2)">
              <Text as="p" className="eyebrow">
                Standalone consumer app
              </Text>
              <Text as="h1" className="page-title">
                Customer Profile
              </Text>
              <Text as="p" className="page-copy">
                A small account management screen that shows how CortexUI components, AI metadata,
                runtime inspection, and testing fit together in a normal React app.
              </Text>
            </Stack>
            <Stack align="flex-end" gap="var(--demo-space-3)">
              <AIInspectorToggle checked={showAIView} onChange={setShowAIView} />
              <ButtonBase
                className="ghost-button"
                onClick={() => setStatusBanner(null)}
                {...createAIAttributes({
                  id: "dismiss-feedback",
                  role: AIRole.ACTION,
                  action: "dismiss-feedback",
                  state: AIState.IDLE
                })}
              >
                Clear feedback
              </ButtonBase>
            </Stack>
          </Stack>

          <Stack direction="row" gap="var(--demo-space-3)" className="tag-row">
            <MetadataPill
              show={showAIView}
              title="Screen metadata"
              attributes={{
                "data-ai-screen": "customer-profile",
                "data-ai-entity": "customer",
                "data-ai-entity-id": mockCustomer.id
              }}
            />
            <MetadataPill
              show={showAIView}
              title="Console alias"
              attributes={{
                "window.CORTEX_UI": "runtime API",
                "window.__CORTEX_UI__": "demo-friendly alias"
              }}
            />
          </Stack>
        </Stack>

        <div className="content-grid">
          <Stack gap="var(--demo-space-5)">
            <section className="panel-card" {...profileSectionAttributes}>
              <Stack gap="var(--demo-space-4)">
                <Stack gap="var(--demo-space-2)">
                  <Text as="h2" className="section-title">
                    Profile form
                  </Text>
                  <Text as="p" className="section-copy">
                    Uses `FormField`, `ActionButton`, and explicit screen/entity metadata so the
                    runtime can extract a schema for this form.
                  </Text>
                  <MetadataPill
                    show={showAIView}
                    title="Form contract"
                    attributes={{
                      "data-ai-role": "form",
                      "data-ai-id": "customer-profile-form",
                      "data-ai-section": "profile-form"
                    }}
                  />
                </Stack>
                <CustomerProfileForm
                  values={profileValues}
                  loading={profileSaving}
                  showAIView={showAIView}
                  onChange={setProfileValues}
                  onSubmit={handleProfileSave}
                />
              </Stack>
            </section>

            <section className="panel-card" {...preferencesSectionAttributes}>
              <Stack gap="var(--demo-space-4)">
                <Stack gap="var(--demo-space-2)">
                  <Text as="h2" className="section-title">
                    Preferences
                  </Text>
                  <Text as="p" className="section-copy">
                    A second section with its own actions and fields, using primitives directly for
                    select inputs while still preserving the AI contract.
                  </Text>
                  <MetadataPill
                    show={showAIView}
                    title="Section contract"
                    attributes={{
                      "data-ai-section": "preferences",
                      "data-ai-id": "customer-preferences-form"
                    }}
                  />
                </Stack>
                <PreferencesCard
                  values={preferences}
                  loading={preferencesSaving}
                  showAIView={showAIView}
                  onChange={setPreferences}
                  onSubmit={handlePreferencesSave}
                />
              </Stack>
            </section>

            <section className="panel-card" {...ordersSectionAttributes}>
              <Stack gap="var(--demo-space-4)">
                <Stack gap="var(--demo-space-2)">
                  <Text as="h2" className="section-title">
                    Recent orders
                  </Text>
                  <Text as="p" className="section-copy">
                    Demonstrates `DataTable`, row-level entity metadata, and a direct `InputBase`
                    filter control.
                  </Text>
                  <MetadataPill
                    show={showAIView}
                    title="Table contract"
                    attributes={{
                      "data-ai-role": "table",
                      "data-ai-entity": "order",
                      "data-ai-id": "customer-orders-table"
                    }}
                  />
                </Stack>
                <OrdersTable orders={mockOrders} showAIView={showAIView} />
              </Stack>
            </section>

            <section className="panel-card" {...feedbackSectionAttributes}>
              <Stack gap="var(--demo-space-4)">
                <Stack direction="row" justify="space-between" align="center">
                  <Stack gap="var(--demo-space-2)">
                    <Text as="h2" className="section-title">
                      Status and delete flow
                    </Text>
                    <Text as="p" className="section-copy">
                      Status banners emit runtime events and the confirm dialog exposes destructive
                      action metadata.
                    </Text>
                  </Stack>
                  <ActionButton
                    action={{
                      id: "open-delete-customer-dialog",
                      name: "Open delete customer dialog",
                      target: mockCustomer.id,
                      expectedOutcome: "Delete flow opens"
                    }}
                    aiId="open-delete-customer-dialog"
                    aiState={deletePending ? AIState.DISABLED : AIState.IDLE}
                    disabled={deletePending}
                    onClick={() => setShowDeleteDialog(true)}
                    style={{ background: "#9f1239" }}
                  >
                    Delete customer
                  </ActionButton>
                </Stack>

                <MetadataPill
                  show={showAIView}
                  title="Action contract"
                  attributes={{
                    "data-ai-action": "open-delete-customer-dialog",
                    "data-ai-role": "action",
                    "data-ai-state": deletePending ? "disabled" : "idle"
                  }}
                />

                {statusBanner ? (
                  <StatusBanner
                    aiId={`status-banner-${statusBanner.kind}`}
                    event={statusBanner.event}
                    status={statusBanner.kind}
                    title={statusBanner.title}
                  >
                    {statusBanner.message}
                  </StatusBanner>
                ) : (
                  <Box className="banner-placeholder">
                    <Text as="p" tone="muted">
                      Trigger a save or delete action to generate observable status feedback.
                    </Text>
                  </Box>
                )}
              </Stack>
            </section>
          </Stack>

          <RuntimeDebugPanel showAIView={showAIView} />
        </div>
      </Stack>

      <ConfirmDialog
        aiId="delete-customer-dialog"
        open={showDeleteDialog}
        title="Delete this customer?"
        description="This demo does not call a backend, but it still exposes the destructive intent through the runtime and AI contract."
        confirmAction={{
          id: "confirm-delete-customer",
          name: "Confirm delete customer",
          target: mockCustomer.id,
          expectedOutcome: "Customer is deleted"
        }}
        cancelAction={{
          id: "cancel-delete-customer",
          name: "Cancel delete customer",
          target: mockCustomer.id,
          expectedOutcome: "Delete flow is cancelled"
        }}
        confirmLabel={deletePending ? "Deleting..." : "Delete customer"}
        cancelLabel="Keep customer"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </Box>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
