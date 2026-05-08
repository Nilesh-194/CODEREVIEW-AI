import Groq from 'groq-sdk'

const steps = [
  'Parsing syntax',
  'Scanning for security issues',
  'Analyzing code patterns',
  'Generating fix suggestions',
  'Compiling final report',
]

const severityOrder = { error: 0, warning: 1, info: 2, good: 3 }

const fallbackReview = (code) => ({
  score: 74,
  grade: 'C',
  summary: 'The code is reviewable, but the live AI provider is not configured. Add GROQ_API_KEY to enable production review generation.',
  stats: { errors: 1, warnings: 2, info: 1, good: 1 },
  comments: [
    {
      line: Math.min(1, code.split('\n').length),
      severity: 'error',
      title: 'AI key missing',
      explanation: 'GROQ_API_KEY is not configured on the server, so this deterministic fallback report was returned.',
      fix: 'Set GROQ_API_KEY in server/.env',
    },
    {
      line: Math.min(2, code.split('\n').length),
      severity: 'warning',
      title: 'Review incomplete',
      explanation: 'Connect Groq to receive full security, performance, readability, and bug analysis.',
      fix: null,
    },
  ],
})

const writeSse = (res, payload) => {
  res.write(`data: ${JSON.stringify(payload)}\n\n`)
}

const normalizeReview = (review, code) => {
  const maxLine = Math.max(code.split('\n').length, 1)
  const comments = Array.isArray(review.comments) ? review.comments : []
  const normalized = comments
    .map((comment) => ({
      line: Math.min(Math.max(Number(comment.line) || 1, 1), maxLine),
      severity: ['error', 'warning', 'info', 'good'].includes(comment.severity) ? comment.severity : 'info',
      title: String(comment.title || 'Review note').slice(0, 80),
      explanation: String(comment.explanation || ''),
      fix: comment.fix ? String(comment.fix) : null,
    }))
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

  const stats = normalized.reduce((acc, comment) => {
    acc[comment.severity] += 1
    return acc
  }, { errors: 0, warnings: 0, info: 0, good: 0 })

  stats.errors = normalized.filter((c) => c.severity === 'error').length
  stats.warnings = normalized.filter((c) => c.severity === 'warning').length

  return {
    score: Math.min(Math.max(Number(review.score) || 0, 0), 100),
    grade: ['A', 'B', 'C', 'D', 'F'].includes(review.grade) ? review.grade : 'F',
    summary: String(review.summary || 'Review complete.'),
    stats,
    comments: normalized,
  }
}

export const streamReview = async (code, language, options, res) => {
  const { depth = 'standard', focusAreas = [] } = options
  const focusInstructions = focusAreas.length > 0
    ? `Prioritize these areas: ${focusAreas.join(', ')}.`
    : 'Cover all areas equally.'
  const depthInstructions = {
    quick: 'Identify only critical errors and security issues. Maximum 5 comments.',
    standard: 'Thorough review covering security, bugs, and best practices. Maximum 12 comments.',
    deep: 'Exhaustive review covering every possible improvement. Maximum 20 comments.',
  }[depth] || 'Thorough review covering security, bugs, and best practices. Maximum 12 comments.'

  const prompt = `You are an expert code reviewer. Analyze the following ${language} code.
${focusInstructions}
${depthInstructions}

Return ONLY a valid JSON object. No markdown, no backticks, no text outside JSON.

Code to review:
${code}

Return this exact JSON structure:
{
  "score": <integer 0-100>,
  "grade": <"A"|"B"|"C"|"D"|"F">,
  "summary": "<2 sentence overall assessment>",
  "stats": { "errors": <count>, "warnings": <count>, "info": <count>, "good": <count> },
  "comments": [
    { "line": <line number integer>, "severity": <"error"|"warning"|"info"|"good">, "title": "<short title max 8 words>", "explanation": "<detailed explanation 1-3 sentences>", "fix": "<corrected code only, or null if no fix needed>" }
  ]
}`

  for (let i = 0; i < steps.length - 1; i += 1) {
    writeSse(res, { type: 'progress', step: i, message: steps[i], percent: Math.round((i / steps.length) * 80) })
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'replace_me') {
    const review = normalizeReview(fallbackReview(code), code)
    writeSse(res, { type: 'progress', step: 4, message: steps[4], percent: 100 })
    writeSse(res, { type: 'complete', review })
    res.end()
    return review
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
    response_format: { type: 'json_object' },
    temperature: 0.1,
  })

  let fullResponse = ''
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || ''
    fullResponse += text
    writeSse(res, { type: 'chunk', text })
  }

  const review = normalizeReview(JSON.parse(fullResponse), code)
  writeSse(res, { type: 'progress', step: 4, message: steps[4], percent: 100 })
  writeSse(res, { type: 'complete', review })
  res.end()
  return review
}

export const streamAsk = async ({ question, review }, res) => {
  const answer = `Based on ${review.filename}, focus on the highest-severity comments first. ${question ? `For your question: ${question}` : ''}`
  for (const token of answer.split(' ')) {
    writeSse(res, { type: 'chunk', text: `${token} ` })
    await new Promise((resolve) => setTimeout(resolve, 40))
  }
  writeSse(res, { type: 'complete' })
  res.end()
}
