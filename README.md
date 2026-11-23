# BEN AI Shopee Affiliate

Aplikasi web progresif (PWA) untuk mengelola katalog produk affiliate, menghitung estimasi komisi, membuat draft konten promosi, menyimpan link affiliate, dan mencatat performa secara manual.

## Deploy online
1. Buka Settings → Pages pada repository ini.
2. Pada Build and deployment, pilih **GitHub Actions** sebagai Source.
3. Pastikan workflow `.github/workflows/pages.yml` aktif.
4. Buka tab Actions dan tunggu workflow **Deploy BEN AI Affiliate to GitHub Pages** selesai dengan status hijau.
5. Buka https://3pitribahgiajaya.github.io/affiliate-bot/

Workflow akan mencoba deploy otomatis setiap ada commit ke branch `main`. Deploy pertama membutuhkan Pages Source = GitHub Actions.

## Pasang di Android
1. Buka URL aplikasi di Chrome Android.
2. Tekan menu ⋮ → **Tambahkan ke layar utama** atau **Install app** jika tersedia.
3. Data katalog tersimpan di browser perangkat. Gunakan menu Cadangan JSON secara berkala.

## Fitur yang tersedia
- Dashboard jumlah produk, tautan, konten, dan estimasi komisi.
- Katalog produk dengan kategori, harga, rate komisi, estimasi unit, link produk, link affiliate, dan catatan.
- Skor peluang indikatif berbasis data yang dimasukkan pengguna.
- Generator draft caption promosi, hook, CTA, dan hashtag.
- Link manager dan salin tautan affiliate.
- Pencatatan manual klik, pesanan, dan komisi aktual.
- Ekspor katalog CSV dan backup/pulihkan JSON.
- PWA manifest dan cache offline setelah aplikasi pertama kali dibuka.

## Batasan integrasi
- Aplikasi ini **belum terhubung** ke akun, API, katalog, komisi, atau laporan Shopee secara langsung.
- Generator konten saat ini menggunakan template lokal, bukan model AI online.
- Tidak melakukan login, scraping, auto-checkout, atau auto-posting.
- Koneksi resmi membutuhkan dokumentasi, persetujuan, kredensial/API yang memang diberikan Shopee, dan backend aman. Jangan menaruh password, OTP, cookie, atau secret di file frontend.
- Data tersimpan lokal pada browser/perangkat; belum ada sinkronisasi multi-perangkat atau akun pengguna.
- Nilai komisi merupakan estimasi berdasarkan input dan bukan jaminan pendapatan.

BEN AI merupakan proyek independen dan tidak berafiliasi resmi dengan Shopee.
