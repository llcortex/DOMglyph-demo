import "vitest";

declare module "vitest" {
  interface Assertion<T = any> {
    toBeAIContractValid(): T;
    toHaveAIAttributes(expected: Record<string, string>): T;
    toPassAccessibilityChecks(): T;
    toMatchAIMetadataSnapshot(expected: string): T;
  }
}
