export function downloadCsv(filename, rows, headers) {
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`

  const lines = [
    headers.map((h) => escape(h.label)).join(';'),
    ...rows.map((row) => headers.map((h) => escape(row[h.key])).join(';'))
  ]

  const csvContent = '﻿' + lines.join('\n') // BOM pour Excel + accents FR
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
