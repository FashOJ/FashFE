<template>
  <div class="monaco-editor-container">
    <div ref="editorContainer" class="monaco-editor"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as monaco from 'monaco-editor'

interface Props {
  modelValue: string
  language: string
  theme?: string
  options?: monaco.editor.IStandaloneEditorConstructionOptions
  height?: string
  width?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'vs-dark',
  height: '400px',
  width: '100%',
  options: () => ({})
})

const emit = defineEmits<Emits>()

const editorContainer = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null

// 检测是否为移动设备
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         window.innerWidth <= 768
}

// 检测是否为触摸设备
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// 获取移动端优化的默认选项
const getDefaultOptions = (): monaco.editor.IStandaloneEditorConstructionOptions => {
  const mobile = isMobile()
  const touch = isTouchDevice()

  return {
    automaticLayout: true,
    fontSize: mobile ? 16 : 14, // 移动端使用更大字体
    fontFamily: 'Consolas, "Courier New", monospace',
    lineNumbers: mobile ? 'off' : 'on', // 移动端隐藏行号节省空间
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: false,
    minimap: { enabled: !mobile }, // 移动端禁用小地图
    wordWrap: 'on',
    tabSize: 2,
    insertSpaces: true,
    folding: !mobile, // 移动端禁用代码折叠
    foldingStrategy: 'indentation',
    showFoldingControls: mobile ? 'never' : 'always',
    unfoldOnClickAfterEndOfLine: false,
    contextmenu: !mobile, // 移动端禁用右键菜单
    mouseWheelZoom: !mobile, // 移动端禁用鼠标滚轮缩放
    cursorSmoothCaretAnimation: 'on',
    cursorBlinking: 'blink',
    renderLineHighlight: mobile ? 'none' : 'line',
    selectOnLineNumbers: !mobile,
    lineDecorationsWidth: mobile ? 5 : 10,
    lineNumbersMinChars: mobile ? 0 : 3,
    glyphMargin: false,
    // 智能提示配置
    quickSuggestions: mobile ? false : {
      other: true,
      comments: true,
      strings: true
    },
    parameterHints: {
      enabled: !mobile
    },
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    autoSurround: 'languageDefined',
    bracketPairColorization: {
      enabled: !mobile // 移动端禁用以提高性能
    },
    guides: {
      bracketPairs: !mobile,
      indentation: true
    },
    // 移动端特定配置
    ...(mobile && {
      scrollbar: {
        vertical: 'auto',
        horizontal: 'auto',
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8
      },
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      overviewRulerBorder: false,
      renderValidationDecorations: 'off'
    }),
    // 触摸设备特定配置
    ...(touch && {
      fastScrollSensitivity: 5,
      scrollPredominantAxis: true
    })
  }
}

// 语言映射
const languageMap: Record<string, string> = {
  cpp: 'cpp',
  c: 'c',
  java: 'java',
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  go: 'go',
  rust: 'rust',
  php: 'php',
  ruby: 'ruby',
  swift: 'swift',
  kotlin: 'kotlin',
  scala: 'scala',
  csharp: 'csharp',
  sql: 'sql',
  html: 'html',
  css: 'css',
  json: 'json',
  xml: 'xml',
  yaml: 'yaml',
  markdown: 'markdown'
}

// 获取 Monaco 语言标识符
const getMonacoLanguage = (lang: string): string => {
  return languageMap[lang] || 'plaintext'
}

// 移动端虚拟键盘处理
const setupMobileKeyboardHandling = () => {
  if (!editor) return

  const initialViewportHeight = window.visualViewport?.height || window.innerHeight
  
  const handleViewportChange = () => {
    if (!editor) return
    
    const currentHeight = window.visualViewport?.height || window.innerHeight
    const heightDifference = initialViewportHeight - currentHeight
    
    // 如果高度减少超过150px，认为是虚拟键盘弹出
    if (heightDifference > 150) {
      // 调整编辑器高度以适应虚拟键盘
      const container = editorContainer.value
      if (container) {
        container.style.height = `${currentHeight - 100}px`
        editor.layout()
      }
    } else {
      // 虚拟键盘收起，恢复原始高度
      const container = editorContainer.value
      if (container) {
        container.style.height = props.height
        editor.layout()
      }
    }
  }

  // 监听视口变化
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleViewportChange)
  } else {
    // 降级方案：监听窗口大小变化
    window.addEventListener('resize', handleViewportChange)
  }

  // 监听焦点事件
  editor.onDidFocusEditorText(() => {
    // 编辑器获得焦点时，滚动到可见区域
    setTimeout(() => {
      const container = editorContainer.value
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 300) // 等待虚拟键盘动画完成
  })
}

