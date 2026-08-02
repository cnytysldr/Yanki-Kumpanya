---
belge_turu: "Proje Sunum / Teslim Dosyası (AI Okunabilir)"
proje_adi: "Yankı Kumpanya Web Sitesi"
surum: "1.0"
tarih: "2026-08-02"
hedef_kitle: "Yazılım ekibi (devralan geliştiriciler ve yapay zeka araçları)"
okuma_yontemi: "Bölümler sıralı okunmalı; kod ve şema blokları harfiyen uygulanmalıdır."
dil: "Türkçe"
---

# YANKI KUMPANYA – PROJE SUNUM & TESLİM DOSYASI

## 1. PROJE ÖZETİ

**Yankı Kumpanya** bir tiyatro topluluğunun tanıtım web sitesidir. Proje tamamen statik (HTML/CSS/JS) bir sitedir; arka uç (backend) yoktur. İçerik yönetimi, **GitHub deposu üzerinden JSON dosyalarına yazma** ile yapılır. Site **Netlify** üzerinde barındırılır; Netlify, GitHub'a yapılan her commit'i otomatik yayınlar (CI/CD).

### 1.1 Kritik Tanımlar (Sözlük)

| Terim | Anlamı |
|---|---|
| **Admin Paneli** | İçerik yönetim arayüzü (`admin/index.html`). GitHub API ile veri okur/yazar. |
| **Veri Dosyaları** | `data/*.json` klasöründeki 6 JSON dosyası. Sitenin TÜM içeriği burada saklanır. |
| **GitHub Raw CDN** | `raw.githubusercontent.com` – sitenin JSON verileri buradan çekilir. |
| **Netlify Deploy** | GitHub'a push edilen her commit sonrası otomatik yayınlama. |
| **PAT (Token)** | GitHub Personal Access Token – admin paneli giriş anahtarı. |
| **localStorage** | Tarayıcı kalıcı depolama alanı (admin token burada saklanır). |

---

## 2. TEKNİK YIĞIN (STACK)

