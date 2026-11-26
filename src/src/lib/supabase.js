import { createClient } from '@supabase/supabase-js'

// فقط کلید عمومی (anon / publishable) اینجا مجاز است. امنیت داده‌ها با RLS در خود Supabase تأمین می‌شود.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// کلید محرمانه (service_role / secret) هرگز نباید در فرانت‌اند باشد؛ در این حالت اتصال ساخته نمی‌شود.
function isSecretKey(k) {
  if (k.startsWith('sb_secret_')) return true
  try {
    const payload = k.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(payload)).role === 'service_role'
  } catch {
    return false
  }
}

const unsafe = Boolean(key) && isSecretKey(key)
if (unsafe) console.error('[supabase] کلید محرمانه در VITE_SUPABASE_ANON_KEY گذاشته شده. فوراً آن را در Supabase تعویض کن.')

// بدون متغیرها سایت مثل قبل کار می‌کند و فقط بخش‌های وابسته به Supabase غیرفعال می‌مانند.
export const isSupabaseConfigured = Boolean(url && key) && !unsafe

export const supabase = isSupabaseConfigured ? createClient(url, key) : null
