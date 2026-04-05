import { ButtonBase, Stack, Text } from "@domglyph/primitives";
import { AIRole, AIState, createAIAttributes } from "@domglyph/ai-contract";

type AIInspectorToggleProps = {
  checked: boolean;
  onChange: (nextValue: boolean) => void;
};

export function AIInspectorToggle({ checked, onChange }: AIInspectorToggleProps) {
  return (
    <Stack gap="var(--demo-space-2)" align="flex-end">
      <ButtonBase
        className="inspector-toggle"
        onClick={() => onChange(!checked)}
        {...createAIAttributes({
          id: "toggle-ai-view",
          role: AIRole.ACTION,
          action: "toggle-ai-view",
          state: checked ? AIState.SELECTED : AIState.IDLE
        })}
      >
        {checked ? "Hide AI View" : "Show AI View"}
      </ButtonBase>
      <Text as="p" className="toggle-copy">
        Reveals the machine-readable `data-ai-*` contract used by the runtime and tests.
      </Text>
    </Stack>
  );
}
