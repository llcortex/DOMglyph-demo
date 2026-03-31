import type { CortexUIGlobalAPI } from "@cortexui/runtime";

declare global {
  interface Window {
    __CORTEX_UI__: CortexUIGlobalAPI | null;
  }
}

export {};
