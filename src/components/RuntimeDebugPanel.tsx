import { useEffect, useState } from "react";
import { extractAIAttributes } from "@domglyph/ai-contract";
import { Box, Stack, Text } from "@domglyph/primitives";

type RuntimeDebugPanelProps = {
  showAIView: boolean;
};

type RuntimeSnapshot = {
  screenContext: unknown;
  actions: readonly unknown[];
  events: readonly unknown[];
  formSchema: unknown;
  metadataSummary: Array<{ id: string; role: string; attrs: Record<string, string> }>;
};

const emptySnapshot: RuntimeSnapshot = {
  screenContext: null,
  actions: [],
  events: [],
  formSchema: null,
  metadataSummary: []
};

export function RuntimeDebugPanel({ showAIView }: RuntimeDebugPanelProps) {
  const [snapshot, setSnapshot] = useState<RuntimeSnapshot>(emptySnapshot);

  useEffect(() => {
    const updateSnapshot = () => {
      const runtime = window.__DOMGLYPH__  ?? null;

      const metadataSummary = Array.from(document.querySelectorAll<HTMLElement>("[data-ai-id]"))
        .slice(0, 14)
        .map((element) => {
          const attrs = extractAIAttributes(element);
          return {
            id: attrs["data-ai-id"] ?? "(missing)",
            role: attrs["data-ai-role"] ?? "(no role)",
            attrs: Object.fromEntries(
              Object.entries(attrs).filter(([, value]) => value !== undefined)
            ) as Record<string, string>
          };
        });

      setSnapshot({
        screenContext: runtime?.getScreenContext() ?? null,
        actions: runtime?.getAvailableActions() ?? [],
        events: runtime?.getRecentEvents() ?? [],
        formSchema: runtime?.getFormSchema("customer-profile-form") ?? null,
        metadataSummary
      });
    };

    updateSnapshot();
    const intervalId = window.setInterval(updateSnapshot, 600);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <aside className="runtime-panel">
      <Stack gap="var(--demo-space-4)">
        <Stack gap="var(--demo-space-2)">
          <Text as="p" className="eyebrow">
            Runtime panel
          </Text>
          <Text as="h2" className="section-title">
            What DOMglyph sees
          </Text>
          <Text as="p" className="section-copy">
            Reads the same browser runtime API that an external agent or developer would inspect.
          </Text>
        </Stack>

        <RuntimeCard
          title="Screen context"
          body="Current screen id, sections, visible actions, and entity types."
          data={snapshot.screenContext}
        />
        <RuntimeCard
          title="Available actions"
          body="Action metadata discovered from rendered buttons and dialog controls."
          data={snapshot.actions}
        />
        <RuntimeCard
          title="Recent events"
          body="Click, form submit, field update, and banner events observed by the runtime."
          data={snapshot.events}
        />
        <RuntimeCard
          title="Form schema"
          body='Extracted from the profile form using getFormSchema("customer-profile-form").'
          data={snapshot.formSchema}
        />
        <RuntimeCard
          title={showAIView ? "AI metadata summary" : "Metadata summary"}
          body="Sample of discovered data-ai-* attributes currently mounted in the DOM."
          data={snapshot.metadataSummary}
        />

        <Box className="console-panel">
          <Text as="h3" className="console-title">
            Console shortcuts
          </Text>
          <pre className="code-block">{`window.__DOMGLYPH__.getScreenContext()
window.__DOMGLYPH__.getAvailableActions()
window.__DOMGLYPH__.getRecentEvents()
window.__DOMGLYPH__.getFormSchema("customer-profile-form")`}</pre>
        </Box>
      </Stack>
    </aside>
  );
}

function RuntimeCard({
  title,
  body,
  data
}: {
  title: string;
  body: string;
  data: unknown;
}) {
  return (
    <Box className="runtime-card">
      <Stack gap="var(--demo-space-2)">
        <Text as="h3" className="runtime-title">
          {title}
        </Text>
        <Text as="p" className="runtime-copy">
          {body}
        </Text>
        <pre className="code-block">{JSON.stringify(data, null, 2)}</pre>
      </Stack>
    </Box>
  );
}
