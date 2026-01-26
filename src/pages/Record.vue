<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { loadConfig, saveConfig } from '@/utils/config.js'
import Title from '../components/Title.vue'
const router = useRouter()
function goNext(){
  router.push({ name: 'confirm' })
}

// 标题文案
const titleText = ref('')

// 采集阶段：'idle' | 'waitingUp' | 'waitingDown' | 'done'
const phase = ref('idle')

// 暂存第一次成功返回的数据
const firstCapture = ref({ upcode: null, bit: null, protocol: null })

let pollTimer = null
let initialTimeoutTimer = null

async function initialRequestWithTimeout() {
  const controller = new AbortController()
  const timeoutMs = 10000
  initialTimeoutTimer = setTimeout(() => {
    try { controller.abort() } catch (_) {}
    alert('请求超时，请重试或靠近设备再试')
    if (initialTimeoutTimer) { clearTimeout(initialTimeoutTimer); initialTimeoutTimer = null }
  }, timeoutMs)

  try {
    const res = await fetch('/api/getcode', { signal: controller.signal })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    // 忽略结果，开始后续流程（仅成功时继续）
    if (initialTimeoutTimer) { clearTimeout(initialTimeoutTimer); initialTimeoutTimer = null }
    startPhaseOne()
  } catch (e) {
    // 如果是主动中止则已在超时分支处理；其他错误仅提示，不继续
    if (e && e.name !== 'AbortError') {
      alert('请求失败：' + (e?.message || '未知错误'))
    }
    if (initialTimeoutTimer) { clearTimeout(initialTimeoutTimer); initialTimeoutTimer = null }
  }
}

function startPhaseOne() {
  titleText.value = '按住上升按钮'
  phase.value = 'waitingUp'
  //handlePoll()
  pollTimer = setInterval(handlePoll, 3000)
}

async function handlePoll() {
  if (phase.value === 'done' || phase.value === 'idle') return
  try {
    const res = await fetch('/api/getcode')
    const data = await res.json().catch(() => null)
    if (!data || typeof data !== 'object') return
    if (data.status !== 'success') return

    // 有效数据
    const code = data.code
    const bit = data.bit
    const protocol = data.protocol

    if (phase.value === 'waitingUp') {
      firstCapture.value = { upcode: code, bit, protocol }
      titleText.value = '按住下降按钮'
      phase.value = 'waitingDown'
      return
    }

    if (phase.value === 'waitingDown') {
      // 若下降阶段收到与上升相同的 code，则忽略等待下一次
      if (code === firstCapture.value.upcode) {
        return
      }
      // 需与上一次的 bit/protocol 一致
      if (bit === firstCapture.value.bit && protocol === firstCapture.value.protocol) {
        const payload = {
          upcode: firstCapture.value.upcode,
          downcode: code,
          bit,
          protocol
        }
        await persistAndNavigate(payload)
        phase.value = 'done'
        clearTimers()
      }
    }
  } catch (_) {
    // 静默失败，等待下一次轮询
  }
}

async function persistAndNavigate(record) {
  const current = loadConfig()
  const existing = (current?.config?.rfcodes && Array.isArray(current.config.rfcodes)) ? current.config.rfcodes : []
  // 如果已存在相同的 upcode 或 downcode，则不保存，直接跳转
  const isDuplicate = existing.some((item) => {
    try {
      return item && (item.upcode === record.upcode || item.downcode === record.downcode)
    } catch (_) {
      return false
    }
  })
  if (!isDuplicate) {
    const next = {
      config: {
        ...current.config,
        rfcodes: [...existing, record]
      }
    }
    saveConfig(next)
  }
  goNext()
}

function clearTimers() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
  if (initialTimeoutTimer) { clearTimeout(initialTimeoutTimer); initialTimeoutTimer = null }
}

onMounted(() => {
  // 进入页面即隐藏标题并发起首次请求
  titleText.value = ''
  phase.value = 'idle'
  initialRequestWithTimeout()
})

onBeforeUnmount(() => {
  clearTimers()
})
</script>

<template>
    <img src="@/assets/remote.svg" alt="按下遥控器">
    <Transition name="slide" mode="out-in">
        <Title :key="titleText">{{ titleText }}</Title>
    </Transition>
</template>

<style scoped>
img{
    width: 100%;
    max-height: 300px;
    border-radius: 10px;
    background: #F3F3F3;
}
@media (prefers-color-scheme: dark) {
  img{
    filter: brightness(75%);
  }
}

/* 动画样式 */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s var(--bez);
}

.slide-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.slide-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
    transform: translateX(0);
    opacity: 1;
}
</style>

