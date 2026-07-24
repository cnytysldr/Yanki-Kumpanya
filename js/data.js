/* ============================================================
   YANKI KUMPANYA – Data Fetcher
   GitHub raw content'tan veri çeker
   ============================================================ */

const GITHUB_RAW = 'https://raw.githubusercontent.com/cnytysldr/Yanki-Kumpanya/main';

async function fetchData(file) {
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
