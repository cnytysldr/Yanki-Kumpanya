/* ============================================================
   YANKI KUMPANYA – Data Fetcher
   GitHub raw content'tan veri çeker
   ============================================================ */

const GITHUB_RAW = 'https://raw.githubusercontent.com/cnytysldr/Yanki-Kumpanya/main';

async function fetchData(file) {
  const localKey = 'yk_data_' + file.replace('.json', '');
  const localData = localStorage.getItem(localKey);
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch(e) {}
  }
  
  try {
    const r = await fetch(`${GITHUB_RAW}/data/${file}?t=${Date.now()}`);
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch (e) {
    console.warn(`Veri yüklenemedi: ${file}`, e);
    return null;
  }
}

function showCardHTML(s) {
  return `
    <div class="show-card fade-in">
      <div class="img-wrap">
        <img src="${s.img || ''}" alt="${s.title || ''}">
        ${s.badge ? `<span class="badge">${s.badge}</span>` : ''}
      </div>
      <div class="info">
        <h3>${s.title || ''}</h3>
        <div class="meta"><i class="fas fa-calendar-alt" style="color:#FFD700;margin-right:6px"></i>${s.date || ''}</div>
        <p>${s.desc || ''}</p>
        <a href="repertuar.html" class="btn-link">Detay &rarr;</a>
      </div>
    </div>`;
}

function galleryItemHTML(img) {
  const src = typeof img === 'string' ? img : img.img || '';
  return `
    <div class="gallery-item fade-in">
      <img src="${src}" alt="Galeri">
      <div class="overlay"><i class="fas fa-expand"></i></div>
    </div>`;
}

async function loadDynamicFooter() {
  const footer = await fetchData('footer.json');
  const contact = await fetchData('contact.json');
  const fEl = document.querySelector('.footer');
  if (fEl && footer && contact) {
    fEl.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="logo-footer">Yankı Kumpanya</div>
          <p>Muğla'nın bağımsız tiyatro topluluğu. 2018'den beri sahnede.</p>
          <div class="social-row">
            ${contact.social?.instagram ? `<a href="${contact.social.instagram}"><i class="fab fa-instagram"></i></a>` : ''}
            ${contact.social?.twitter ? `<a href="${contact.social.twitter}"><i class="fab fa-twitter"></i></a>` : ''}
            ${contact.social?.youtube ? `<a href="${contact.social.youtube}"><i class="fab fa-youtube"></i></a>` : ''}
            ${contact.social?.facebook ? `<a href="${contact.social.facebook}"><i class="fab fa-facebook"></i></a>` : ''}
            ${contact.social?.tiktok ? `<a href="${contact.social.tiktok}"><i class="fab fa-tiktok"></i></a>` : ''}
          </div>
        </div>
        <div>
          <h4>Sayfalar</h4>
          <ul>
            <li><a href="index.html">Ana Sayfa</a></li>
            <li><a href="hakkinda.html">Hakkında</a></li>
            <li><a href="repertuar.html">Repertuar</a></li>
            <li><a href="galeri.html">Galeri</a></li>
            <li><a href="iletisim.html">İletişim</a></li>
          </ul>
        </div>
        <div>
          <h4>İletişim</h4>
          <ul>
            <li><i class="fas fa-map-marker-alt" style="color:#FFD700;margin-right:8px"></i> ${contact.address?.split(',')[0] || ''}</li>
            <li><i class="fas fa-phone" style="color:#FFD700;margin-right:8px"></i> ${contact.phone || ''}</li>
            <li><i class="fas fa-envelope" style="color:#FFD700;margin-right:8px"></i> ${contact.email || ''}</li>
          </ul>
        </div>
        <div>
          <h4>${footer.newsletterTitle || 'Bülten'}</h4>
          <p style="margin-bottom:12px">${footer.newsletterDesc || ''}</p>
          <form style="display:flex;gap:0">
            <input type="email" placeholder="E-posta adresiniz" style="flex:1;padding:10px 14px;background:#1a1a1a;border:1px solid #333;color:#e0e0e0;font-size:.85rem;border-radius:3px 0 0 3px;border-right:none">
            <button type="button" style="background:#FFD700;color:#0d0d0d;border:none;padding:10px 18px;font-weight:700;cursor:pointer;border-radius:0 3px 3px 0;font-size:.85rem">Abone Ol</button>
          </form>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <span class="ssl"><i class="fas fa-lock"></i></span>
        ${footer.copyright || '&copy; 2026 Yankı Kumpanya. Tüm hakları saklıdır.'}
      </div>
    </div>`;
  }
}
document.addEventListener('DOMContentLoaded', loadDynamicFooter);
