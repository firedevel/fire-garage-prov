<script setup>
import { useRouter } from 'vue-router'
import NextButton from '../components/NextButton.vue'
import BottomBar from '../components/BottomBar.vue'
import Title from '@/components/Title.vue'
const router = useRouter()
function goNext(){
  router.push({ name: 'wlan' })
}
</script>

<template>
  <div class="container">
    <Title>欢迎使用<br />Fire GarageOpener</Title>
    <BottomBar>
      <NextButton @click="goNext" />
    </BottomBar>
  </div>
  
</template>



