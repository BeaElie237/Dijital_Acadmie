import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { getLikeState, toggleLike } from '../services/likesService'

export default function LikeButton({ projectId, baseLikes = 0 }) {
  const [count, setCount] = useState(baseLikes)
  const [likedByMe, setLikedByMe] = useState(false)
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    getLikeState(projectId, baseLikes).then((state) => {
      setCount(state.count)
      setLikedByMe(state.likedByMe)
    })
  }, [projectId, baseLikes])

  const handleClick = async () => {
    await toggleLike(projectId)
    const fresh = await getLikeState(projectId, baseLikes)
    setCount(fresh.count)
    setLikedByMe(fresh.likedByMe)
    if (fresh.likedByMe) {
      setBurst(true)
      setTimeout(() => setBurst(false), 500)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={likedByMe}
      className={`relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        likedByMe ? 'bg-coral-100 text-coral-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
      }`}
    >
      <span className="relative">
        <Heart size={16} fill={likedByMe ? 'currentColor' : 'none'} />
        <AnimatePresence>
          {burst && (
            <motion.span
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 rounded-full bg-coral-400"
            />
          )}
        </AnimatePresence>
      </span>
      {count}
    </button>
  )
}
