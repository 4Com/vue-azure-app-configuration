<template>
  <div id="sandbox">
    <!-- Add whatever you're working on here and play! -->
    <feature-flag name="MyFeatureFlag">
      <b-button>Hello World!</b-button>
    </feature-flag>
  </div>
</template>

<script>
export default {
  name: 'Sandbox',
  async created () {
    console.log(await this.$azureAppConfig.getFeatureFlagAsync('MyFeatureFlag'))
  }
}
</script>
