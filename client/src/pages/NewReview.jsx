import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import MonacoWrapper from '../components/editor/MonacoWrapper'
import Button from '../components/ui/Button'
import axios from '../lib/axios'
import { demoCode } from '../data/demo'

const methods = [
  ['paste', 'Paste Code', 'Drop a snippet directly into Monaco.'],
  ['upload', 'Upload File', 'Review .js .ts .py .go .java .cpp files.'],
  ['github', 'GitHub PR', 'Paste a pull request URL for review.'],
]
const focusOptions = ['Security', 'Performance', 'Best Practices', 'Readability', 'Bugs']

const NewReview = () => {
  const navigate = useNavigate()
  const [method, setMethod] = useState('paste')
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(demoCode)
  const [depth, setDepth] = useState('standard')
  const [focusAreas, setFocusAreas] = useState(['Security', 'Bugs'])
  const [file, setFile] = useState(null)
  const [prUrl, setPrUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    setSubmitting(true)
    try {
      const body = new FormData()
      body.append('source', method)
      body.append('language', language)
      body.append('depth', depth)
      body.append('focusAreas', focusAreas.join(','))
      body.append('filename', method === 'upload' ? file?.name || 'upload.js' : method === 'github' ? 'pull-request.js' : 'snippet.js')
      body.append('code', code)
      if (file) body.append('file', file)
      if (prUrl) body.append('prUrl', prUrl)
      const { data } = await axios.post('/api/reviews', body)
      navigate(`/review/${data.reviewId}/processing`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppShell>
      <div className="main-header"><div><h1 className="main-title">New Review</h1><p className="main-sub">Choose a source and tune the review depth</p></div></div>
      <div className="new-review-body">
        <div className="options-row">
          {methods.map(([key, title, desc]) => (
            <button className={`option-card ${method === key ? 'selected' : ''}`} type="button" onClick={() => setMethod(key)} key={key}>
              <div className="option-icon">{key === 'paste' ? '{}' : key === 'upload' ? '⇧' : '⇄'}</div>
              <div><div className="option-title">{title}</div><div className="option-desc">{desc}</div></div>
              <div className={`radio-circle ${method === key ? 'checked' : ''}`} />
            </button>
          ))}
        </div>
        <div className="review-input-panel">
          {method === 'paste' && (
            <>
              <div className="toolbar-line">
                <select value={language} onChange={(event) => setLanguage(event.target.value)} className="select-box">
                  {['javascript', 'typescript', 'python', 'go', 'java', 'cpp'].map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
              <div className="editor-box"><MonacoWrapper code={code} language={language} onChange={(value) => setCode(value || '')} /></div>
            </>
          )}
          {method === 'upload' && (
            <label className="upload-zone">
              <input type="file" accept=".js,.ts,.py,.go,.java,.cpp" onChange={(event) => setFile(event.target.files?.[0])} hidden />
              <div className="upload-icon">⇧</div>
              <div className="upload-title">{file ? file.name : 'Drop a file or click to upload'}</div>
              <div className="upload-sub">JavaScript, TypeScript, Python, Go, Java, and C++ files up to 1MB</div>
              <div className="upload-formats">{['.js', '.ts', '.py', '.go', '.java', '.cpp'].map((ext) => <span className="format-pill" key={ext}>{ext}</span>)}</div>
            </label>
          )}
          {method === 'github' && <input className="text-input" value={prUrl} onChange={(event) => setPrUrl(event.target.value)} placeholder="https://github.com/owner/repo/pull/42" />}
        </div>
        <div className="selector-row">
          {['quick', 'standard', 'deep'].map((item) => <button className={`pill ${depth === item ? 'active' : ''}`} type="button" onClick={() => setDepth(item)} key={item}>{item}</button>)}
        </div>
        <div className="selector-row">
          {focusOptions.map((item) => (
            <button className={`pill ${focusAreas.includes(item) ? 'active' : ''}`} type="button" onClick={() => setFocusAreas((areas) => areas.includes(item) ? areas.filter((area) => area !== item) : [...areas, item])} key={item}>{item}</button>
          ))}
        </div>
        <Button className="run-review" disabled={submitting} onClick={submit}>{submitting ? 'Starting...' : 'Run AI Review →'}</Button>
      </div>
    </AppShell>
  )
}

export default NewReview
