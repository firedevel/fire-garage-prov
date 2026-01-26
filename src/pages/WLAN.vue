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

    const response = await fetch('/api/scan')
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
  
  // 设置定时器，每10秒执行一次fetchWifiList
  timer = setInterval(() => {
    fetchWifiList()
  }, 10000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

function goConnect(ssid, auth){
  switch (auth) {
    case 0:
      const ok = confirm("将加入 "+ssid)
      if (!ok) return
      selectedWlan = { auth: false, ssid }
      break
    case 3:
    case 4:
      const pwd = prompt("输入密码以加入 "+ssid)
      if (pwd === null) {
        return
      }
      if (!pwd || pwd.length < 8) {
        alert('密码不正确')
        return
      }
      selectedWlan = { auth: true, ssid, passwd: pwd }
      break
    default:
      alert("此设备无法加入 "+ssid+"，因为加密方式不受支持！")
      return
  }
  configedWLAN.value = true
  updateConfig({ wlan: { ...selectedWlan } })
  router.push({ name: 'confirm' })
}

function goConnectOther(){
  // 第一个prompt要求SSID
  const ssidPrompt = prompt("请输入SSID(名称)")
  if (ssidPrompt === null) {
    // 用户取消了输入
    return
  }
  const ssid = ssidPrompt.trim()
  
  // 检查SSID不能为空
  if (!ssid) {
    alert('SSID不正确')
    return
  }
  
  // 第二个prompt要求密码（可以为空）
  const pwd = prompt("输入密码以加入 "+ssid+" (若无请留空)")
  if (pwd === null) {
    // 用户取消了输入
    return
  }
  
  // 设置选中的WiFi
  if (!pwd || pwd.trim() === '') {
    // 无密码情况
    selectedWlan = { auth: false, ssid: ssid }
  } else {
    // 有密码情况
    if (pwd.length < 8) {
      alert('密码不正确')
      return
    }
    selectedWlan = { auth: true, ssid: ssid, passwd: pwd }
  }
  
  configedWLAN.value = true
  updateConfig({ wlan: { ...selectedWlan } })
  router.push({ name: 'confirm' })
}

function goNext(){
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
        <ListObj noicon @click="goConnectOther()">
          <template #title>其他...</template>
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


