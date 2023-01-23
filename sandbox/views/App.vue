<template>
  <div id="app">
    <b-navbar type="dark" variant="info">
      <b-navbar-brand>Vue.js Sandbox</b-navbar-brand>
    </b-navbar>
    <div class="container mt-3">
      <b-alert show variant="success">
        <b-icon-bucket />
        Please leave the sandbox tidy and don't commit changes
      </b-alert>
      <sandbox />
    </div>
  </div>
</template>

<script>
import Sandbox from './Sandbox'

export default {
  name: 'App',
  components: {
    Sandbox
  }
}
</script>