| Katman | Teknoloji | Açıklama |
|---|---|---|
| Frontend | Saf HTML5 + CSS3 + JavaScript (ES6+) | Framework yok (React/Vue yok) |
| Fontlar | Google Fonts: **Playfair Display** + **Inter** | Google Fonts CDN |
| İkonlar | Font Awesome 6.5.1 | cdnjs CDN |
| Görseller | Unsplash CDN (URL ile) | Görseller projede saklanmaz, URL olarak JSON içinde tutulur |
| Veri Depolama | GitHub Repository (JSON dosyaları) | `cnytysldr/Yanki-Kumpanya`, branch: `main` |
| Veri Okuma (Site) | GitHub Raw CDN + `fetch()` | Cache-busting: `?t=Date.now()` |
| Veri Yazma (Admin) | GitHub REST API v3 | `GET/PUT /repos/{owner}/{repo}/contents/{path}` |
| Hosting / CI | Netlify (auto-deploy, GitHub bağlı) | Canlı: `https://yanki-kumpanya.netlify.app` |
| Giriş Sistemi | GitHub PAT (localStorage'da `yk_token`) | Herhangi bir OAuth/Identity YOK |

**Renk Paleti:** Sarı `#FFD700` / Siyah `#0d0d0d` / Koyu gri `#1a1a1a` / Metin `#e0e0e0`

---

## 3. DOSYA YAPISI (FİZİKSEL HARİTA)

```
yanki-kumpanya/                          # Proje kökü (Netlify publish dizini)
│
├── index.html                           # ANA SAYFA (hero + oyunlar + galeri + footer)
├── hakkinda.html                        # Hakkımızda sayfası
├── repertuar.html                       # Repertuar / oyunlar listesi sayfası
├── galeri.html                          # Galeri sayfası (lightbox'lı)
├── iletisim.html                        # İletişim + Google Maps sayfası
│
├── css/
│   └── style.css                        # TÜM stiller (tek dosya, ~12.6 KB)
│
├── js/
│   ├── script.js                        # Genel JS (header, lightbox, mobil menü, animasyon)
│   └── data.js                          # Veri çekme katmanı (fetchData, kart HTML üreticileri)
│
├── data/                                # ⚠️ SİTENİN BEYNI – tüm içerik burada
│   ├── hero.json                        # Ana sayfa hero bölümü
│   ├── shows.json                       # Oyunlar (repertuar)
│   ├── gallery.json                     # Galeri fotoğrafları
│   ├── about.json                       # Hakkında sayfası + ekip + istatistikler
│   ├── contact.json                     # İletişim bilgileri + sosyal medya + harita
│   └── footer.json                      # Footer metinleri
│
├── admin/
│   └── index.html                       # ADMIN PANELİ (tek dosya, tüm JS inline)
│
├── .netlify/
│   ├── netlify.toml                     # Netlify yapılandırması (publish kök dizin)
│   └── state.json                       # Netlify site ID (dfd8d752-...)
│
└── .git/                                # Git deposu (remote: GitHub, token'la bağlı – bkz. Bölüm 10)
```

---

## 4. VERİ ŞEMALARI (JSON DOSYALARI)

> **UYARI:** Şu an depodaki `data/hero.json` içinde **karakter bozulması var** (bkz. Bölüm 8.1). Aşağıdaki şemalar DOĞRU hedef yapıdır.

### 4.1 `data/hero.json` – Ana sayfa hero
```json
{
  "image": "https://...jpg",       // Arka plan görseli (1920px önerilir)
  "title": "Yankı Kumpanya",
  "subtitle": "İstanbul Tiyatrosu",
  "slogan": "Sahnenin ışığı, ruhun yankısıdır.",
  "btnText": "Repertuarı Keşfet",
  "btnLink": "repertuar.html"
}
```

### 4.2 `data/shows.json` – Oyunlar (dizi)
```json
[
  {
    "title": "Kayıp Geceler",        // Oyun adı
    "date": "Her Cuma & Cumartesi, 20:30",
    "desc": "Kısa açıklama",
    "img": "https://...jpg",         // Kapak görseli
    "badge": "Yeni",                 // Rozet: "Yeni"/"Popüler"/"Yakında" veya boş
    "status": "Sahnede"              // "Sahnede" | "Yakında" | "Arşiv"
  }
]
```
**Durum (status) mantığı:**
- `Sahnede` → yeşil etiket; ana sayfada gösterilir
- `Yakında` → sarı etiket; ana sayfada gösterilir
- `Arşiv` → gri etiket; yalnız repertuar sayfasında görünür, ana sayfada FİLTRELENİR

### 4.3 `data/gallery.json` – Galeri (dizi)
```json
[
  { "img": "https://...jpg", "caption": "Sahne Performansı" }
]
```
> Not: Eski sürümde sadece string URL dizisi destekleniyordu; admin paneli `{img, caption}` nesnesi yazar. Sitenin `galleryItemHTML` fonksiyonu her iki formatı da okur (güvenli).

### 4.4 `data/about.json` – Hakkında
```json
{
  "title": "Hikayemiz",
  "p1": "İlk paragraf",
  "p2": "İkinci paragraf",
  "image": "https://...jpg",
  "stats": [ {"value": "50+", "label": "Oyun"}, ... ],  // Tam 4 adet
  "mission": "Misyon metni",
  "vision": "Vizyon metni",
  "team": [ {"name": "Ahmet Yılmaz", "role": "Genel Sanat Yönetmeni", "img": "https://...jpg"} ]
}
```

### 4.5 `data/contact.json` – İletişim
```json
{
  "address": "Caferağa Mah., Moda Cad. No:45, Kadıköy/İstanbul",
  "phone": "+90 216 123 45 67",
  "email": "info@yankikumpanya.com",
  "biletEmail": "bilet@yankikumpanya.com",
  "hours": "Salı – Cumartesi: 12:00 – 20:00",
  "mapEmbed": "https://www.google.com/maps/embed?pb=...",  // iframe src
  "social": {
    "instagram": "https://instagram.com/yankikumpanya",
    "twitter": "", "youtube": "", "facebook": "", "tiktok": ""
  }
}
```

### 4.6 `data/footer.json` – Footer
```json
{
  "copyright": "2026 Yankı Kumpanya. Tüm hakları saklıdır.",
  "newsletterTitle": "Bülten",
  "newsletterDesc": "Yeni oyunlar ve etkinliklerden haberdar olun."
}
```

---

## 5. MİMARİ & VERİ AKIŞI

### 5.1 Güncel Akış Diyagramı (mevcut durum)

```
┌──────────────────┐     1.PUT (GitHub API)      ┌───────────────────┐
│   ADMIN PANELİ   │ ───────────────────────────► │  GITHUB REPO      │
│  admin/index.html│                              │  data/*.json      │
└──────────────────┘                              └─────────┬─────────┘
                                                            │ 2.commit (API ile)
                                                            ▼
                                                   ┌───────────────────┐
                                                   │  NETLIFY (CDN)    │
                                                   │  auto-deploy      │
                                                   └─────────┬─────────┘
                                                            │ 3. (YENİ) HTML/JSON yayını
┌──────────────────┐     4.fetch(raw.githubusercontent   ────┘
│  SİTE SAYFALARI  │ ──────────────.com/.../data/X.json)────►  GITHUB RAW CDN
│  *.html          │     (her sayfa yüklendiğinde)
└──────────────────┘
```

**Adım adım:**
1. Admin paneli, GitHub REST API (`PUT /contents`) ile JSON dosyalarını günceller → GitHub'da commit oluşur.
2. Netlify, GitHub webhook'u ile commit'i algılar ve siteyi yeniden yayınlar (otomatik deploy, ~30 sn–2 dk).
3. Ziyaretçi siteyi açar → her sayfa `js/data.js` içindeki `fetchData()` ile **doğrudan GitHub Raw CDN'den** JSON çeker.
4. `fetchData`, tarayıcı önbelleğini aşmak için URL'ye `?t=${Date.now()}` (zaman damgası) ekler.

### 5.2 Kritik Bağımlılık Zinciri
- **Admin → Site arasında DOĞRUDAN bağlantı YOKTUR.** İkisi yalnızca "GitHub deposu" üzerinden dolaylı bağlıdır.
- Site veriyi GitHub Raw CDN'den çeker; Raw CDN, commit sonrası **birkaç saniye–dakika gecikme** yaşatabilir.
- Bu durum, "admin'de kaydettim ama sitede görünmüyor" sorununun KÖK NEDENİDİR (Bölüm 8.2).

### 5.3 Görsel Yüklenme Stratejisi
- Tüm görseller **URL'dir** (Unsplash). Projede yerel görsel dosyası yoktur.
- Görsel URL'leri `?w=600&q=80` gibi boyut parametreleriyle optimize edilmiştir.
- **Netlify üzerinde görsel optimize/compress ayarı YOKTUR** (netlify.toml'da build.processing boştur).

---

## 6. ADMIN PANELİ DETAYLARI (`admin/index.html`)

### 6.1 Genel Yapı
- Tek sayfa, tüm CSS/JS inline (harici dosya bağımlılığı yoktur).
- İki ana görünüm: **Login ekranı** (`#login-wrap`) ve **Panel** (`#admin`).
- Sol kenar çubuğu 8 bölüm: Dashboard, Hero, Oyunlar, Galeri, Hakkında, İletişim, Footer, Ayarlar.

### 6.2 Kimlik Doğrulama (Auth)
- Kullanıcı GitHub **PAT** girer → `GET https://api.github.com/user` çağrılır (doğrulama).
- Başarılıysa token `localStorage.setItem('yk_token', TOKEN)` ile saklanır.
- Sayfa her açılışta `yk_token` varsa otomatik giriş yapar.

### 6.3 GitHub API Fonksiyonları (kritik kod parçaları)
| Fonksiyon | Görevi | Dikkat Noktası |
|---|---|---|
| `ghGet(path)` | Dosyayı GitHub'dan okur | **`atob(json.content)` kullanır → UTF-8 bozulması BURADA (Bölüm 8.1)** |
| `ghPut(path, content, sha)` | Dosyayı commit'ler | `btoa(unescape(encodeURIComponent(...)))` ile UTF-8 yazımı DOĞRU |
| `loadFile(path)` | JSON parse eder | Bozuk string'i JSON.parse eder → veri bozulur |
| `saveFile(path, data)` | Okuma+sha+PUT zinciri | sha ile çakışmasız güncelleme |
| `loadAllData()` | 6 dosyayı birden yükler | `DATA` nesnesini doldurur |
| `saveAllData()` | 6 dosyayı Promise.all ile yazar | GitHub rate limit'e takılabilir (60/saat anon) |

### 6.4 Kaydetme Fonksiyonları (her biri → `saveFile` çağırır)
`saveHero()` → hero.json · `saveShow()` → shows.json · `deleteShow(i)` → shows.json
`saveGalleryItem()` → gallery.json · `deleteGallery(i)` → gallery.json
`saveAbout()` → about.json · `saveContact()` → contact.json · `saveFooter()` → footer.json

### 6.5 Admin Kullanıcı Arayüzü Özellikleri
- Dashboard: oyun/fotoğraf sayısı, son aktivite, hızlı işlemler
- Oyunlar: tablo + ekle/düzenle/sil (form `#show-form`)
- Galeri: tablo + ekle/düzenle/sil (form `#gallery-form`)
- Hakkında: hikaye, 4 istatistik, misyon/vizyon, ekip üyeleri (prompt'lu ekleme)
- İletişim: tüm alanlar + sosyal medya linkleri
- Ayarlar: repo/branch bilgisi (salt okunur), "Tüm Verileri Kaydet" butonu

### 6.6 Kullanıcı Arayüzü Notları
- Tüm işlemlerde toast bildirimi (`#toast`)
- Silme işlemlerinde `confirm()` onayı
- "Siteyi Görüntüle" → `href="../index.html" target="_blank"` (göreceli yol)

---

## 7. SİTE SAYFALARI DETAYLARI

### 7.1 Ortak Yapı (5 sayfada da var)
- `js/data.js` + `js/script.js` + sayfaya özel inline `<script>` (async IIFE)
- Inline script, `fetchData('xxx.json')` ile veri çeker, DOM'u günceller
- Footer tüm sayfalarda **sabit kodlanmıştır** (footer.json'dan OKUNMAZ – bilinen eksiklik, Bölüm 8.3)

### 7.2 Sayfa → Veri Eşlemesi

| Sayfa | Çektiği JSON | Güncellediği Eleman(lar) |
|---|---|---|
| `index.html` | hero.json, shows.json, gallery.json | `.hero-bg` (src), `.logo-hero` (başlık/alt başlık), `.slogan`, `.cta-btn` (metin/href), `#shows-grid`, `#home-gallery` |
| `repertuar.html` | shows.json | `#repertuar-grid` (TÜM oyunlar, durum etiketli) |
| `galeri.html` | gallery.json | `#gallery-full` (tüm fotoğraflar) |
| `hakkinda.html` | about.json | `.about-grid .text h2/p`, istatistikler, `#hakkinda-mission`, `#hakkinda-vision`, `.team-grid` |
| `iletisim.html` | contact.json | `#contact-address-text`, `#contact-phone-link`, `#contact-email-link`, `#contact-bilet-link`, `#contact-hours-text`, `.map-frame` (src), `.social-links a` (href) |

### 7.3 `js/data.js` (Veri Katmanı) – Teknik Detay
```javascript
const GITHUB_RAW = 'https://raw.githubusercontent.com/cnytysldr/Yanki-Kumpanya/main';
async function fetchData(file) {
  const r = await fetch(`${GITHUB_RAW}/data/${file}?t=${Date.now()}`);
  if (!r.ok) throw new Error(r.status);
  return await r.json();          // hata durumunda null döner
}
```
- `showCardHTML(s)` → oyun kartı HTML'i üretir (Sahnede/Yakında/Arşiv durumlarını da basar)
- `galleryItemHTML(img)` → galeri öğesi HTML'i üretir (string veya `{img}` kabul eder)

### 7.4 `js/script.js` (Genel Davranış)
Loader, yapışkan header (scroll>60px), mobil menü (hamburger), scroll-top butonu (>500px), `IntersectionObserver` ile fade-in animasyonu, aktif menü vurgusu, galeri lightbox (klavye: Esc/←/→), iletişim formu (yalnızca görsel simülasyon – gerçek gönderim YOK).

---

## 8. BİLİNEN HATALAR & KÖK NEDEN ANALİZİ

### 8.1 🔴 KRİTİK – Türkçe Karakter Bozulması (Encoding Bug)
**Belirti:** `data/hero.json` içinde "Yankı" → "YankÄ±", "ışığı" → "Ä±ÅŸÄ±ÄŸÄ±" olarak bozulmuş. (Şu an canlı veride mevcut!)

**Kök Neden:** `admin/index.html` içinde `ghGet()` fonksiyonu:
```javascript
return { content: atob(json.content), sha: json.sha };
```
`atob()` UTF-8 veriyi **Latin-1 (byte) string'e** çevirir. Türkçe karakterler (ı, ş, ö, ü, ç, ğ) bozulur. Veri daha sonra kaydedilirse bozuk hali **kalıcı olarak** depoya yazılır.

**Doğru Çözüm (ekibe not):** `atob` sonrası UTF-8 decode edilmeli:
```javascript
const raw = atob(json.content);
const utf8 = decodeURIComponent(escape(raw));   // VEYA
const bytes = Uint8Array.from(raw, c => c.charCodeAt(0));
const utf8 = new TextDecoder('utf-8').decode(bytes);
```

**Acil Eylem:** `data/hero.json` doğru içerikle yeniden yazılmalı (Bölüm 4.1 şemasına göre; alt başlık kullanıcının son girdiği "Muğla Tiyatrosu" olabilir – kullanıcıyla doğrulanmalı).

### 8.2 🔴 KRİTİK – Admin'de Kaydedilen Veri Sitede Görünmüyor
**Belirti:** Admin panelinde kaydet → "Siteyi Görüntüle" → site eski içeriği gösteriyor. Yerel dosyadan (file://) açınca düzeliyor; sayfa yenileyince değişmiyor.

**Kök Neden:** İki ayrı gecikme kaynağı:
1. **GitHub Raw CDN önbelleği:** commit sonrası `raw.githubusercontent.com` eski içeriği bir süre daha sunabilir.
2. **Netlify deploy döngüsü:** Her kayıt bir commit → Netlify yeniden deploy (30 sn–2 dk). Kullanıcı hemen görüntülerse eski sürüm gelir.
3. **Tarayıcı önbelleği:** HTML dosyalarının kendisi cache'lenebilir.

**Önerilen Çözüm (localStorage köprüsü – ekibe uygulanmadı):**
- **Admin tarafı:** Her `saveFile()` başarısında aynı veriyi `localStorage.setItem('yk_data_hero', JSON.stringify(data))` vb. anahtarlarla da yaz.
- **Site tarafı (`js/data.js`):** `fetchData()` önce `localStorage`'ı kontrol etsin, yoksa GitHub'dan çeksin. Böylece admin kaydeder kaydetmez aynı tarayıcıda açılan site anında güncel veriyi gösterir.

### 8.3 🟡 ORTA – Footer Dinamik Değil
Footer içerikleri (`footer.json`) site sayfalarında OKUNMUYOR; her sayfada sabit HTML var. Admin'de footer kaydedilse bile sitede görünmez.

**Çözüm önerisi:** `script.js`'e footer verisini çekip `#footer-content` alanına yazma mantığı eklenmeli; sayfalardaki footer HTML'i `data-*`/id etiketleriyle dinamik hale getirilmeli.

### 8.4 🟡 ORTA – İletişim Formu Sahte
Form gönderme işlevi yalnızca "Gönderildi!" mesajı gösterir; gerçek bir e-posta/API kaydı yapılmaz. FormSPREE / Netlify Forms / backend API gerekir.

### 8.5 🟡 ORTA – GitHub API Rate Limit Riski
Admin paneli anonim sayılabilir; GitHub API limiti **60 istek/saat/IP** (auth'lu: 5000). `saveAllData()` 6 eşzamanlı PUT yapar. Yoğun kullanımda 403 hatası olasıdır. Hata yakalama (`try/catch`) eksiktir – hata olursa kullanıcıya gösterilmez.

### 8.6 🟢 DÜŞÜK – Şişirilmiş Unsplash Alanları
`mapEmbed` URL'sinde `!2zNDDCsDU4JzQwLjgi...` kısmındaki "0" karakterleri bozuk konum kodudur (enlem/boylam kaybı). Harita konumu doğrulanmalı.

---

## 9. EKİP İÇİN UYGULAMA ÖNCELİK LİSTESİ (TRELLO/JIRA HAZIR)

| # | Öncelik | Görev | Dosya | Tahmini Efor |
|---|---|---|---|---|
| 1 | 🔴 P0 | `atob` → UTF-8 decode düzeltmesi + hero.json'u onarma | `admin/index.html`, `data/hero.json` | 1 saat |
| 2 | 🔴 P0 | localStorage köprüsü (admin yaz + site oku) | `admin/index.html`, `js/data.js` | 2 saat |
| 3 | 🟡 P1 | Footer'ı `footer.json`'dan dinamik yapma | 5 sayfa + `js/script.js` | 2 saat |
| 4 | 🟡 P1 | `try/catch` hata yönetimi + kullanıcıya hata mesajı | `admin/index.html` | 1 saat |
| 5 | 🟡 P2 | İletişim formu → Netlify Forms veya FormSPREE | `iletisim.html`, `js/script.js` | 1–2 saat |
| 6 | 🟢 P2 | Google Maps embed URL'yi düzeltme | `data/contact.json` | 15 dk |

---

## 10. GÜVENLİK NOTLARI (⚠️ EKİP DİKKATİNE)

1. **Git remote URL'inde token gömülü!** Depo `git remote`'a `https://TOKEN@github.com/cnytysldr/Yanki-Kumpanya.git` şeklinde bağlıdır. Token artık sızıntı riski taşır. **Öneri:** GitHub'da token'ı iptal edip yenisi alınmalı, remote `git remote set-url` ile credential olmadan bağlanmalı, SSH veya GitHub CLI (`gh`) kullanılmalı.
2. **Admin token tarayıcıda saklanıyor** (`localStorage.yk_token`). XSS açığı olursa token çalınabilir. Uzun vadede OAuth akışı veya Netlify Identity düşünülmeli.
3. **Netlify token** (`nfp_...`) CLI kullanımı için kullanıldı; yalnızca yetkili kişilerde bulunmalı.
4. Bu dosyanın içine **gerçek token değerleri yazılmamıştır**; ekip üyelerine güvenli kanaldan (şifre yöneticisi) verilmelidir.

---

## 11. HOSTING & DAĞITIM BİLGİLERİ

| Öğe | Değer |
|---|---|
| Canlı Site | https://yanki-kumpanya.netlify.app |
| Admin Paneli | https://yanki-kumpanya.netlify.app/admin/ |
| GitHub Repo | https://github.com/cnytysldr/Yanki-Kumpanya (branch: main) |
| Netlify Site ID | `dfd8d752-65ff-4ba4-8c78-b0bf90452552` |
| Netlify Proje | https://app.netlify.com/projects/yanki-kumpanya |
| Deploy Yöntemi | GitHub push → otomatik (webhook) |
| Yerel Deploy | `netlify deploy --prod --dir="."` (token gerekir) |
| DİKKAT | CLI deploy sırasında yanlışlıkla YENİ site oluşturuldu (`spontaneous-seahorse-fc8594`) – oluşmasına izin verilmemeli; `--site <siteId>` bayrağıyla hedeflenmeli |

### 11.1 Doğru CLI Deploy Komutu
```powershell
$env:NETLIFY_AUTH_TOKEN="<token>"
netlify deploy --prod --dir="." --site=dfd8d752-65ff-4ba4-8c78-b0bf90452552
```

---

## 12. TEST PLANI (DEVİR SONRASI DOĞRULAMA)

1. **Encoding:** Admin'de "Kayıp Geceler" başlığını düzenle → kaydet → GitHub'daki JSON'da Türkçe karakterlerin bozulmadığını doğrula.
2. **Veri akışı (yeni çözüm):** Admin'de hero sloganını değiştir → kaydet → "Siteyi Görüntüle" → slogan anında değişmiş olmalı (localStorage).
3. **Yenileme:** İkinci tarayıcıda (private pencere) site aç → veri GitHub'dan gelmeli (fallback çalışıyor mu?).
4. **Repertuar filtre:** "Arşiv" status'lu oyun ana sayfada görünmemeli, repertuar sayfasında görünmeli.
5. **Galeri lightbox:** Tıklama → büyütme → ok/esc tuşları çalışıyor mu?
6. **Mobil:** 375px genişlikte hamburger menü açılıp kapanıyor mu?
7. **Netlify deploy:** GitHub'a push → Deploys sayfasında başarılı build ve canlı URL'de değişiklik.
8. **Rate limit:** Art arda 5 kayıt → 403 alınıyor mu?

---

## 13. ROADMAP (İSTEĞE BAĞLI GELECEK)

- **P0 sonrası:** Netlify Forms ile gerçek iletişim formu
- **P1:** Oyun detay sayfası (`oyun.html?id=x` veya modal)
- **P2:** Çoklu dil desteği (TR/EN)
- **P2:** Görsel yönetimi (URL yerine Netlify Large Media / GitHub upload)
- **P3:** Bülten aboneliğini gerçek servise bağlama (Mailchimp/Buttondown)
- **P3:** SEO: meta etiketleri, Open Graph, sitemap.xml, robots.txt

---

## 14. BU DOSYANIN KENDİSİ

- **Dosya yolu:** `C:\Users\CÜNEYT\Documents\Default Project\yanki-kumpanya\PROJE-SUNUM.md`
- **Hedef tüketiciler:** (a) devralan insan geliştiriciler, (b) yapay zeka ajanları (CI, code assistant)
- **Güncelleme kuralı:** Her önemli mimari değişiklikte bu dosya güncellenmeli; şema değişiklikleri Bölüm 4'e işlenmeli.

*Belge sonu.*
