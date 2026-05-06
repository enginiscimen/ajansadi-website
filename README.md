# AjansAdı — Statik Site

Saf HTML / CSS / JS ile yazılmış dijital pazarlama ajansı sitesi. Build step yok, framework yok; doğrudan herhangi bir static host'ta (Netlify, Vercel, Cloudflare Pages, S3, GitHub Pages) yayına alınabilir.

## Hızlı başlangıç

```bash
cd websitem
python3 -m http.server 8000
# http://localhost:8000 adresinde açılır
```

Alternatif: `npx serve .` veya VS Code Live Server eklentisi.

## Klasör yapısı

```
websitem/
├── index.html                              # Anasayfa (one-page özet)
├── iletisim.html                           # İletişim sayfası + form
├── hizmetler/
│   ├── dijital-pazarlama.html
│   ├── sosyal-medya-yonetimi.html
│   ├── google-ads.html
│   ├── seo.html
│   ├── yapay-zeka.html
│   └── medya-satin-alma.html
├── assets/
│   ├── css/                                # base.css, components.css, pages.css
│   ├── js/                                 # main.js, i18n.js, form.js
│   └── img/                                # favicon.svg, og-image.svg
└── README.md
```

## Yayına almadan önce yapılacaklar

### 1) Web3Forms access key

`assets/js/form.js` dosyasındaki sabit:

```js
const WEB3FORMS_ACCESS_KEY = "BURAYA_WEB3FORMS_ACCESS_KEY";
```

[web3forms.com](https://web3forms.com) üzerinden ücretsiz bir access key alıp bu değeri değiştirin. Anahtar olmadan form gönderimi `error` state'e düşecektir.

### 2) Marka bilgileri (find & replace)

Tüm `.html` dosyalarında geçen placeholder'ları kendi bilgilerinizle değiştirin:

| Placeholder | Açıklama |
|---|---|
| `AjansAdı` / `ajansadı` | Marka adı (büyük/küçük harf duyarlı, ikisini de değiştirin) |
| `info@ajansadi.com` | İletişim e-postası |
| `+90 555 000 00 00` | Telefon (gösterim) |
| `tel:+905550000000` | Telefon (link) |
| `wa.me/905550000000` | WhatsApp linki |
| `Karaköy, İstanbul · Türkiye` | Stüdyo adresi |
| `https://ajansadi.com` | Canonical URL'ler (her sayfada `<link rel="canonical">`) |
| `instagram.com/ajansadi` · `linkedin.com/company/ajansadi` · `x.com/ajansadi` | Sosyal medya URL'leri |

**Önerilen yaklaşım:** Editörünüzde proje genelinde "Replace in Files":

```
AjansAdı       → MarkanızınAdı
ajansadı       → markanızınadı
ajansadi.com   → markanizinalanadiniz.com
info@ajansadi  → info@markanizinalanadi
+90 555 000 00 00 → +90 5XX XXX XX XX
905550000000   → 90XXXXXXXXXX
```

### 3) Görseller

`assets/img/` içinde iki SVG placeholder bulunur:

- `favicon.svg` — site sekmesinde görünecek logo (32×32 viewport için optimize)
- `og-image.svg` — sosyal medya paylaşımlarında görünecek 1200×630 görsel

İkisini de kendi marka kimliğinizle değiştirin. PNG/JPG kullanmak isterseniz HTML dosyalarında `<link rel="icon">` ve `<meta property="og:image">` referanslarını da güncelleyin.

### 4) Referans markalar (logo marquee)

`index.html` içindeki `.marquee` bölümünde 8 placeholder marka adı var. Gerçek müşteri markalarınızla değiştirin (text olarak; logo SVG'leri eklemek için aynı yapıyı `<img>` ile değiştirebilirsiniz).

### 5) Testimonial içerikleri

`index.html` testimonials bölümündeki 3 alıntı + isim + şirket placeholder'dır. Gerçek müşteri yorumlarıyla değiştirin.

### 6) Hizmet detaylarındaki KPI ve süreç açıklamaları

Her hizmet sayfasında (4 bullet + 4 process + KPI bloğu + 3 SSS) örnek metinler var. Markanızın gerçek metodolojisini yansıtacak şekilde düzenleyin.

## Diller

Site TR (varsayılan) + EN destekler. Her metin `data-tr="..."` ve `data-en="..."` attribute çiftiyle yazılır; sağ üstteki `TR / EN` butonuyla anlık geçiş yapılır. Tercih `localStorage` üzerinde saklanır.

Yeni metin eklerken her iki dil için de attribute eklemeyi unutmayın. HTML içeren metinler için `data-tr-html` / `data-en-html` kullanın.

## Erişilebilirlik & performans

- Renk kontrastı: ink `#0A0A0A` on bg `#F4F1EA` ≈ 17:1 — WCAG AAA.
- `prefers-reduced-motion: reduce` aktifken tüm parallax / cursor / reveal animasyonları kapanır.
- Tüm odaklanabilir elemanlarda görünür focus ring (accent renkli).
- Hiçbir external JS/CSS yok — sadece Google Fonts. İsterseniz `assets/fonts/` altına Inter + Instrument Serif WOFF2'leri indirip self-host edebilirsiniz (her HTML dosyasında `<link href="https://fonts.googleapis.com/...">` satırını kaldırın).

## Deploy

Static olduğu için herhangi bir platforma sürükle-bırak yeterli:

- **Netlify / Vercel:** klasörü drop'la, hazır.
- **Cloudflare Pages:** GitHub repo + boş build command + `/` output directory.
- **GitHub Pages:** `main` branch root.
- **Kendi sunucu:** nginx/apache ile sadece klasörü serve et.

## Geliştirme notları

- CSS değişkenleri `assets/css/base.css` `:root` bloğunda — renk paletini buradan değiştirin.
- Tipografi clamp() ile fluid; breakpoint'ler `768px` ve `1024px`.
- Custom cursor sadece `pointer: fine` cihazlarda aktif (mobilde otomatik kapanır).
- Form validation native HTML5 + custom inline error mesajıyla — `assets/js/form.js`.
