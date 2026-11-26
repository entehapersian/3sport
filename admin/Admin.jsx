
import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const BUCKET = 'product-images'

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  category: '',
  price: '',
  sale_price: '',
  stock: 0,
  specifications: '{}',
  is_published: false,
  images: [],
}

export default function Admin() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [files, setFiles] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) loadProducts()
  }, [session])

  async function loadProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setMessage('خطا در دریافت محصولات: ' + error.message)
      return
    }

    setProducts(data || [])
  }

  async function login(e) {
    e.preventDefault()
    setBusy(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setBusy(false)

    if (error) setMessage('ورود ناموفق: ' + error.message)
  }

  async function logout() {
    await supabase.auth.signOut()
    setProducts([])
  }

  function updateField(name, value) {
    setForm(current => ({ ...current, [name]: value }))
  }

  function editProduct(product) {
    setEditingId(product.id)
    setForm({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      category: product.category || '',
      price: product.price ?? '',
      sale_price: product.sale_price ?? '',
      stock: product.stock ?? 0,
      specifications: JSON.stringify(product.specifications || {}, null, 2),
      is_published: Boolean(product.is_published),
      images: product.images || [],
    })
    setFiles([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
    setFiles([])
  }

  async function uploadImages() {
    const uploaded = []

    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: false })

      if (error) throw error

      const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path)

      uploaded.push(data.publicUrl)
    }

    return uploaded
  }

  async function saveProduct(e) {
    e.preventDefault()
    setBusy(true)
    setMessage('')

    try {
      if (!form.name.trim() || !form.category.trim()) {
        throw new Error('نام و دسته‌بندی محصول الزامی است.')
      }

      if (Number(form.price) < 0 || Number(form.stock) < 0) {
        throw new Error('قیمت و موجودی نمی‌توانند منفی باشند.')
      }

      const specifications = JSON.parse(form.specifications || '{}')
      const newImages = await uploadImages()

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || `product-${Date.now()}`,
        description: form.description,
        category: form.category.trim(),
        price: Number(form.price),
        sale_price: form.sale_price === '' ? null : Number(form.sale_price),
        stock: Number(form.stock),
        specifications,
        images: [...form.images, ...newImages],
        is_published: form.is_published,
        updated_at: new Date().toISOString(),
      }

      if (payload.sale_price !== null && payload.sale_price < 0) {
        throw new Error('قیمت تخفیف نمی‌تواند منفی باشد.')
      }

      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingId)

        if (error) throw error
        setMessage('محصول ویرایش شد.')
      } else {
        const { error } = await supabase
          .from('products')
          .insert(payload)

        if (error) throw error
        setMessage('محصول جدید ثبت شد.')
      }

      resetForm()
      await loadProducts()
    } catch (error) {
      setMessage('خطا: ' + error.message)
    }

    setBusy(false)
  }

  async function deleteProduct(id) {
    if (!window.confirm('محصول حذف شود؟')) return

    setBusy(true)

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      setMessage('خطا در حذف: ' + error.message)
    } else {
      setMessage('محصول حذف شد.')
      await loadProducts()
    }

    setBusy(false)
  }

  async function togglePublish(product) {
    const { error } = await supabase
      .from('products')
      .update({
        is_published: !product.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', product.id)

    if (error) {
      setMessage('خطا: ' + error.message)
    } else {
      await loadProducts()
    }
  }

  if (!isSupabaseConfigured) {
    return <main className="admin-page">اتصال Supabase تنظیم نشده است.</main>
  }

  if (loading) {
    return <main className="admin-page">در حال بررسی ورود...</main>
  }

  if (!session) {
    return (
      <main className="admin-page">
        <form className="admin-login" onSubmit={login}>
          <h1>ورود مدیریت</h1>
          <input
            type="email"
            placeholder="ایمیل مدیر"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button disabled={busy}>
            {busy ? 'در حال ورود...' : 'ورود به پنل'}
          </button>
          {message && <p>{message}</p>}
        </form>
      </main>
    )
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <h1>مدیریت فروشگاه 3Sport</h1>
        <button type="button" onClick={logout}>خروج</button>
      </header>

      {message && <p className="admin-message">{message}</p>}

      <form className="admin-form" onSubmit={saveProduct}>
        <h2>{editingId ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h2>

        <label>نام محصول</label>
        <input
          value={form.name}
          onChange={e => updateField('name', e.target.value)}
          required
        />

        <label>آدرس محصول (Slug)</label>
        <input
          value={form.slug}
          onChange={e => updateField('slug', e.target.value)}
          placeholder="مثلاً nike-air"
        />

        <label>دسته‌بندی</label>
        <input
          value={form.category}
          onChange={e => updateField('category', e.target.value)}
          placeholder="مثلاً sneakers"
          required
        />

        <label>توضیحات</label>
        <textarea
          value={form.description}
          onChange={e => updateField('description', e.target.value)}
        />

        <label>قیمت اصلی (تومان)</label>
        <input
          type="number"
          min="0"
          value={form.price}
          onChange={e => updateField('price', e.target.value)}
          required
        />

        <label>قیمت با تخفیف (اختیاری)</label>
        <input
          type="number"
          min="0"
          value={form.sale_price}
          onChange={e => updateField('sale_price', e.target.value)}
        />

        <label>موجودی</label>
        <input
          type="number"
          min="0"
          value={form.stock}
          onChange={e => updateField('stock', e.target.value)}
          required
        />

        <label>مشخصات محصول (JSON)</label>
        <textarea
          rows="5"
          value={form.specifications}
          onChange={e => updateField('specifications', e.target.value)}
        />

        <label>تصاویر محصول</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={e => setFiles(Array.from(e.target.files || []))}
        />

        {form.images.length > 0 && (
          <div className="admin-images">
            {form.images.map((url, index) => (
              <div key={url}>
                <img src={url} alt="" />
                <button
                  type="button"
                  onClick={() => updateField(
                    'images',
                    form.images.filter((_, i) => i !== index)
                  )}
                >
                  حذف تصویر
                </button>
              </div>
            ))}
          </div>
        )}

        <p>{files.length} تصویر جدید انتخاب شده است.</p>

        <label className="admin-check">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={e => updateField('is_published', e.target.checked)}
          />
          انتشار محصول در سایت
        </label>

        <button type="submit" disabled={busy}>
          {busy ? 'در حال ذخیره...' : editingId ? 'ذخیره تغییرات' : 'ثبت محصول'}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            انصراف از ویرایش
          </button>
        )}
      </form>

      <section className="admin-products">
        <h2>محصولات ثبت‌شده ({products.length})</h2>

        {products.map(product => (
          <article className="admin-product" key={product.id}>
            <div>
              <strong>{product.name}</strong>
              <p>قیمت: {Number(product.price).toLocaleString('fa-IR')} تومان</p>
              <p>موجودی: {product.stock}</p>
              <p>{product.is_published ? 'منتشرشده' : 'پیش‌نویس'}</p>
            </div>

            <div className="admin-actions">
              <button type="button" onClick={() => editProduct(product)}>
                ویرایش
              </button>
              <button type="button" onClick={() => togglePublish(product)}>
                {product.is_published ? 'لغو انتشار' : 'انتشار'}
              </button>
              <button type="button" onClick={() => deleteProduct(product.id)}>
                حذف
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
