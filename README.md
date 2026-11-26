# 3 sport

سایت ویترینی فروشگاه ورزشی **3 sport** (ساری، میدان ساعت) با React و Vite.
کاملاً استاتیک است: بدون سرور، بدون دیتابیس و بدون هیچ کلید یا رمزی در کد.

## اجرای محلی

نیازمند Node.js نسخه 18 یا بالاتر.

```bash
npm install
npm run dev        # اجرای توسعه: http://localhost:5173
npm run build      # خروجی در پوشه dist
npm run preview    # پیش‌نمایش خروجی build
```

## انتشار روی Cloudflare Pages

### روش اول: اتصال به GitHub (پیشنهادی)

1. پروژه را در یک مخزن GitHub بگذار.
2. در داشبورد Cloudflare: **Workers & Pages ← Create ← Pages ← Connect to Git** و مخزن را انتخاب کن.
3. تنظیمات Build:
   - Framework preset: `Vite` (یا None)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - متغیر محیطی اختیاری: `NODE_VERSION = 20` (فایل `.node-version` هم همین را تعیین می‌کند)
4. روی **Save and Deploy** بزن. از این به بعد هر `git push` خودکار منتشر می‌شود.

### روش دوم: آپلود مستقیم

```bash
npm run build
npx wrangler pages deploy dist --project-name=3-sport
```

### مسیرهای داخلی و خطای 404

سایت از React Router استفاده می‌کند. Cloudflare Pages اگر فایل `404.html` در پروژه نباشد، هر مسیر ناشناخته را به `index.html` می‌فرستد، پس Refresh روی `/shop` یا `/product/...` خطا نمی‌دهد. **فایل `404.html` اضافه نکن.** صفحه «پیدا نشد» داخل خود React ساخته شده است.

## ویرایش محتوا

- محصولات، دسته‌بندی‌ها، آدرس و آیدی اینستاگرام: `src/data.js` (قیمت‌ها و محصولات فعلی نمونه‌اند).
- ویدیوی اسکرول‌محور: فایل mp4 را در `public/` بگذار و مقدار `SCROLL_VIDEO` در `src/data.js` را بنویس (مثلاً `'/hero.mp4'`). بهتر است ویدیو کوتاه و کم‌حجم باشد و کلیدفریم زیاد داشته باشد. تا زمانی که خالی است، پس‌زمینه انیمیشنی نئونی نمایش داده می‌شود.
- رنگ‌ها: متغیرهای ابتدای `src/styles.css`.

## امنیت

هیچ API Key یا رمزی در پروژه نیست. هر متغیر `VITE_*` در خروجی عمومی دیده می‌شود، پس چیز محرمانه‌ای در آن نگذار. فایل‌های `.env` در `.gitignore` هستند.
`public/_headers` هدرهای امنیتی و کش را روی Cloudflare Pages اعمال می‌کند.

## ساختار

```
src/App.jsx      چیدمان، مسیرها، پس‌زمینه اسکرول‌محور
src/pages.jsx    صفحه اصلی، محصولات، جزئیات محصول، 404
src/data.js      محصولات و تنظیمات فروشگاه
src/styles.css   استایل‌ها
public/          favicon و _headers
```
