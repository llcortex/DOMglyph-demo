import { FormEvent } from "react";
import { AIRole, AIState, createAIAttributes } from "@domglyph/ai-contract";
import { ActionButton } from "@domglyph/components";
import { Box, Stack, Text } from "@domglyph/primitives";
import { MetadataPill } from "./MetadataPill";

export type PreferenceValues = {
  emailNotifications: string;
  theme: string;
};

type PreferencesCardProps = {
  values: PreferenceValues;
  loading: boolean;
  showAIView: boolean;
  onChange: (values: PreferenceValues) => void;
  onSubmit: () => void;
};

export function PreferencesCard({
  values,
  loading,
  showAIView,
  onChange,
  onSubmit
}: PreferencesCardProps) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Box
      as="form"
      id="customer-preferences-form"
      className="form-shell"
      onSubmit={submit}
      {...createAIAttributes({
        id: "customer-preferences-form",
        role: AIRole.FORM,
        section: "preferences",
        entity: "customer",
        entityId: "customer-001",
        state: loading ? AIState.LOADING : AIState.IDLE
      })}
    >
      <Stack gap="var(--demo-space-4)">
        <div className="two-column-grid">
          <Stack gap="var(--demo-space-2)">
            <Text as="label" htmlFor="email-notifications">
              Email notifications
            </Text>
            <select
              id="email-notifications"
              className="select-field"
              value={values.emailNotifications}
              disabled={loading}
              onChange={(event) =>
                onChange({ ...values, emailNotifications: event.target.value })
              }
              {...createAIAttributes({
                id: "email-notifications",
                role: AIRole.FIELD,
                fieldType: "select",
                required: true,
                state: AIState.IDLE
              })}
            >
              <option value="Immediate">Immediate</option>
              <option value="Digest">Digest</option>
              <option value="Off">Off</option>
            </select>
            <Text as="p" tone="muted">
              A simple settings field with explicit `data-ai-field-type`.
            </Text>
          </Stack>

          <Stack gap="var(--demo-space-2)">
            <Text as="label" htmlFor="theme-preference">
              Theme preference
            </Text>
            <select
              id="theme-preference"
              className="select-field"
              value={values.theme}
              disabled={loading}
              onChange={(event) => onChange({ ...values, theme: event.target.value })}
              {...createAIAttributes({
                id: "theme-preference",
                role: AIRole.FIELD,
                fieldType: "select",
                required: true,
                state: AIState.IDLE
              })}
            >
              <option value="Warm light">Warm light</option>
              <option value="Neutral">Neutral</option>
              <option value="High contrast">High contrast</option>
            </select>
            <Text as="p" tone="muted">
              Demonstrates a second action scope inside the same screen.
            </Text>
          </Stack>
        </div>

        <Stack direction="row" justify="space-between" align="center">
          <MetadataPill
            show={showAIView}
            title="Preferences action"
            attributes={{
              "data-ai-action": "save-preferences",
              "data-ai-role": "action",
              "data-ai-result": "preferences updated"
            }}
          />
          <ActionButton
            type="submit"
            action={{
              id: "save-preferences",
              name: "Save preferences",
              target: "customer-001",
              expectedOutcome: "preferences updated"
            }}
            aiId="save-preferences-button"
            aiState={loading ? AIState.LOADING : AIState.IDLE}
            loading={loading}
            loadingLabel="Saving preferences"
          >
            {loading ? "Saving..." : "Save preferences"}
          </ActionButton>
        </Stack>
      </Stack>
    </Box>
  );
}
