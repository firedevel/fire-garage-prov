<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  label: { type: String, default: '下一步' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])

function handleClick(){
  if (props.disabled) return
  emit('click')
}
</script>

<template>
  <button :disabled="disabled" @click="handleClick">{{ label }}</button>
  
</template>

<style scoped>
button{
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  background: var(--high);
  color: #FFF;
  border: none;
  border-radius: 15px;
  font-size: 17px;
  font-weight: bold;
  padding: 20px;
  transition: background-color var(--bez) 0.2s;
}
button:disabled,button:disabled:active{
  background: var(--disabled);
}
button:active{
  background: var(--high-action);
}

</style>