// 初始化编辑器
const initEditor = async () => {
  if (!editorContainer.value) return

  try {
    const mobile = isMobile()
    const touch = isTouchDevice()
    
    // 合并选项
    const editorOptions = {
      ...getDefaultOptions(),
      ...props.options,
      value: props.modelValue,
      language: getMonacoLanguage(props.language),
      theme: props.theme
    }

    // 创建编辑器实例
    editor = monaco.editor.create(editorContainer.value, editorOptions)

    // 移动端特殊处理
    if (mobile) {
      // 禁用某些快捷键以避免与移动端手势冲突
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
        // 禁用 Ctrl+F 搜索，使用浏览器原生搜索
        return false
      })

      // 优化触摸滚动
      const domNode = editor.getDomNode()
      if (domNode) {
        domNode.style.touchAction = 'manipulation'
      }
    }

    // 监听内容变化
    editor.onDidChangeModelContent(() => {
      if (editor) {
        const value = editor.getValue()
        emit('update:modelValue', value)
        emit('change', value)
      }
    })

    // 设置编辑器大小
    updateEditorSize()

    // 移动端虚拟键盘适配
    if (mobile && touch) {
      setupMobileKeyboardHandling()
    }

  } catch (error) {
    console.error('Failed to initialize Monaco Editor:', error)
  }
}

// 更新编辑器大小
const updateEditorSize = () => {
  if (editor && editorContainer.value) {
    editorContainer.value.style.height = props.height
    editorContainer.value.style.width = props.width
    editor.layout()
  }
}

// 监听语言变化
watch(() => props.language, (newLanguage) => {
  if (editor) {
    const model = editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, getMonacoLanguage(newLanguage))
    }
  }
})

// 监听主题变化
watch(() => props.theme, (newTheme) => {
  if (editor) {
    monaco.editor.setTheme(newTheme)
  }
})

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (editor && editor.getValue() !== newValue) {
    editor.setValue(newValue)
  }
})

// 监听尺寸变化
watch([() => props.height, () => props.width], () => {
  nextTick(() => {
    updateEditorSize()
  })
})

// 暴露编辑器实例方法
const getEditor = () => editor
const focus = () => editor?.focus()
const setValue = (value: string) => editor?.setValue(value)
const getValue = () => editor?.getValue() || ''
const insertText = (text: string) => {
  if (editor) {
    const selection = editor.getSelection()
    const range = new monaco.Range(
      selection?.startLineNumber || 1,
      selection?.startColumn || 1,
      selection?.endLineNumber || 1,
      selection?.endColumn || 1
    )
    editor.executeEdits('', [{ range, text }])
  }
}

defineExpose({
  getEditor,
  focus,
  setValue,
  getValue,
  insertText
})

onMounted(async () => {
  await nextTick()
  await initEditor()
})

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
    editor = null
  }
})
</script>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.3);
  position: relative;
}

.monaco-editor {
  width: 100%;
  height: 100%;
}

/* 自定义滚动条样式 */
.monaco-editor-container :deep(.monaco-scrollable-element > .scrollbar > .slider) {
  background: rgba(255, 255, 255, 0.3) !important;
}

.monaco-editor-container :deep(.monaco-scrollable-element > .scrollbar > .slider:hover) {
  background: rgba(255, 255, 255, 0.5) !important;
}

/* 自定义选择高亮 */
.monaco-editor-container :deep(.monaco-editor .selected-text) {
  background-color: rgba(173, 214, 255, 0.3) !important;
}

/* 自定义行号样式 */
.monaco-editor-container :deep(.monaco-editor .line-numbers) {
  color: rgba(255, 255, 255, 0.6) !important;
}

/* 自定义光标样式 */
.monaco-editor-container :deep(.monaco-editor .cursor) {
  background-color: #ffffff !important;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .monaco-editor-container {
    border-radius: 8px;
    border-width: 1px;
  }
}

/* 小屏幕设备优化 */
@media (max-width: 480px) {
  .monaco-editor-container {
    border-radius: 6px;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .monaco-editor-container {
    /* 确保触摸滚动流畅 */
    -webkit-overflow-scrolling: touch;
    touch-action: manipulation;
  }
}

/* 高DPI屏幕优化 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .monaco-editor-container {
    /* 在高DPI屏幕上优化渲染 */
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}

/* 横屏模式优化 */
@media (max-height: 500px) and (orientation: landscape) {
  .monaco-editor-container {
    /* 横屏时减少边框以节省空间 */
    border-width: 1px;
  }
}
</style>