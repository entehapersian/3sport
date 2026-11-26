import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { motion, animate, useInView } from 'framer-motion'
import { ArrowLeft, ArrowRight, MapPin, MessageCircle, Search } from 'lucide-react'
import { CATS, PRODUCTS, STORE, IG_URL, IG_DM } from './data.js'

const fa = (n) => n.toLocaleString('fa-IR')
const catOf = (id) => CATS.find((c) => c.id === id)

const Page = ({ children }) => (
  <motion.main initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.main>
)

function Count({ to }) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!seen) return
    const a = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (x) => setV(Math.round(x)) })
    return () => a.stop()
  }, [seen, to])
  return <span ref={ref}>{fa(v)}</span>
}

const Badge = ({ tag }) => tag && <span className={`badge ${tag}`}>{tag === 'new' ? 'NEW' : 'SALE'}</span>

const Price = ({ p }) => (
  <p className="price">{p.old && <s>{fa(p.old)}</s>}<b>{fa(p.price)}</b>تومان</p>
)

function Card({ p }) {
  const { Icon } = catOf(p.cat)
  return (
    <Link to={`/product/${p.id}`} className="card">
      <div className="vis"><Icon size={64} strokeWidth={1.4} /><Badge tag={p.tag} /></div>
      <div className="cb"><h3>{p.name}</h3><Price p={p} /></div>
    </Link>
  )
}

const HEADLINE = 'پوشاک و کفش ورزشی، یک قدم جلوتر'.split(' ')

export function Home() {
  const sale = PRODUCTS.filter((p) => p.tag === 'sale').length
  const featured = [...PRODUCTS].sort((a, b) => !!b.tag - !!a.tag).slice(0, 8)
  const stats = [[CATS.length, 'دسته‌بندی'], [PRODUCTS.length, 'محصول در ویترین'], [sale, 'محصول با تخفیف']]

  return (
    <Page>
      <section className="hero">
        <span className="big3" aria-hidden="true">3</span>
        <div className="wrap">
          <h1>
            {HEADLINE.map((w, i) => (
              <span className="mask" key={i}>
                <motion.span initial={{ y: '115%' }} animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.09, ease: [0.2, 0.8, 0.2, 1] }}>{w}</motion.span>
              </span>
            ))}
          </h1>
          <p className="lead">کفش، گرمکن، کیت فوتبال و ست بانوان. محصولات را ببین و در اینستاگرام سفارش بده.</p>
          <div className="row">
            <Link className="btn fill" to="/shop">دیدن محصولات <ArrowLeft size={18} /></Link>
            <a className="btn" href={IG_DM} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} />سفارش در اینستاگرام</a>
          </div>
        </div>
      </section>

      <div className="mq" aria-hidden="true">
        <div>{[0, 1, 2, 3, 4, 5].map((k) => <span key={k}>{CATS.map((c) => <em key={c.id}>{c.t}</em>)}</span>)}</div>
      </div>

      <section className="wrap sec">
        <h2>دسته‌بندی‌ها</h2>
        <div className="cats">
          {CATS.map(({ id, t, Icon }) => (
            <Link key={id} to={`/shop?c=${id}`} className="tile"><Icon size={30} strokeWidth={1.6} /><span>{t}</span></Link>
          ))}
        </div>
      </section>

      <section className="wrap stats">
        {stats.map(([n, l]) => <div key={l}><strong><Count to={n} /></strong><span>{l}</span></div>)}
      </section>

      <section className="wrap sec">
        <div className="head"><h2>تازه‌ها و تخفیف‌ها</h2><Link to="/shop" className="more">همه محصولات</Link></div>
        <div className="grid">{featured.map((p) => <Card key={p.id} p={p} />)}</div>
      </section>

      <section className="wrap sec">
        <div className="visit">
          <div>
            <h2>فروشگاه حضوری</h2>
            <p><MapPin size={18} />{STORE.address}</p>
            <p>موجودی و قیمت روز را از اینستاگرام بپرس.</p>
          </div>
          <a className="btn fill" href={IG_URL} target="_blank" rel="noopener noreferrer">@{STORE.ig}</a>
        </div>
      </section>
    </Page>
  )
}

export function Shop() {
  const [sp, setSp] = useSearchParams()
  const [q, setQ] = useState('')
  const c = sp.get('c') || 'all'
  const list = PRODUCTS.filter((p) => (c === 'all' || p.cat === c) && p.name.includes(q.trim()))
  const pick = (id) => setSp(id === 'all' ? {} : { c: id }, { replace: true })

  return (
    <Page>
      <div className="wrap sec">
        <h1 className="h1">محصولات</h1>
        <label className="search">
          <Search size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجوی محصول" aria-label="جستجوی محصول" />
        </label>
        <div className="chips">
          {[{ id: 'all', t: 'همه' }, ...CATS].map((x) => (
            <button key={x.id} className={x.id === c ? 'on' : ''} onClick={() => pick(x.id)}>{x.t}</button>
          ))}
        </div>
        {list.length ? (
          <div className="grid">{list.map((p) => <Card key={p.id} p={p} />)}</div>
        ) : (
          <div className="empty">
            <p>محصولی پیدا نشد. فیلتر را پاک کن یا در اینستاگرام بپرس.</p>
            <button className="btn" onClick={() => { setQ(''); pick('all') }}>پاک کردن فیلتر</button>
          </div>
        )}
      </div>
    </Page>
  )
}

export function Product() {
  const { id } = useParams()
  const p = PRODUCTS.find((x) => x.id === id)
  if (!p) return <NotFound />
  const c = catOf(p.cat)
  const rel = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id)

  return (
    <Page>
      <div className="wrap sec">
        <Link to="/shop" className="back"><ArrowRight size={18} />همه محصولات</Link>
        <div className="pd">
          <div className="vis big"><c.Icon size={140} strokeWidth={1.2} /><Badge tag={p.tag} /></div>
          <div>
            <span className="tag">{c.t}</span>
            <h1 className="h1">{p.name}</h1>
            <Price p={p} />
            <p className="note">موجودی و سایز را در اینستاگرام بپرس. فروشگاه حضوری: {STORE.address}.</p>
            <a className="btn fill" href={IG_DM} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} />سفارش در اینستاگرام</a>
          </div>
        </div>
        {rel.length > 0 && (<><h2>محصولات مشابه</h2><div className="grid">{rel.map((x) => <Card key={x.id} p={x} />)}</div></>)}
      </div>
    </Page>
  )
}

export function NotFound() {
  return (
    <Page>
      <div className="wrap sec empty">
        <h1 className="h1">این صفحه وجود ندارد</h1>
        <p>آدرس را بررسی کن یا به صفحه اصلی برگرد.</p>
        <Link to="/" className="btn fill">صفحه اصلی</Link>
      </div>
    </Page>
  )
}
