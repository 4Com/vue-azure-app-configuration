import {
  AppConfigurationClient,
  type ConfigurationSetting,
  type FeatureFlagValue,
} from "@azure/app-configuration";
import type { VueAzureAppConfigurationOptions } from "./vueAzureAppConfigurationOptions";

import * as featureFlag from "./featureFlag";

export class VueAzureAppConfiguration {
  public readonly client: AppConfigurationClient;

  constructor(public options: VueAzureAppConfigurationOptions) {
    this.client = new AppConfigurationClient(options.connectionString);
  }

  async getFeatureFlagAsync(
    featureName: string,
    featureLabel?: string
  ): Promise<ConfigurationSetting<FeatureFlagValue> | null> {
    return featureFlag.getFeatureFlagAsync(featureName, featureLabel);
  }

  async isFeatureFlagEnabledAsync(
    featureName: string,
    featureLabel?: string
  ): Promise<boolean> {
    return featureFlag.isFeatureFlagEnabledAsync(featureName, featureLabel);
  }

  async isFeatureFlagEnabledForUserAsync(
    featureName: string,
    featureLabel?: string,
    user?: string
  ): Promise<boolean> {
    return featureFlag.isFeatureFlagEnabledForUserAsync(
      featureName,
      featureLabel,
      user
    );
  }
}
