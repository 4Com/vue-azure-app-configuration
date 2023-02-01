import { AppConfigurationClient } from '@azure/app-configuration'
import { getFeatureFlagAsync, isFeatureFlagEnabledAsync, isFeatureFlagEnabledForUserAsync } from './featureFlag'
import FeatureFlag from './FeatureFlag.vue'

export const VueAzureAppConfiguration = function (Vue, options) {
  const client = new AppConfigurationClient(options.connectionString)
  delete options.connectionString

  Vue.prototype.$azureAppConfig = {
    client,
    options,
    getFeatureFlagAsync,
    isFeatureFlagEnabledAsync,
    isFeatureFlagEnabledForUserAsync
  }

  Vue.component('feature-flag', FeatureFlag)
}
