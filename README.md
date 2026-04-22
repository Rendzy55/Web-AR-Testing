# Proyek WebAR Budaya Sunda - Angklung

Proyek ini adalah aplikasi web Augmented Reality (AR) sederhana untuk menampilkan model 3D Angklung ketika kamera perangkat mendeteksi gambar marker tertentu.

## Teknologi yang Digunakan

- **MindAR.js**: Library open-source untuk membangun aplikasi WebAR, khususnya untuk fungsionalitas *Image Tracking*.
- **Three.js**: Library JavaScript untuk membuat dan menampilkan grafis 3D di browser.
- **HTML, CSS, JavaScript**: Teknologi web standar.

## Struktur Proyek

```
WebAR-BudayaSunda/
│
├── index.html              ← Halaman utama WebAR
├── script.js               ← Kode JavaScript untuk Three.js + MindAR
├── style.css               ← Styling untuk halaman
│
├── targets.mind            ← File hasil kompilasi marker
│
├── assets/
│   ├── models/
│   │   └── angklung.glb    ← File model 3D Angklung
│   │
│   ├── images/
│   │   └── marker-source.jpg   ← Gambar marker asli (untuk referensi)
│   │
│   └── videos/             ← Direktori untuk video (jika ada)
│
└── README.md               ← Catatan proyek
```

## Cara Menjalankan

1.  **Siapkan Marker**:
    - Letakkan gambar yang akan Anda jadikan marker di dalam direktori `assets/images/` (misalnya `marker-source.jpg`).
    - Kompilasi gambar marker tersebut menggunakan [MindAR Image Compiler](https://hiukim.github.io/mind-ar-js-ens-beta/compiler.html).
    - Unduh file `.mind` yang dihasilkan dan ganti nama menjadi `targets.mind`, lalu letakkan di direktori utama proyek.

2.  **Siapkan Model 3D**:
    - Pastikan file model 3D `angklung.glb` sudah ada di dalam direktori `assets/models/`.

3.  **Jalankan Server Lokal**:
    - Karena WebAR memerlukan akses kamera dan konteks yang aman (`https`), Anda perlu menjalankan proyek ini melalui server lokal.
    - Jika Anda menggunakan Visual Studio Code, Anda bisa menggunakan ekstensi seperti **Live Server**. Klik kanan pada file `index.html` dan pilih "Open with Live Server".
    - Buka alamat server (biasanya seperti `http://127.0.0.1:5500/`) di browser pada komputer Anda.

4.  **Akses di Perangkat Mobile**:
    - Untuk mengakses dari HP, pastikan HP dan komputer Anda terhubung ke jaringan WiFi yang sama.
    - Buka browser di HP dan akses alamat IP lokal komputer Anda diikuti dengan port dari Live Server (misal: `http://192.168.1.5:5500`).
    - Arahkan kamera HP ke gambar marker fisik. Model 3D angklung akan muncul di atas marker tersebut.

## Catatan Penting

- **HTTPS**: Akses kamera untuk WebAR hanya diizinkan pada konteks yang aman (HTTPS atau localhost). Ekstensi Live Server biasanya sudah menangani ini.
- **Kualitas Marker**: Gunakan gambar marker yang memiliki kontras tinggi, banyak detail, dan tidak simetris untuk hasil deteksi yang lebih baik.
- **Performa**: Ukuran model 3D dan kompleksitasnya akan mempengaruhi performa. Usahakan untuk mengoptimalkan model Anda untuk web.
