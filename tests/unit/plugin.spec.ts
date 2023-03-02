import { describe, expect, it } from "vitest";
import { createLocalVue } from "@vue/test-utils";
import { VueAzureAppConfigurationPlugin } from "@/plugin";

const localVue = createLocalVue();
localVue.use(VueAzureAppConfigurationPlugin, {
  connectionString:
    "Endpoint=https://example.azconfig.io;Id=ABC123;Secret=ABC123",
  featureFlagLabel: "testFeatureFlagLabel",
});

describe("plugin.js", () => {
  it("Plugin registers client object", () => {
    expect(localVue.prototype.$azureAppConfig.client).toBeDefined();
  });

  it("Plugin registers options object without connection string", () => {
    expect(localVue.prototype.$azureAppConfig.options).toStrictEqual({
      featureFlagLabel: "testFeatureFlagLabel",
    });
  });

  it("Plugin registers getFeatureFlagAsync() method", () => {
    expect(
      localVue.prototype.$azureAppConfig.getFeatureFlagAsync
    ).toBeDefined();
  });

  it("Plugin registers isFeatureFlagEnabledAsync() method", () => {
    expect(
      localVue.prototype.$azureAppConfig.isFeatureFlagEnabledAsync
    ).toBeDefined();
  });

  it("Plugin registers isFeatureFlagEnabledForUserAsync() method", () => {
    expect(
      localVue.prototype.$azureAppConfig.isFeatureFlagEnabledForUserAsync
    ).toBeDefined();
  });

  it("Plugin registers feature-flag component", () => {
    expect(localVue.options.components["feature-flag"]).toBeDefined();
  });
});
