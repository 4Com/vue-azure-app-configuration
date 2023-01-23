import Vue from 'vue'
import { featureFlagPrefix, isFeatureFlag, parseFeatureFlag } from '@azure/app-configuration'

export const getFeatureFlagAsync = async function (featureName, featureLabel) {
  const getResponse = await Vue.prototype.$azureAppConfig.client.getConfigurationSetting({
    key: `${featureFlagPrefix}${featureName}`,
    label: featureLabel || Vue.prototype.$azureAppConfig.options.featureFlagLabel
  })

  if (isFeatureFlag(getResponse)) return parseFeatureFlag(getResponse)
  return null
}

export const isFeatureFlagEnabledAsync = async function (featureName, featureLabel) {
  const featureFlag = await getFeatureFlagAsync(featureName, featureLabel)
  if (featureFlag) return featureFlag.value.enabled
  return false
}

export const featureFlagDirective = {
  bind: async function (el, binding) {
    el.style.display = 'none'

    const featureName = binding.value
    const featureLabel = binding.arg

    if (await isFeatureFlagEnabledAsync(featureName, featureLabel)) el.style.display = ''
  }
}
