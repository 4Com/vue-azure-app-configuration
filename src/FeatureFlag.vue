<template>
  <div v-if="enabled">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FeatureFlag",
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: null,
    },
    user: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      enabled: false,
    };
  },
  async created(): Promise<void> {
    this.$watch(
      function () {
        return [this.name, this.label, this.user];
      },
      async () => {
        if (this.user == null || this.user.match(/^\s*$/) !== null) {
          this.enabled = await this.$azureAppConfig.isFeatureFlagEnabledAsync(
            this.name,
            this.label
          );
        } else {
          this.enabled =
            await this.$azureAppConfig.isFeatureFlagEnabledForUserAsync(
              this.name,
              this.label,
              this.user
            );
        }
      },
      { immediate: true }
    );
  },
});
</script>
