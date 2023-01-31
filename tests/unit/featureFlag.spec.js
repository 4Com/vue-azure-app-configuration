import '@testing-library/jest-dom'
import Vue from 'vue'
import { mount } from '@vue/test-utils'
import { featureFlagPrefix, featureFlagContentType } from '@azure/app-configuration'
import { VueAzureAppConfiguration } from '@/plugin'

const defaultFeatureFlagLabel = 'defaultFeatureFlagLabel'
const overriddenFeatureFlagLabel = 'overriddenFeatureFlagLabel'
const testFeatureFlagName = 'testFeatureFlagName'
const notFoundFeatureFlagName = 'notFoundFeatureFlagName'

Vue.use(VueAzureAppConfiguration, {
  connectionString: 'Endpoint=https://test.azconfig.io;Id=ABC123;Secret=ABC123',
  featureFlagLabel: defaultFeatureFlagLabel
})

const setupAzureAppConfigClient = function (returnEnabledFeatureFlag = true, includeClientFilters = true, throwError = false) {
  Vue.prototype.$azureAppConfig.client = {
    getConfigurationSetting: async function ({ key, label }) {
      if (throwError) throw Error('Oops')
      if (key.includes(notFoundFeatureFlagName)) return
      let value = `{"id":"${key.replace(featureFlagPrefix, '')}","enabled":${returnEnabledFeatureFlag},"conditions":{"client_filters":[`
      if (includeClientFilters) value += '{"name":"Microsoft.Targeting","parameters":{"Audience":{"Users":["me@example.com"]}}}'
      value += ']}}'
      return {
        contentType: featureFlagContentType,
        key,
        label,
        value
      }
    }
  }
}

let wrapper

beforeEach(() => {
  setupAzureAppConfigClient()
  wrapper = mount({
    template: '<div></div>'
  })
})

afterEach(() => {
  if (wrapper) {
    wrapper.destroy()
  }
})

describe('featureFlag.js', () => {
  it('getFeatureFlagAsync() returns feature flag with default label', async () => {
    expect(await wrapper.vm.$azureAppConfig.getFeatureFlagAsync(testFeatureFlagName)).toStrictEqual({
      contentType: featureFlagContentType,
      key: `${featureFlagPrefix}${testFeatureFlagName}`,
      label: defaultFeatureFlagLabel,
      value: {
        conditions: {
          clientFilters: [
            {
              name: 'Microsoft.Targeting',
              parameters: {
                Audience: {
                  Users: [
                    'me@example.com'
                  ]
                }
              }
            }
          ]
        },
        description: undefined,
        displayName: undefined,
        enabled: true,
        id: testFeatureFlagName
      }
    })
  })

  it('getFeatureFlagAsync() returns feature flag with overridden label', async () => {
    expect(await wrapper.vm.$azureAppConfig.getFeatureFlagAsync(testFeatureFlagName, overriddenFeatureFlagLabel)).toStrictEqual({
      contentType: featureFlagContentType,
      key: `${featureFlagPrefix}${testFeatureFlagName}`,
      label: overriddenFeatureFlagLabel,
      value: {
        conditions: {
          clientFilters: [
            {
              name: 'Microsoft.Targeting',
              parameters: {
                Audience: {
                  Users: [
                    'me@example.com'
                  ]
                }
              }
            }
          ]
        },
        description: undefined,
        displayName: undefined,
        enabled: true,
        id: testFeatureFlagName
      }
    })
  })

  it('getFeatureFlagAsync() returns null when feature flag not found', async () => {
    expect(await wrapper.vm.$azureAppConfig.getFeatureFlagAsync(notFoundFeatureFlagName)).toBeNull()
  })

  it('getFeatureFlagAsync() returns null when client throws an Error', async () => {
    setupAzureAppConfigClient(true, true, true)
    expect(await wrapper.vm.$azureAppConfig.getFeatureFlagAsync(notFoundFeatureFlagName)).toBeNull()
  })

  it('isFeatureFlagEnabledAsync() returns true when feature flag exists and is enabled', async () => {
    expect(await wrapper.vm.$azureAppConfig.isFeatureFlagEnabledAsync(testFeatureFlagName)).toBe(true)
  })

  it('isFeatureFlagEnabledAsync() returns false when feature flag exists and is disabled', async () => {
    setupAzureAppConfigClient(false)
    expect(await wrapper.vm.$azureAppConfig.isFeatureFlagEnabledAsync(testFeatureFlagName)).toBe(false)
  })

  it('isFeatureFlagEnabledAsync() returns false when feature flag not found', async () => {
    expect(await wrapper.vm.$azureAppConfig.isFeatureFlagEnabledAsync(notFoundFeatureFlagName)).toBe(false)
  })

  it('isFeatureFlagEnabledForUserAsync() returns true when feature flag exists and is enabled', async () => {
    expect(await wrapper.vm.$azureAppConfig.isFeatureFlagEnabledForUserAsync(testFeatureFlagName)).toBe(true)
  })

  it('isFeatureFlagEnabledForUserAsync() returns false when feature flag exists, is disabled, and user not passed', async () => {
    setupAzureAppConfigClient(false)
    expect(await wrapper.vm.$azureAppConfig.isFeatureFlagEnabledForUserAsync(testFeatureFlagName)).toBe(false)
  })

  it('isFeatureFlagEnabledForUserAsync() returns false when feature flag exists, is disabled, has no client filter, and user is passed', async () => {
    setupAzureAppConfigClient(false, false)
    expect(await wrapper.vm.$azureAppConfig.isFeatureFlagEnabledForUserAsync(testFeatureFlagName, null, 'me@example.com')).toBe(false)
  })

  it('isFeatureFlagEnabledForUserAsync() returns false when feature flag exists, is disabled, and user not matched', async () => {
    setupAzureAppConfigClient(false)
    expect(await wrapper.vm.$azureAppConfig.isFeatureFlagEnabledForUserAsync(testFeatureFlagName, null, 'someoneElse@example.com')).toBe(false)
  })

  it('isFeatureFlagEnabledForUserAsync() returns true when feature flag exists, is disabled, and user matched', async () => {
    setupAzureAppConfigClient(false)
    expect(await wrapper.vm.$azureAppConfig.isFeatureFlagEnabledForUserAsync(testFeatureFlagName, null, 'me@example.com')).toBe(true)
  })

  it('isFeatureFlagEnabledForUserAsync() returns false when feature flag not found', async () => {
    expect(await wrapper.vm.$azureAppConfig.isFeatureFlagEnabledForUserAsync(notFoundFeatureFlagName)).toBe(false)
  })
})
