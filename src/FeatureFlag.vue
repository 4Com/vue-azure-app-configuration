<template>
  <div v-if="enabled">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FeatureFlag',
  props: {
    name: {
      type: String,
      required: true
    },
    label: String,
    user: String
  },
  data () {
    return {
      enabled: false
    }
  },
  async created () {
    this.$watch(vm => [vm.name, vm.label, vm.user], async () => {
      if (this.user == null || this.user.match(/^\s*$/) !== null) {
        this.enabled = await this.$azureAppConfig.isFeatureFlagEnabledAsync(this.name, this.label)
      } else {
        this.enabled = await this.$azureAppConfig.isFeatureFlagEnabledForUserAsync(this.name, this.label, this.user)
      }
    }, { immediate: true })
  }
}
</script>
