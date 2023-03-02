import type { VueAzureAppConfiguration } from "./vueAzureAppConfiguration";

declare module "vue" {
  interface ComponentCustomProperties {
    $azureAppConfig: VueAzureAppConfiguration;
  }
}
