<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SubTitle from '@/components/SubTitle.vue'
import Title from '../components/Title.vue'
import { loadConfig } from '@/utils/config.js'
import HomeKitTag from '@/components/HomeKitTag.vue'

// 页面状态：'loading' | 'success' | 'error'
const pageState = ref('loading')
const hkcode = ref('')
let timeoutTimer = null


// 清除超时定时器
const clearTimeoutTimer = () => {
  if (timeoutTimer) {
    clearTimeout(timeoutTimer)
    timeoutTimer = null
  }
}

// 发送API请求
const sendCommitRequest = async () => {
  try {
    // 设置3分钟超时
    timeoutTimer = setTimeout(() => {
      console.log('请求超时，切换到失败状态')
      pageState.value = 'error'
      clearTimeoutTimer()
    }, 3 * 60 * 1000) // 3分钟 = 3 * 60 * 1000毫秒
    
    // 获取session storage中的数据
    const config = loadConfig()
    
    // 准备发送的数据
    const requestData = {
      wlan: config.config?.wlan || {},
      rfcodes: config.config?.rfcodes || []
    }
    
    console.log('发送数据:', requestData)
    
    // 发送POST请求
    const response = await fetch('/api/commit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const result = await response.json()
    console.log('API响应:', result)
    
    // 清除超时定时器
    clearTimeoutTimer()
    
    // 根据status处理结果
    if (result.status === 0) {
      pageState.value = 'success'
      hkcode.value = result.hkcode || ''
    } else {
      pageState.value = 'error'
    }
    
  } catch (error) {
    console.error('请求失败:', error)
    clearTimeoutTimer()
    pageState.value = 'error'
  }
}

onMounted(() => {
  // 页面加载时立即发送请求
  sendCommitRequest()
})

onBeforeUnmount(() => {
  // 组件卸载时清除定时器
  clearTimeoutTimer()
})
</script>

<template>
  <!-- 第一组：加载中 -->
  <div v-if="pageState === 'loading'">
    <SubTitle style="padding-top: 150px;">请稍侯...</SubTitle>
  </div>
  
  <!-- 第二组：成功 -->
  <div v-if="pageState === 'success'">
    <Title style="padding-top: 150px;">设置已完成</Title>
    <SubTitle>稍后请在 Home App 中添加设备</SubTitle>
    <br style="padding: 100px;" />
    <HomeKitTag>{{ hkcode.replace('-','').substring(0,4) }}<br />{{ hkcode.replace('-','').substring(4) }}</HomeKitTag>
  </div>
  
  <!-- 第三组：失败 -->
  <div v-if="pageState === 'error'">
    <Title style="padding-top: 150px;">设置失败</Title>
    <SubTitle>请重启模块后再试</SubTitle>
  </div>
</template>
