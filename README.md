# 3D Product Showcase (Tanpa Scan Marker)

Proyek ini menampilkan galeri produk 3D berbasis web:

- Halaman landing berisi thumbnail produk.
- Saat thumbnail diklik, user masuk ke halaman detail.
- Halaman detail menampilkan model 3D interaktif + deskripsi objek.

## Teknologi

- HTML, CSS, JavaScript
- Three.js (`WebGLRenderer`, `GLTFLoader`, `OrbitControls`)

## Struktur Proyek

```
Web-AR/
│
├── index.html              ← Landing page (gallery)
├── index.js                ← Render katalog dari data model
├── catalog.js              ← Data katalog & path model
├── viewer.html             ← Halaman detail model 3D
├── viewer.js               ← Logic render model 3D (Three.js)
├── style.css               ← Styling landing + detail page
├── script.js               ← Legacy script lama (tidak dipakai halaman baru)
│
├── assets/
│   ├── models/
│   │   ├── angklung/
│   │   │   ├── scene.gltf
│   │   │   └── scene.bin
│   │   └── laptop/
│   │       ├── model.gltf
│   │       ├── model.bin
│   │       ├── thumbnail.png
│   │       └── LICENSE.md
│   ├── images/
│   └── videos/
│
└── README.md
```

## Konvensi Asset (1 Model = 1 Folder)

Gunakan pola berikut agar rapi dan mudah scale:

```
assets/models/
	laptop/
		model.gltf
		model.bin
		thumbnail.png
	car/
		model.glb
		thumbnail.jpg
```

- Landing menuju viewer dengan query parameter: `viewer.html?item=laptop`
- Mapping item dikelola terpusat di [catalog.js](catalog.js)

## Menjalankan Proyek

1. Jalankan server lokal (Live Server VS Code atau sejenisnya).
2. Buka halaman [index.html](index.html).
3. Klik kartu produk laptop.
4. Model 3D akan muncul di [viewer.html](viewer.html).

## Kontrol di Halaman Viewer

- Drag kiri: putar model
- Scroll / pinch: zoom
- Drag kanan: pan kamera

## Deploy

Proyek ini cocok untuk deploy static hosting seperti Vercel/GitHub Pages.
