import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import { registerCortexMatchers } from "@cortexui/testing";

registerCortexMatchers(expect);

Object.defineProperty(HTMLElement.prototype, "getClientRects", {
  configurable: true,
  value() {
    return {
      length: 1,
      item: () => null,
      [Symbol.iterator]: function* iterator() {
        yield {
          bottom: 40,
          height: 40,
          left: 0,
          right: 120,
          top: 0,
          width: 120,
          x: 0,
          y: 0,
          toJSON: () => ({})
        };
      }
    };
  }
});
