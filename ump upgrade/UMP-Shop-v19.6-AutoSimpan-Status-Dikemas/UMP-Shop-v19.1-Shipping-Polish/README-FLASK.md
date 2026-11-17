# UMP Shop berbasis Python Flask

Desain dan halaman HTML/CSS/JS asli dipertahankan pada `static/site/`. Flask menjalankan website melalui server lokal dan menyediakan endpoint sesi/login/logout.

## Jalankan di Windows
1. Pastikan Python 3.10+ terpasang.
2. Klik dua kali `JALANKAN-UMP-SHOP.bat`, atau jalankan di terminal:
   ```
   py -m pip install -r requirements.txt
   py app.py
   ```
3. Buka http://127.0.0.1:5000

## Akun demo
- Admin: `admin` / `admin123`
- Customer: `customer` / `customer123`

## Status penting
- Website asli dan fiturnya tetap tersedia; animasi yang sudah ada di frontend dipertahankan.
- Flask menyediakan autentikasi sesi server melalui `/api/login`, `/api/logout`, dan `/api/session`.
- Login HTML lama masih memakai validasi `localStorage` di browser agar alur demo lama tidak rusak; untuk memakai autentikasi Flask sepenuhnya, form login/register dan guard halaman harus disambungkan ke endpoint Flask.
- Produk, keranjang, stok, dan riwayat chat versi asli masih disimpan dalam `localStorage`, jadi belum tersinkron antarbrowser/perangkat. Endpoint hapus pesan saat ini adalah fondasi API, belum menghapus pesan dari database karena chat belum dimigrasikan.
- Sebelum dipasang online, ganti `UMP_SECRET_KEY`, ubah akun demo, gunakan HTTPS, dan pindahkan data bisnis dari `localStorage` ke database server.

## v21.3 Owner Real-Time
Dashboard Owner sekarang memakai state bersama di SQLite melalui `/api/state`. Admin, Customer, Grosir, dan Owner melakukan sinkronisasi otomatis sekitar setiap 1,5 detik selama aplikasi dijalankan melalui Flask. Untuk sinkronisasi antar perangkat, buka aplikasi dari server/host yang sama (bukan membuka file HTML langsung).
