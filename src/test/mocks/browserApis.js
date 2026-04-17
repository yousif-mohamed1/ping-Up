import { vi } from 'vitest'

const storageState = {
  local: new Map(),
  session: new Map(),
}

const trackedMocks = []

const track = (fn) => {
  trackedMocks.push(fn)
  return fn
}

const createStorage = (type) => {
  const state = storageState[type]

  return {
    getItem: track(vi.fn((key) => (state.has(key) ? state.get(key) : null))),
    setItem: track(vi.fn((key, value) => {
      state.set(String(key), String(value))
    })),
    removeItem: track(vi.fn((key) => {
      state.delete(String(key))
    })),
    clear: track(vi.fn(() => {
      state.clear()
    })),
    key: track(vi.fn((index) => Array.from(state.keys())[index] ?? null)),
    get length() {
      return state.size
    },
  }
}

const defineGlobal = (target, key, value) => {
  Object.defineProperty(target, key, {
    configurable: true,
    writable: true,
    value,
  })
}

const createMatchMedia = () => {
  return track(
    vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  )
}

class MockIntersectionObserver {
  constructor(callback = () => {}, options = {}) {
    this.root = options.root ?? null
    this.rootMargin = options.rootMargin ?? '0px'
    this.thresholds = Array.isArray(options.threshold)
      ? options.threshold
      : [options.threshold ?? 0]
    this.observe = vi.fn()
    this.unobserve = vi.fn()
    this.disconnect = vi.fn()
    this.takeRecords = vi.fn(() => [])
    this._callback = callback
  }
}

class MockResizeObserver {
  constructor(callback = () => {}) {
    this.observe = vi.fn()
    this.unobserve = vi.fn()
    this.disconnect = vi.fn()
    this._callback = callback
  }
}

let installed = false

export const installBrowserApiMocks = () => {
  if (installed) {
    return
  }

  defineGlobal(window, 'open', track(vi.fn(() => null)))
  defineGlobal(window, 'scrollTo', track(vi.fn()))
  defineGlobal(window, 'matchMedia', createMatchMedia())

  if (typeof Element !== 'undefined') {
    defineGlobal(Element.prototype, 'scrollIntoView', track(vi.fn()))
  }

  defineGlobal(window, 'IntersectionObserver', MockIntersectionObserver)
  defineGlobal(window, 'ResizeObserver', MockResizeObserver)

  if (window.URL) {
    defineGlobal(window.URL, 'createObjectURL', track(vi.fn(() => 'blob:mock-url')))
    defineGlobal(window.URL, 'revokeObjectURL', track(vi.fn()))
  }

  defineGlobal(window, 'localStorage', createStorage('local'))
  defineGlobal(window, 'sessionStorage', createStorage('session'))

  const clipboard = {
    writeText: track(vi.fn(async () => undefined)),
    readText: track(vi.fn(async () => '')),
  }

  defineGlobal(navigator, 'clipboard', clipboard)
  installed = true
}

export const resetBrowserApiMocks = () => {
  storageState.local.clear()
  storageState.session.clear()

  for (const mockFn of trackedMocks) {
    if (typeof mockFn.mockClear === 'function') {
      mockFn.mockClear()
    }
  }
}
