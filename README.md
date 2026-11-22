# BEN AI Shopee Affiliate — Paket Instalasi

## Isi paket
- `Code.gs`: backend Google Apps Script untuk membuat database, draft konten, Telegram, Blogger, dashboard, dan log.
- `Dashboard.html`: tampilan dashboard web sederhana.
- `Panduan-Instalasi.pdf` tidak disertakan; seluruh langkah ada di dokumen ini.

## Batasan penting
1. Paket ini **belum terhubung langsung ke akun Shopee**. Masukkan URL affiliate yang dibuat melalui fitur resmi Shopee Affiliate. Masukkan laporan klik/komisi secara manual dari laporan resmi Shopee.
2. Tidak ada klaim bahwa aplikasi dapat menjamin penjualan atau komisi.
3. Konten dibuat dari template berdasarkan data produk, bukan generasi AI cloud otomatis.
4. Telegram hanya mengirim baris berstatus `Disetujui`.
5. Blogger memerlukan otorisasi Google dan Blogger API. Posting Blogger yang disetujui akan diterbitkan sebagai posting live.
6. Jangan masukkan password Shopee, OTP, cookie, atau token ke chat. Simpan token hanya di sheet Pengaturan dan batasi akses spreadsheet.

## A. Membuat Google Sheets
1. Buka https://sheets.google.com lalu buat spreadsheet kosong bernama `BEN AI Shopee Affiliate`.
2. Pilih Ekstensi → Apps Script.
3. Hapus kode awal, salin seluruh isi `Code.gs` ke editor.
4. Tambahkan file HTML: klik `+` → HTML, beri nama `Dashboard`, lalu salin isi `Dashboard.html`.
5. Simpan proyek. Kembali ke spreadsheet dan refresh.
6. Pilih menu `BEN AI` → `1. Siapkan Database`. Berikan izin Google saat diminta.
7. Isi sheet `Produk`. Kolom wajib minimal: Nama Produk, URL Affiliate Resmi. Tambahkan harga/keunggulan/target pembeli yang benar-benar terverifikasi.

## B. Telegram
1. Buat bot melalui akun resmi `@BotFather` di Telegram.
2. Tambahkan bot sebagai admin pada channel/grup tujuan, dengan izin mengirim pesan.
3. Isi `TELEGRAM_BOT_TOKEN` dan `TELEGRAM_CHAT_ID` pada sheet `Pengaturan`.
4. Uji dahulu pada channel privat.
5. Di sheet `Konten`, periksa draft Telegram. Ubah status menjadi `Disetujui` hanya setelah memeriksa link, harga, dan klaim.
6. Pilih menu `BEN AI` → `3. Kirim Konten Disetujui ke Telegram`.

## C. Blogger
1. Buka https://console.cloud.google.com/ dan buat/pilih proyek Google Cloud.
2. Aktifkan **Blogger API v3** untuk proyek tersebut.
3. Di editor Apps Script: Services / Layanan → `+` → tambahkan `Blogger API` (Advanced Google Service).
4. Jika diminta, aktifkan Blogger API v3 juga di Google Cloud project yang terkait dengan Apps Script.
5. Ambil Blog ID dari Blogger API / pengaturan blog; masukkan ke `BLOGGER_BLOG_ID`.
6. Di sheet `Konten`, periksa draft Blogger dan ubah status menjadi `Disetujui`.
7. Pilih menu `BEN AI` → `4. Terbitkan Konten Disetujui ke Blogger`.
8. Otorisasi akun Google yang memiliki akses editor/admin pada blog.

## D. Operasional
1. Masukkan produk dan link affiliate resmi pada sheet `Produk`.
2. Pilih `Buat Konten dari Produk`.
3. Periksa seluruh draft pada sheet `Konten`. Jangan publikasikan klaim kesehatan, hasil, diskon, stok, atau harga yang tidak terbukti.
4. Setujui konten per platform dengan mengubah status menjadi `Disetujui`.
5. Jalankan pengiriman Telegram atau publikasi Blogger.
6. Impor/masukkan laporan komisi dan klik resmi ke sheet `Komisi` dan `Klik`.
7. Perbarui dashboard melalui menu BEN AI.

## E. Catatan penggunaan Android
Untuk setup awal, buka Google Sheets di Chrome. Jika menu Ekstensi tidak muncul, aktifkan `Situs desktop` pada menu Chrome. Pengeditan Apps Script lebih mudah dilakukan dari komputer/tablet.
