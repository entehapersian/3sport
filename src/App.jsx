
import { useEffect, useRef } from 'react'
import {
  Routes,
  Route,
  Link,
  NavLink,
  useLocation,
} from 'react-router-dom'

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion'

import { SCROLL_VIDEO, IG_URL } from './data.js'
import { Home, Shop, Product, NotFound } from './pages.jsx'
import Admin from './admin/Admin.jsx'

// پس‌زمینه متحرک سایت
function Backdrop() {
  const { scrollYProgress } = useScroll()
  const rotate = useTransform(scrollYProgress, [0, 1], [-25, 155])
  const video = useRef(null)

  useEffect(() => {
    if (!SCROLL_VIDEO) return

    return scrollYProgress.on('change', (p) => {
      const v = video.current
      if (v && v.duration) {
        v.currentTime = v.duration * p
      }
    })
  }, [scrollYProgress])

  return (
    <div className="bd" aria-hidden="true">
      {SCROLL_VIDEO ? (
        <video
          ref={video}
          src={SCROLL_VIDEO}
          muted
          playsInline
          preload="auto"
        />
      ) : (
        <motion.div className="track" style={{ rotate }}>
          <svg viewBox="0 0 800 800">
            {[380, 330, 280, 230, 180].map((r, i) => (
              <ellipse
                key={r}
                cx="400"
                cy="400"
                rx={r}
                ry={r * 0.62}
                fill="none"
                stroke="#d4ff00"
                strokeWidth="2"
                strokeDasharray={i % 2 ? '6 14' : 'none'}
                opacity={1 - i * 0.16}
              />
            ))}
          </svg>
        </motion.div>
      )}

      <div className="shade" />
    </div>
  )
}

// سربرگ سایت
function Header() {
  return (
    <header className="hd">
      <div className="wrap bar">
        <Link to="/" className="brand">
          <b>3</b> sport
        </Link>

        <nav>
          <NavLink to="/" end>
            خانه
          </NavLink>

          <NavLink to="/shop">
            محصولات
          </NavLink>

          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            اینستاگرام
          </a>
        </nav>
      </div>
    </header>
  )
}

// برنامه اصلی
export default function App() {
  const loc = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [loc.pathname])

  const year = new Date().toLocaleDateString('fa-IR', {
    year: 'numeric',
  })

  // پنل مدیریت بدون سربرگ و پس‌زمینه فروشگاه
  if (loc.pathname === '/admin') {
    return <Admin />
  }

  return (
    <MotionConfig reducedMotion="user">
      <Backdrop />

      <Header />

      <AnimatePresence mode="wait">
        <Routes location={loc} key={loc.pathname}>
          <Route path="/" element={<Home />} />

          <Route path="/shop" element={<Shop />} />

          <Route path="/product/:id" element={<Product />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>

      <footer className="ft">
        <div className="wrap">
          <span>3 sport، ساری، میدان ساعت</span>
          <span>© {year}</span>
        </div>
      </footer>
    </MotionConfig>
  )
}
