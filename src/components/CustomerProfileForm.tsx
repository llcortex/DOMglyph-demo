import { FormEvent } from "react";
import { AIRole, AIState, createAIAttributes } from "@cortexui/ai-contract";
import { ActionButton, FormField } from "@cortexui/components";
import { Box, Stack, Text } from "@cortexui/primitives";
import { MetadataPill } from "./MetadataPill";

export type ProfileFormValues = {
  fullName: string;
  email: string;
  role: string;
  status: string;
};

type CustomerProfileFormProps = {
  values: ProfileFormValues;
  loading: boolean;
  showAIView: boolean;
  onChange: (values: ProfileFormValues) => void;
  onSubmit: () => void;
};

const roleFieldAttributes = createAIAttributes({
  id: "customer-role",
  role: AIRole.FIELD,
  fieldType: "select",
  required: true,
  state: AIState.IDLE
});

const statusFieldAttributes = createAIAttributes({
  id: "customer-status",
  role: AIRole.FIELD,
  fieldType: "select",
  required: true,
  state: AIState.IDLE
});

export function CustomerProfileForm({
  values,
  loading,
  showAIView,
  onChange,
  onSubmit
}: CustomerProfileFormProps) {
  const emailError =
    values.email.length > 0 && !values.email.includes("@")
      ? "Use an email address with an @ symbol so the save action can succeed."
      : undefined;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Box
      as="form"
      id="customer-profile-form"
      className="form-shell"
      onSubmit={submit}
      {...createAIAttributes({
        id: "customer-profile-form",
        role: AIRole.FORM,
        section: "profile-form",
        entity: "customer",
        entityId: "customer-001",
        state: loading ? AIState.LOADING : AIState.IDLE
      })}
    >
      <Stack gap="var(--demo-space-4)">
        <div className="two-column-grid">
          <FormField
            fieldId="customer-full-name"
            fieldType="text"
            label="Full name"
            required
            hint="A standard text field rendered through CortexUI components."
            placeholder="Avery Johnson"
            value={values.fullName}
            disabled={loading}
            onChange={(event) => onChange({ ...values, fullName: event.target.value })}
          />

          <FormField
            fieldId="customer-email"
            fieldType="email"
            label="Email"
            required
            hint="The runtime reads this as a required email field."
            placeholder="avery@example.com"
            value={values.email}
            error={emailError}
            disabled={loading}
            onChange={(event) => onChange({ ...values, email: event.target.value })}
          />

          <Stack gap="var(--demo-space-2)">
            <Text as="label" htmlFor="customer-role">
              Role <Text as="span" tone="danger">*</Text>
            </Text>
            <select
              id="customer-role"
              className="select-field"
              value={values.role}
              disabled={loading}
              onChange={(event) => onChange({ ...values, role: event.target.value })}
              {...roleFieldAttributes}
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Analyst">Analyst</option>
            </select>
            <Text as="p" tone="muted">
              A native select with explicit AI field metadata.
            </Text>
          </Stack>

          <Stack gap="var(--demo-space-2)">
            <Text as="label" htmlFor="customer-status">
              Status <Text as="span" tone="danger">*</Text>
            </Text>
            <select
              id="customer-status"
              className="select-field"
              value={values.status}
              disabled={loading}
              onChange={(event) => onChange({ ...values, status: event.target.value })}
              {...statusFieldAttributes}
            >
              <option value="Active">Active</option>
              <option value="Review">Review</option>
              <option value="Paused">Paused</option>
            </select>
            <Text as="p" tone="muted">
              Keeps status machine-readable for runtime schema extraction.
            </Text>
          </Stack>
        </div>

        <Stack direction="row" justify="space-between" align="center">
          <MetadataPill
            show={showAIView}
            title="Submit action"
            attributes={{
              "data-ai-action": "save-profile",
              "data-ai-result": "customer profile persisted",
              "data-ai-role": "action"
            }}
          />
          <ActionButton
            type="submit"
            action={{
              id: "save-profile",
              name: "Save profile",
              target: "customer-001",
              expectedOutcome: "customer profile persisted"
            }}
            aiId="save-profile-button"
            aiState={loading ? AIState.LOADING : AIState.IDLE}
            loading={loading}
            loadingLabel="Saving profile"
          >
            {loading ? "Saving..." : "Save profile"}
          </ActionButton>
        </Stack>
      </Stack>
    </Box>
  );
}
