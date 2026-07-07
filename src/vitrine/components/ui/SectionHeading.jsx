import Reveal from './Reveal'

// Titre de section centré avec petit trait ondulé décoratif (repris du visuel de référence).
export default function SectionHeading({ eyebrow, title, accentWord, description, align = 'center' }) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'

  return (
    <Reveal className={`flex flex-col ${alignment} max-w-2xl gap-3`}>
      {eyebrow && (
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-teal-600">{eyebrow}</span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink relative inline-block">
        {title}
        {accentWord && <span className="text-coral-500"> {accentWord}</span>}
        <svg
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-3 text-teal-500"
          viewBox="0 0 64 12"
          fill="none"
        >
          <path
            d="M2 8c6-8 12-8 18 0s12 8 18 0 12-8 18 0"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </h2>
      {description && <p className="text-slate-500 mt-3">{description}</p>}
    </Reveal>
  )
}
