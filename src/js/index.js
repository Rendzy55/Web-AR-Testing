import { MODEL_CATALOG } from './catalog.js';

const container = document.getElementById('gallery-container');

function createCard(item) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const topLink = document.createElement('a');
  topLink.href = `viewer.html?item=${encodeURIComponent(item.id)}`;
  topLink.className = 'product-link';

  if (item.thumbPath) {
    const img = document.createElement('img');
    img.src = item.thumbPath;
    img.alt = `${item.title} Thumbnail`;
    img.className = 'product-thumbnail';
    img.loading = 'lazy';
    topLink.appendChild(img);
  } else {
    const fallback = document.createElement('div');
    fallback.className = 'product-thumbnail product-thumbnail-fallback';
    fallback.textContent = 'No Thumbnail';
    topLink.appendChild(fallback);
  }

  const info = document.createElement('div');
  info.className = 'product-info';

  const title = document.createElement('h2');
  title.className = 'product-title';
  title.textContent = item.title;

  const desc = document.createElement('p');
  desc.className = 'product-description';
  desc.textContent = item.shortDescription || item.description || '';

  info.appendChild(title);
  info.appendChild(desc);
  topLink.appendChild(info);

  const action = document.createElement('a');
  action.href = `viewer.html?item=${encodeURIComponent(item.id)}`;
  action.className = 'view-button';
  action.textContent = 'Ayo Jelajahi! ✨';

  card.appendChild(topLink);
  card.appendChild(action);
  return card;
}

const entries = Object.values(MODEL_CATALOG);

if (entries.length === 0) {
  const empty = document.createElement('p');
  empty.textContent = 'Belum ada model 3D di katalog.';
  container.appendChild(empty);
} else {
  entries.forEach((item) => container.appendChild(createCard(item)));
}
