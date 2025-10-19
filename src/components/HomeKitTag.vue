<template>
  <div>
    <a><slot></slot></a>
  </div>
</template>

<style scoped>
div{
  background: var(--page-bg);
  color: var(--text-1);
  border: 3px solid var(--text-1);
  border-radius: 10px;
  font-family: Menlo,monospace;
  font-size: 25px;
  font-weight: bold;
  text-align: right;
  padding: 5px;
  letter-spacing: 5px;
  margin: 0 calc(50% - 80px);
}
</style>


