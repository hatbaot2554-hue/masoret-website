export function messageParts(line) {
  const parts = []
  const pattern = /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)|https?:\/\/[^\s<>\[\]]+|\*\*([^*]+)\*\*/g
  let end = 0
  for (const match of String(line).matchAll(pattern)) {
    if (match.index > end) parts.push({ text: line.slice(end, match.index) })
    if (match[3]) parts.push({ text: match[3], bold: true })
    else {
      const raw = match[2] || match[0]
      const url = match[2] || raw.replace(/[.,;:!?)}]+$/, '')
      parts.push({ text: match[1] || url, url })
      if (!match[2] && raw.length > url.length) parts.push({ text: raw.slice(url.length) })
    }
    end = match.index + match[0].length
  }
  if (end < line.length) parts.push({ text: line.slice(end) })
  return parts
}
