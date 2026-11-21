# BEN AFFILIATE ROBOT
Google Sheets + Google Apps Script untuk antrean promosi affiliate.

## Otomatis
- Membaca produk berstatus READY.
- Menerbitkan artikel Blogger.
- Mengirim promosi ke Telegram.
- Opsional mengirim teks ke Facebook Page dengan Meta Page Access Token.
- Mencatat status dan log; satu produk diproses per hari.

## Batas
- Produk dan link affiliate dimasukkan manual dari Shopee Affiliate. Script tidak scraping Shopee atau mengambil komisi otomatis.
- Tidak membuat klik/pesanan palsu dan tidak menjamin penjualan.
- Harga, stok, foto, dan klaim produk harus diperiksa sebelum status READY.

## Instalasi
1. Buat Google Sheet kosong > Extensions > Apps Script.
2. Ganti Code.gs dengan file Code.gs dari paket ini.
3. Project Settings > Script Properties, isi:
   - BLOGGER_BLOG_URL = https://benogokilcuan.blogspot.com/
   - TELEGRAM_BOT_TOKEN = token bot dari BotFather
   - TELEGRAM_CHAT_ID = ID channel/grup (bot harus admin dan boleh posting)
   - Opsional FACEBOOK_PAGE_ID, FACEBOOK_PAGE_ACCESS_TOKEN, META_GRAPH_VERSION
4. Aktifkan Blogger API v3 pada Google Cloud project Apps Script; akun Google harus punya akses tulis ke Blogger.
5. Jalankan setupBenAffiliate sekali, setujui izin Google.
6. Cek baris contoh produk #001, lalu ubah Status dari DRAFT ke READY.
7. Menu BEN AFFILIATE > Uji posting sekarang. Pastikan hasil di Blogger/Telegram benar.
8. Jika uji berhasil, pilih Aktifkan jadwal harian (sekitar 09.00 Asia/Jakarta).

## Keamanan
Simpan token hanya di Script Properties. Jangan masukkan token, password, atau OTP ke ChatGPT, sheet, GitHub Pages, atau source code. Gunakan token berizin minimum dan cabut jika bocor.
