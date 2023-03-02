import matchers from "@testing-library/jest-dom/matchers";
import { expect, vi } from "vitest";

expect.extend(matchers);

vi.mock("vue", async () => {
  const Vue = await vi.importActual<typeof import("vue")>("vue");

  Vue.default.config.productionTip = false;
  Vue.default.config.devtools = false;

  return Vue;
});
