<script setup>
</script>

<template>
  <div class="bottom-bar">
    <div class="bottom-bar-content">
      <slot name="prepend"></slot>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.bottom-bar{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(#fff0, var(--page-bg) 50%);
  padding: 20px 0 50px 0;
  display: flex;
  justify-content: center;
}
.bottom-bar-content{
  width: 100%;
  max-width: 600px;
  padding: 0 10px;
}
</style>


