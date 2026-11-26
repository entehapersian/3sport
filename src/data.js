import { Footprints, Tag, Flame, Trophy, Shirt, Zap, Backpack, Sparkles } from 'lucide-react'

export const STORE = { ig: 'three.3.sport', address: 'مازندران، ساری، میدان ساعت' }
export const IG_URL = `https://instagram.com/${STORE.ig}`
export const IG_DM = `https://ig.me/m/${STORE.ig}`

// ویدیوی پس‌زمینه که با اسکرول جلو و عقب می‌رود. فایل mp4 را در public بگذار و مسیرش را بنویس (مثلاً '/hero.mp4').
// خالی باشد، پس‌زمینه انیمیشنی پیش‌فرض نمایش داده می‌شود.
export const SCROLL_VIDEO = ''

export const CATS = [
  { id: 'sneakers', t: 'کفش اسپرت', Icon: Footprints },
  { id: 'stock', t: 'کفش استوک', Icon: Tag },
  { id: 'sets', t: 'ست و گرمکن', Icon: Flame },
  { id: 'football', t: 'کیت فوتبال', Icon: Trophy },
  { id: 'tops', t: 'هودی و تی‌شرت', Icon: Shirt },
  { id: 'women', t: 'ورزشی بانوان', Icon: Zap },
  { id: 'bags', t: 'کیف و کوله', Icon: Backpack },
  { id: 'socks', t: 'جوراب', Icon: Sparkles },
]

// محصولات نمونه (قیمت‌ها به تومان). برای مدیریت محصولات فقط همین لیست را ویرایش کن.
// tag: 'new' یا 'sale' | old: قیمت قبل از تخفیف
export const PRODUCTS = [
  { id: 'runner-neon', cat: 'sneakers', name: 'کفش رانینگ نئون', price: 3_450_000, tag: 'new' },
  { id: 'walk-light', cat: 'sneakers', name: 'کفش پیاده‌روی سبک', price: 2_890_000 },
  { id: 'stock-brand', cat: 'stock', name: 'کفش استوک برند', price: 1_590_000, old: 2_100_000, tag: 'sale' },
  { id: 'stock-classic', cat: 'stock', name: 'کفش استوک کلاسیک', price: 1_390_000, old: 1_800_000, tag: 'sale' },
  { id: 'tracksuit-full', cat: 'sets', name: 'ست گرمکن کامل', price: 2_750_000, tag: 'new' },
  { id: 'tracksuit-two', cat: 'sets', name: 'گرمکن دو تکه', price: 2_150_000 },
  { id: 'kit-training', cat: 'football', name: 'کیت فوتبال تمرینی', price: 1_250_000 },
  { id: 'kit-classic', cat: 'football', name: 'کیت فوتبال کلاسیک', price: 1_650_000, tag: 'new' },
  { id: 'hoodie-black', cat: 'tops', name: 'هودی مشکی', price: 1_890_000 },
  { id: 'tee-sport', cat: 'tops', name: 'تی‌شرت ورزشی', price: 690_000, old: 850_000, tag: 'sale' },
  { id: 'women-set', cat: 'women', name: 'ست لگینگ و کراپ‌تاپ', price: 1_950_000, tag: 'new' },
  { id: 'women-legging', cat: 'women', name: 'لگینگ ورزشی', price: 890_000 },
  { id: 'bag-backpack', cat: 'bags', name: 'کوله‌پشتی ورزشی', price: 1_450_000 },
  { id: 'bag-gym', cat: 'bags', name: 'ساک باشگاه', price: 1_190_000 },
  { id: 'socks-3', cat: 'socks', name: 'جوراب ورزشی ۳ جفتی', price: 320_000 },
]
