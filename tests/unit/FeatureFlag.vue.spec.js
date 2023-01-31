import '@testing-library/jest-dom'
import Vue from 'vue'
import { mount } from '@vue/test-utils'
import { featureFlagPrefix, featureFlagContentType } from '@azure/app-configuration'
import { VueAzureAppConfiguration } from '@/plugin'
import FeatureFlag from '@/FeatureFlag.vue'

const defaultFeatureFlagLabel = 'defaultFeatureFlagLabel'
const testFeatureFlagName = 'testFeatureFlagName'

Vue.use(VueAzureAppConfiguration, {
  connectionString: 'Endpoint=https://test.azconfig.io;Id=ABC123;Secret=ABC123',
  featureFlagLabel: defaultFeatureFlagLabel
})

const setupAzureAppConfigClient = function (returnEnabledFeatureFlag = true) {
  Vue.prototype.$azureAppConfig.client = {
    getConfigurationSetting: async function ({ key, label }) {
      const value = `{"id":"${key.replace(featureFlagPrefix, '')}","enabled":${returnEnabledFeatureFlag},"conditions":{"client_filters":[]}}`
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

const setupWrapper = function () {
  wrapper = mount(FeatureFlag, {
    propsData: {
      name: testFeatureFlagName
    },
    slots: {
      default: 'Hello'
    }
  })
}

beforeEach(() => {
  setupAzureAppConfigClient()
  setupWrapper()
})

afterEach(() => {
  if (wrapper) {
    wrapper.destroy()
  }
})

describe('featureFlag.js', () => {
  it('Shows slot content when feature flag enabled', async () => {
    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.text()).toBe('Hello')
  })

  it('Doesn\'t show slot content when feature flag disabled', async () => {
    setupAzureAppConfigClient(false)
    wrapper.destroy()
    setupWrapper()
    expect(wrapper.find('div').exists()).toBe(false)
  })
})
