<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Button from 'primevue/button'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about"><Button label="Submit" /> </RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
