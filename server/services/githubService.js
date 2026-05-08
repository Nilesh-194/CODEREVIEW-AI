export const githubFetch = async (token, path, options = {}) => {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
  })
  if (!response.ok) throw new Error(`GitHub API error ${response.status}`)
  const text = await response.text()
  return text ? JSON.parse(text) : {}
}

export const parsePrId = (prId) => {
  const [owner, repo, number] = String(prId).split(':')
  if (!owner || !repo || !number) throw new Error('PR id must be owner:repo:number')
  return { owner, repo, number }
}
