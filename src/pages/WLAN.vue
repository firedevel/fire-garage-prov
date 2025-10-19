<script setup>
import Title from '../components/Title.vue'
import Sublist from '../components/Sublist.vue'
import ListObj from '../components/ListObj.vue'
import IconWireless from '../components/icons/IconWireless.vue'
import IconLock from '../components/icons/IconLock.vue'
import { ref,onMounted,onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import NextButton from '../components/NextButton.vue'
import BottomBar from '../components/BottomBar.vue'
import { loadConfig, updateConfig, saveConfig } from '../utils/config.js'

const router = useRouter()
const result = ref([])
const status = ref("")
const configedWLAN = ref(false)
let selectedWlan = null // { ssid, passwd }
let timer = null

const mergeSameSSID = (wifiList) => {
  const merged = {}
  wifiList.forEach(item => {
    if (merged[item.ssid]) {
      if (item.rssi > merged[item.ssid].rssi) {
        merged[item.ssid] = { ...item }
      }
    } else {
      merged[item.ssid] = { ...item }
    }
  })
  return Object.values(merged)
}

const fetchWifiList = async () => {
  try {
    status.value = "加载中..."

    const response = await fetch('http://localhost:8000/api/scan')
    const data = await response.json()
    // 按照rssi值从高到低排序（信号强度从强到弱）
    result.value = mergeSameSSID(data.result).sort((a, b) => b.rssi - a.rssi)
    status.value = ""
  } catch (error) {
    status.value = "无法加载"
  }
}

onMounted(() => {
  const current = loadConfig()
  if (current && current.config && current.config.wlan && current.config.wlan.ssid) {
    configedWLAN.value = true
    selectedWlan = { ...current.config.wlan }
  }
  
  // 页面加载时立即获取一次WiFi列表
  fetchWifiList()
  
  // 设置定时器，每5秒执行一次fetchWifiList
  timer = setInterval(() => {
    fetchWifiList()
  }, 5000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

function goConnect(ssid, auth){
  if (auth != 0) {
    const pwd = prompt("输入密码以加入 "+ssid)
    if (pwd === null) {
      return
    }
    if (!pwd || pwd.length < 8) {
      alert('密码不正确')
      return
    }
    selectedWlan = { ssid, passwd: pwd }
  } else {
    const ok = confirm("将加入 "+ssid)
    if (!ok) return
    selectedWlan = { ssid, passwd: 'none' }
  }
  configedWLAN.value = true
  updateConfig({ wlan: { ...selectedWlan } })
}

function goNext(){
  if (configedWLAN.value && selectedWlan) {
    saveConfig({ config: { ...loadConfig().config, wlan: { ...selectedWlan } } })
  }
  router.push({ name: 'confirm' })
}
</script>

<template>
    <Title>设置无线局域网</Title>
    <Sublist>
      <template #title>WLAN <a>{{ status }}</a></template>
      <TransitionGroup name="list" tag="div">
        <ListObj noicon v-for="v in result" :key="v.ssid" @click="goConnect(v.ssid, v.auth)">
          <template #title>{{ v.ssid }}</template>
          <template #right>
            <IconLock v-if="v.auth != 0" />
            <IconWireless :level="v.rssi >= -55 ? 3 : (v.rssi >= -70 ? 2 : 1)" />
          </template>
        </ListObj>
      </TransitionGroup>
    </Sublist>
    <BottomBar>
      <NextButton :disabled="!configedWLAN" @click="goNext" />
    </BottomBar>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s var(--bez) !important;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
.list-leave-active {
  position: absolute;
  max-width: 580px;
  width: calc(100% - 46px);
}
</style>


