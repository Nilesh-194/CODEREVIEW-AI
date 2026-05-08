import { lazy, Suspense, useRef } from 'react'
import { applyDecorations, monacoTheme } from '../../lib/monaco'

const MonacoEditor = lazy(async () => {
  const module = await import('@monaco-editor/react')
  module.loader.config({
    paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' },
  })
  return module
})

const MonacoWrapper = ({ code, language = 'javascript', readOnly = false, comments = [], onLineClick, onChange }) => {
  const editorRef = useRef(null)

  const handleMount = (editor, monaco) => {
    editorRef.current = editor
    monaco.editor.defineTheme('codereview-dark', monacoTheme)
    monaco.editor.setTheme('codereview-dark')
    applyDecorations(editor, monaco, comments)
    editor.onMouseDown((event) => {
      const lineNumber = event.target.position?.lineNumber
      if (lineNumber) onLineClick?.(lineNumber)
    })
  }

  return (
    <Suspense fallback={<div className="editor-loading">Loading editor...</div>}>
      <MonacoEditor
        height="100%"
        value={code}
        language={language}
        onChange={onChange}
        onMount={handleMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontFamily: 'JetBrains Mono',
          fontSize: 13,
          lineHeight: 24,
          glyphMargin: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </Suspense>
  )
}

export default MonacoWrapper
