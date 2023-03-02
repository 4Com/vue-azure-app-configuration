import { describe, expect, it } from "vitest";

describe("index.js", () => {
  it("Exports VueAzureAppConfigurationPlugin plugin", () => {
    const library = require("@/index");
    expect(library.VueAzureAppConfigurationPlugin).toBeDefined();
  });
});
