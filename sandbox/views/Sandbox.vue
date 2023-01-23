<template>
  <div id="sandbox">
    <!-- Add whatever you're working on here and play! -->
    <b-button v-feature-flag="'MyFeatureFlag'">Hello World!</b-button>
  </div>
</template>

<script>
export default {
  name: 'Sandbox'
}
</script>
