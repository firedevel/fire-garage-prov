<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { loadConfig, saveConfig } from '@/utils/config.js'
import Title from '../components/Title.vue'
import Sublist from '../components/Sublist.vue'
import ListObj from '../components/ListObj.vue'
import NextButton from '../components/NextButton.vue'
import BottomBar from '../components/BottomBar.vue'
import IconArrow from '@/components/icons/IconArrow.vue'
import IconLock from '@/components/icons/IconLock.vue'
import IconWireless from '@/components/icons/IconWireless.vue'
import IconGarage from '@/components/icons/IconGarage.vue'
import IconRemove from '@/components/icons/IconRemove.vue'

const router = useRouter()

// 响应式数据
const rfcodes = ref([])
const wifiData = ref(null)

// 检查session storage中的数据
function checkSessionStorage() {
  const config = loadConfig()
  const rfcodesData = config?.config?.rfcodes || []
  const wlanData = config?.config?.wlan
  
  // 检查WLAN配置
  if (wlanData && wlanData.ssid) {
    wifiData.value = wlanData
  }
  
  if (!rfcodesData || rfcodesData.length === 0) {
    // 没有rfcodes数据，跳转到page3
    router.push({ name: 'record' })
    return
  }
  
  // 有数据，渲染到页面
  rfcodes.value = rfcodesData
}

// 移除车库门
function removeGarageDoor(index) {
  if (confirm("将删除 车库门 " + (index+1) )){
    const newRfcodes = rfcodes.value.filter((_, i) => i !== index)
    rfcodes.value = newRfcodes
    
    // 更新session storage
    const config = loadConfig()
    const updatedConfig = {
      ...config,
      config: {
        ...config.config,
        rfcodes: newRfcodes
      }
    }
    saveConfig(updatedConfig)

    // 如果移除后没有任何rfcodes了，跳转到page3
    if (newRfcodes.length === 0) {
      router.push({ name: 'record' })
    }
  }
}

// 跳转到下一页
function goNext() {
  if (!wifiData.value){
    router.push({ name: 'wlan' })
  }else{
    router.push({ name: 'commit' })
  }
}

// 跳转到page3添加新车库门
function goToPage3() {
  router.push({ name: 'record' })
}

// 跳转到WLAN页面
function goToWLAN() {
  router.push({ name: 'wlan' })
}

onBeforeMount(() => {
  checkSessionStorage()
})
</script>

<!--TODO:车库门编号-->
<template>
    <Title>确认配置</Title>
    <Sublist v-if="wifiData">
      <template #title>WLAN</template>
      <ListObj @click="goToWLAN">
          <template #icon><IconWireless /></template>
          <template #title>{{ wifiData.ssid }}</template>
          <template #right ><IconLock v-if="wifiData.passwd != 'none'" /><IconArrow /></template>
      </ListObj>
    </Sublist>

    <Sublist>
      <template #title>车库门</template>
      <ListObj 
        v-for="(rfcode, index) in rfcodes" 
        :key="index"
        cright
      >
          <template #icon><IconGarage /></template>
          <template #title>车库门 {{ index + 1 }}</template>
          <template #right>
            <button class="remove" @click="removeGarageDoor(index)">
              <IconRemove />
            </button>
          </template>
      </ListObj>
      <ListObj @click="goToPage3">
          <template #title>添加新...</template>
      </ListObj>
    </Sublist>

    
    <BottomBar>
      <NextButton @click="goNext" />
    </BottomBar>
</template>

<!--style scope待确认-->
<style scoped>
.remove{
    width: 60px;
    background: #fff0;
    border: none;
    padding: 5px 15px;
}
.remove>svg{
    fill:#ff0000;
}
</style>


