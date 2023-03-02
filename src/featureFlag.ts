import Vue from "vue";
import {
  featureFlagPrefix,
  isFeatureFlag,
  parseFeatureFlag,
  type ConfigurationSetting,
  type FeatureFlagValue,
} from "@azure/app-configuration";

interface MicrosoftTargetingClientFilterAudienceParameter {
  Users: Array<string> | undefined;
  Groups: Array<string> | undefined;
}

function enabledForUser(
  featureFlag: ConfigurationSetting<FeatureFlagValue>,
  user?: string
): boolean {
  if (user == null || user.match(/^\s*$/) !== null) return false;
  const clientFilter = featureFlag.value.conditions.clientFilters.find(
    (cf) => cf.name === "Microsoft.Targeting"
  );
  if (clientFilter && clientFilter.parameters) {
    const audience = clientFilter.parameters
      .Audience as MicrosoftTargetingClientFilterAudienceParameter;
    if (audience && audience.Users) {
      return audience.Users.some(
        (u: string) => u.toLowerCase() === user.toLowerCase()
      );
    }
  }
  return false;
}

export async function getFeatureFlagAsync(
  featureName: string,
  featureLabel?: string
): Promise<ConfigurationSetting<FeatureFlagValue> | null> {
  try {
    const getResponse =
      await Vue.prototype.$azureAppConfig.client.getConfigurationSetting({
        key: `${featureFlagPrefix}${featureName}`,
        label:
          featureLabel ||
          Vue.prototype.$azureAppConfig.options.featureFlagLabel,
      });
    if (isFeatureFlag(getResponse)) return parseFeatureFlag(getResponse);
    return null;
  } catch {
    return null;
  }
}

export async function isFeatureFlagEnabledAsync(
  featureName: string,
  featureLabel?: string
): Promise<boolean> {
  const featureFlag = await getFeatureFlagAsync(featureName, featureLabel);
  if (featureFlag) return featureFlag.value.enabled;
  return false;
}

export async function isFeatureFlagEnabledForUserAsync(
  featureName: string,
  featureLabel?: string,
  user?: string
): Promise<boolean> {
  const featureFlag = await getFeatureFlagAsync(featureName, featureLabel);
  if (featureFlag)
    return featureFlag.value.enabled || enabledForUser(featureFlag, user);
  return false;
}
