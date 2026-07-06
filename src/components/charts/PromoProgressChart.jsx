import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function PromoProgressChart({ students }) {
  const data = students.map((s) => ({
    name: s.student_code,
    progression: Math.round(s.progress)
  }))

  if (!data.length) {
    return <p className="text-sm text-slate-400">Aucune donnée à afficher.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
        <Tooltip formatter={(value) => [`${value}%`, 'Progression']} />
        <Bar dataKey="progression" fill="#2a5cff" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
