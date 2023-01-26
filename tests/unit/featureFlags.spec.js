import '@testing-library/jest-dom'
import Vue from 'vue'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
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

const setupAzureAppConfigClient = function (returnEnabledFeatureFlag = true) {
  Vue.prototype.$azureAppConfig.client = {
    getConfigurationSetting: async function ({ key, label }) {
      if (key.includes(notFoundFeatureFlagName)) {
        return
      }
      return {
        contentType: featureFlagContentType,
        key,
        label,
        value: `{"id":"${key.replace(featureFlagPrefix, '')}","enabled":${returnEnabledFeatureFlag},"conditions":{"client_filters":[]}}`
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

describe('featureFlags.js', () => {
  it('getFeatureFlagAsync() returns feature flag with default label', async () => {
    expect(await wrapper.vm.$azureAppConfig.getFeatureFlagAsync(testFeatureFlagName)).toStrictEqual({
      contentType: featureFlagContentType,
      key: `${featureFlagPrefix}${testFeatureFlagName}`,
      label: defaultFeatureFlagLabel,
      value: {
        conditions: {
          clientFilters: []
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
          clientFilters: []
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

  it('featureFlagDirective shows element when feature flag enabled', async () => {
    wrapper.destroy()
    wrapper = mount({
      template: `<div id="thing" v-feature-flag="'${testFeatureFlagName}'"></div>`
    })
    await flushPromises()
    expect(wrapper.element.style.display).toBe('')
  })

  it('featureFlagDirective hides element when feature flag disabled', async () => {
    setupAzureAppConfigClient(false)
    wrapper.destroy()
    wrapper = mount({
      template: `<div id="thing" v-feature-flag="'${testFeatureFlagName}'"></div>`
    })
    await flushPromises()
    expect(wrapper.element.style.display).toBe('none')
  })
})
