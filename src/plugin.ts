import type { VueConstructor } from "vue";
import type { VueAzureAppConfigurationOptions } from "./vueAzureAppConfigurationOptions";

import FeatureFlag from "./FeatureFlag.vue";
import { VueAzureAppConfiguration } from "./vueAzureAppConfiguration";

export function VueAzureAppConfigurationPlugin(
  Vue: VueConstructor,
  options: VueAzureAppConfigurationOptions
): void {
  Vue.prototype.$azureAppConfig = new VueAzureAppConfiguration(options);
  Vue.component("FeatureFlag", FeatureFlag);
}
