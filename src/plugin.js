import { AppConfigurationClient } from '@azure/app-configuration'
import { getFeatureFlagAsync, isFeatureFlagEnabledAsync, featureFlagDirective } from '@/featureFlags'

export const VueAzureAppConfiguration = function (Vue, options) {
  const client = new AppConfigurationClient(options.connectionString)
  delete options.connectionString

  Vue.prototype.$azureAppConfig = {
    client,
    options,
    getFeatureFlagAsync,
    isFeatureFlagEnabledAsync
  }

  Vue.directive('feature-flag', featureFlagDirective)
}
