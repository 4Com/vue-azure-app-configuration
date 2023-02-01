import Vue from 'vue'
import { featureFlagPrefix, isFeatureFlag, parseFeatureFlag } from '@azure/app-configuration'

const enabledForUser = function (featureFlag, user) {
  if (user == null || user.match(/^\s*$/) !== null) return false
  const clientFilter = featureFlag.value.conditions.clientFilters.find(cf => cf.name === 'Microsoft.Targeting')
  if (clientFilter) {
    return clientFilter.parameters.Audience.Users.some(u => u.toLowerCase() === user.toLowerCase())
  }
  return false
}

export const getFeatureFlagAsync = async function (featureName, featureLabel) {
  try {
    const getResponse = await Vue.prototype.$azureAppConfig.client.getConfigurationSetting({
      key: `${featureFlagPrefix}${featureName}`,
      label: featureLabel || Vue.prototype.$azureAppConfig.options.featureFlagLabel
    })
    if (isFeatureFlag(getResponse)) return parseFeatureFlag(getResponse)
    return null
  } catch {
    return null
  }
}

export const isFeatureFlagEnabledAsync = async function (featureName, featureLabel) {
  const featureFlag = await getFeatureFlagAsync(featureName, featureLabel)
  if (featureFlag) return featureFlag.value.enabled
  return false
}

export const isFeatureFlagEnabledForUserAsync = async function (featureName, featureLabel, user) {
  const featureFlag = await getFeatureFlagAsync(featureName, featureLabel)
  if (featureFlag) return featureFlag.value.enabled || enabledForUser(featureFlag, user)
  return false
}
