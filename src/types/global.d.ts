import type { DOMglyphGlobalAPI } from "@domglyph/runtime";

declare global {
  interface Window {
    __DOMGLYPH__: DOMglyphGlobalAPI | null;
  }
}

export {};
