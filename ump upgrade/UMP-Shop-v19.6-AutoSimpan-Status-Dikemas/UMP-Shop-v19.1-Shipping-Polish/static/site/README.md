# UMP Shop V18.1

Prototype frontend UMP Shop dengan pemisahan akses Admin dan Customer.

## Login demo
- Admin: `admin` / `admin123`
- Customer: `customer` / `customer123`
- Customer baru dapat membuat akun melalui halaman Daftar Customer.

## Fitur Customer
- Marketplace produk bergambar, pencarian dan kategori
- Register/login customer terpisah
- Profil customer dan alamat utama
- Wishlist/favorit
- Keranjang dan checkout
- Voucher demo `UMP10`
- Pengiriman Reguler / Express / Ambil di Toko
- QRIS / Transfer / Tunai
- Riwayat pesanan dan status order
- Invoice yang dapat dicetak

## Fitur Admin
- Dashboard, transaksi jual/beli, produk/stok
- Data karyawan dan absensi
- Pesanan online customer
- Update status: Pesanan Dibuat, Diproses, Dikemas, Dikirim, Selesai, Dibatalkan
- Laporan dan export CSV

## Menjalankan
Buka folder di VS Code, lalu jalankan `index.html` dengan Live Server.

> Catatan: V7 masih prototype frontend dan menggunakan localStorage. Untuk produksi, autentikasi, database, pembayaran, stok, dan otorisasi perlu dipindahkan ke backend/server (mis. PHP + MySQL).


V8: Menambahkan slider iklan otomatis pada halaman marketplace customer (3 slide, navigasi panah/dot, pause saat hover).

V9: Customer marketplace redesign — header/search ala marketplace, menu navigasi, banner slider lebar, kategori kotak, grid produk padat, wishlist/cart/order/profile tetap aktif. Admin tidak diubah.

V10: Halaman Register Customer didesain ulang profesional: split-screen automotive, form lengkap, email, konfirmasi password, indikator kekuatan password, validasi akun, responsive mobile.

V10.1 FIX: Memperbaiki halaman customer yang tidak jalan setelah redesign marketplace dan menambahkan data produk awal agar toko dapat dibuka sebelum dashboard admin.

V11: Header customer diperbarui bergaya marketplace: dropdown Akun, Profil/Pesanan/Favorit, badge Favorit dan Keranjang, serta Logout dengan konfirmasi. Responsive mobile.

V12: Pembayaran customer ditingkatkan dengan QRIS demo bergambar, Transfer Bank, DANA, dan Tunai. Detail rekening/DANA dapat diatur Admin. Admin memiliki halaman Pembayaran Masuk untuk verifikasi dan saldo pembayaran terkonfirmasi. CATATAN: karena versi ini masih frontend/localStorage, QRIS dan perpindahan dana adalah simulasi. Dana nyata memerlukan backend + payment gateway/merchant QRIS.

V13: Pesanan Customer diaktifkan sebagai Pesanan & Riwayat lengkap: filter status, progress pesanan, ringkasan, detail order, status pembayaran, pengiriman, dan invoice. Checkout langsung menuju riwayat pesanan.

V14: Admin dapat menambah stok produk yang sudah ada melalui Produk & Stok > + Tambah Stok. Setiap restock mencatat jumlah, stok sebelum/sesudah, catatan, dan waktu ke Riwayat Stok Masuk. Karena data produk memakai storage yang sama, stok baru langsung tampil di marketplace Customer.

V14.1 FIX PESANAN: memperbaiki tombol Buat Pesanan pada checkout (konflik global id/name), menyimpan order secara aman dengan customerId/username, sinkron stok dan transaksi, memperbarui profil kontak, serta memastikan Pesanan & Riwayat dapat menemukan order lama berdasarkan ID/nomor HP/username.


## Pemeriksaan perbaikan V18.1
- Form login menggunakan referensi elemen form secara eksplisit agar tidak bergantung pada perilaku variabel global browser.
- File JavaScript utama dan skrip inline diperiksa dengan `node --check`.
- Catatan penting: ini masih prototype berbasis `localStorage`; data hanya tersimpan di browser/perangkat yang sama dan belum aman untuk penggunaan produksi.
