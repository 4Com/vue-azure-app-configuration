<template>
  <div id="sandbox">
    <!-- Add whatever you're working on here and play! -->
    <feature-flag name="MyFeatureFlag">
      <b-button>Hello World!</b-button>
    </feature-flag>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Sandbox",
  async created() {
    console.log(
      await this.$azureAppConfig.getFeatureFlagAsync("MyFeatureFlag")
    );
  },
});
</script>
