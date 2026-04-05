import { Box, Stack, Text } from "@domglyph/primitives";

type MetadataPillProps = {
  show: boolean;
  title: string;
  attributes: Record<string, string>;
};

export function MetadataPill({ show, title, attributes }: MetadataPillProps) {
  if (!show) {
    return null;
  }

  return (
    <Box className="metadata-pill">
      <Stack gap="var(--demo-space-1)">
        <Text as="strong" className="metadata-title">
          {title}
        </Text>
        <div className="metadata-lines">
          {Object.entries(attributes).map(([key, value]) => (
            <code key={key} className="metadata-line">
              {key}="{value}"
            </code>
          ))}
        </div>
      </Stack>
    </Box>
  );
}
