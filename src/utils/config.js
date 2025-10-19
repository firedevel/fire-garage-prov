// 简单的会话存储配置工具
const STORAGE_KEY = 'app_config'

export function loadConfig() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const initial = { config: {} }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      return initial
    }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !parsed.config) {
      const initial = { config: {} }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      return initial
    }
    return parsed
  } catch (e) {
    const fallback = { config: {} }
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fallback)) } catch (_) {}
    return fallback
  }
}

export function saveConfig(configObj) {
  const toSave = configObj && configObj.config ? configObj : { config: {} }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  return toSave
}

export function updateConfig(partial) {
  const current = loadConfig()
  const next = { config: { ...current.config, ...partial } }
  saveConfig(next)
  return next
}


