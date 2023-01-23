# Vue.js Azure App Configuration

Wrapper library of Microsofts [Azure App Configuration SDK for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/appconfiguration/app-configuration) for Vue.js applications.

## Setup

### Install the Package

#### npm

`npm install @4com/vue-azure-app-configuration`

#### yarn

`yarn add @4com/vue-azure-app-configuration`

### Use the Plugin

Install the plugin by adding it to your `main.js`.

```
import { VueAzureAppConfiguration } from '@4com/vue-azure-app-configuration'

Vue.use(VueAzureAppConfiguration, { see configuration options })
```

### Configuration

The following options can be passed within the second object parameter when installing the plugin.

| Option | Description |
| :-- | :-- |
| `connectionString` | For authenticating the client using a connection string. |
| `featureFlagLabel` | The default feature flag label used as a fallback if no label argument is passed to any of the `getFeatureFlagAsync()` or `isFeatureFlagEnabledAsync()` methods, or the `v-feature-flag` directive. |

Access the options passed when installing the plugin in components at `this.$azureAppConfig.options`.

## Directives

| Example | Description |
| :-- | :-- |
| `v-feature-flag="'name'"` <br> or <br> `v-feature-flag:label="'name'"` | Conditionally displays the element based on whether the feature flag with the provided name and (optional) label is enabled using `Element.style.display`. The `label` argument overrides the `featureFlagLabel` if provided in the plugin options. |

## Global Methods

Call the following global methods from components at `this.$azureAppConfig`.

| Signature | Description |
| :-- | :-- |
| `getFeatureFlagAsync(name, label)` | Gets the feature flag with the passed name and (optional) label. Returns the [`ConfigurationSetting`](https://learn.microsoft.com/en-gb/javascript/api/@azure/app-configuration/configurationsetting)[`<FeatureFlagValue>`](https://learn.microsoft.com/en-gb/javascript/api/@azure/app-configuration/featureflagvalue). Returns `null` if the feature flag was not found. |
| `isFeatureFlagEnabledAsync(name, label)` | Returns `true` when the feature flag with the passed name and (optional) label is enabled. Returns `false` when the feature flag was not found. |

## Limitations

### Features

This library currently only provides instance methods and a directive for ease with using feature flags.

However, the [`AppConfigurationClient`](https://learn.microsoft.com/en-gb/javascript/api/@azure/app-configuration/appconfigurationclient) is exposed at `this.$azureAppConfig.client`.

### Authentication

This library currently only supports authentication using a connection string.

## Development

### Sandbox

The sandbox can be used while developing and testing out features of the library. It uses [BootstrapVue](https://bootstrap-vue.org/) components.

Use `yarn serve` to start the sandbox live reload server.
