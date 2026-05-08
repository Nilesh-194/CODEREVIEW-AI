export const monacoTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6272A4' },
    { token: 'keyword', foreground: 'FF79C6' },
    { token: 'string', foreground: 'F1FA8C' },
    { token: 'number', foreground: 'BD93F9' },
    { token: 'type', foreground: '8BE9FD' },
  ],
  colors: {
    'editor.background': '#0D1117',
    'editor.foreground': '#E8EAF0',
    'editorLineNumber.foreground': '#4A5068',
    'editorLineNumber.activeForeground': '#8B92A8',
    'editor.lineHighlightBackground': '#181B24',
    'editorGutter.background': '#0D1117',
    'editor.selectionBackground': '#1E2130',
  },
}

export const applyDecorations = (editor, monaco, comments) => {
  const decorations = comments.map((comment) => ({
    range: new monaco.Range(comment.line, 1, comment.line, 1),
    options: {
      isWholeLine: true,
      className: `line-${comment.severity}`,
      glyphMarginClassName: `glyph-${comment.severity}`,
      glyphMarginHoverMessage: { value: `**${comment.title}**\n\n${comment.explanation}` },
      overviewRuler: {
        color: comment.severity === 'error' ? '#FF4560' : comment.severity === 'warning' ? '#FFB800' : comment.severity === 'good' ? '#00C47A' : '#0097FF',
        position: monaco.editor.OverviewRulerLane.Right,
      },
    },
  }))
  return editor.deltaDecorations([], decorations)
}
