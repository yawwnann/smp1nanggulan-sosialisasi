# Sistem Absensi - Form ke Telegram

Sistem absensi sederhana menggunakan HTML, CSS, dan JavaScript yang mengirim data ke Telegram Bot.

## 📋 Fitur

- Form absensi dengan field: Nama, Jenis Kelamin, Umur, Kelas, Nomor HP
- **📸 Kamera Depan:** Ambil foto selfie untuk verifikasi kehadiran
- **📍 Geolocation:** Deteksi lokasi otomatis saat mengisi form
- **📱 Device Detection:** Identifikasi perangkat yang digunakan (Android, iPhone, Windows, dll)
- **🌐 Browser Detection:** Identifikasi browser yang digunakan
- Desain modern dan menarik dengan gradient dan animasi
- Responsive design (mobile-friendly)
- Validasi input form
- Kirim data + foto + lokasi otomatis ke Telegram
- Loading indicator saat mengirim data
- Pesan sukses/error yang informatif

## 🚀 Cara Setup

### 1. Buat Telegram Bot

1. Buka Telegram dan cari **@BotFather**
2. Kirim perintah `/newbot`
3. Ikuti instruksi untuk memberi nama bot
4. Simpan **Bot Token** yang diberikan (contoh: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Dapatkan Chat ID

**Opsi A - Menggunakan Bot Lain:**

1. Cari **@userinfobot** di Telegram
2. Klik Start atau kirim pesan apapun
3. Bot akan memberikan ID Anda

**Opsi B - Menggunakan API:**

1. Kirim pesan ke bot yang Anda buat
2. Buka browser dan akses:
   ```
   https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
   ```
   Ganti `<BOT_TOKEN>` dengan token bot Anda
3. Cari bagian `"chat":{"id":123456789}`
4. Angka tersebut adalah Chat ID Anda

### 3. Konfigurasi Script

1. Buka file `script.js`
2. Ganti baris berikut dengan data Anda:

```javascript
const TELEGRAM_BOT_TOKEN = "123456789:ABCdefGHIjklMNOpqrsTUVwxyz";
const TELEGRAM_CHAT_ID = "123456789";
```

### 4. Jalankan Aplikasi

1. Buka file `index.html` di browser
2. **Izinkan akses kamera dan lokasi** saat diminta oleh browser
3. Klik "Aktifkan Kamera" untuk membuka kamera depan
4. Klik "Ambil Foto" untuk capture selfie
5. Isi form absensi dengan lengkap
6. Klik "Kirim Absensi"
7. Cek Telegram - data, foto, dan lokasi akan terkirim ke bot Anda!

## 📸 Cara Menggunakan Fitur Kamera & Lokasi

### Kamera:

1. Klik tombol **"🔷 Aktifkan Kamera"**
2. Browser akan minta izin akses kamera - **Klik "Izinkan/Allow"**
3. Kamera depan akan aktif, posisikan wajah Anda
4. Klik **"📸 Ambil Foto"** untuk capture
5. Jika tidak puas, klik **"🔄 Foto Ulang"**
6. Tombol "Kirim Absensi" akan aktif setelah foto diambil

### Lokasi:

- Otomatis terdeteksi saat halaman dibuka
- Browser akan minta izin akses lokasi - **Klik "Izinkan/Allow"**
- Koordinat GPS akan ditampilkan di form
- Link lokasi bisa diklik untuk membuka Google Maps

### Perangkat & Browser:

- Otomatis terdeteksi tanpa perlu aksi apapun
- Menampilkan info OS/Device dan nama browser

## 📱 Tampilan

- **Desktop**: Form dengan lebar maksimal 500px di tengah layar
- **Mobile**: Form responsive menyesuaikan lebar layar
- **Animasi**: Smooth transitions dan loading indicators

## 🎨 Kustomisasi

### Mengubah Warna

Edit file `style.css` bagian gradient:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Ganti kode warna sesuai selera Anda.

### Menambah Field Form

1. Tambahkan HTML di `index.html`:

```html
<div class="form-group">
  <label for="fieldBaru">Label Field</label>
  <input type="text" id="fieldBaru" name="fieldBaru" required />
</div>
```

2. Tambahkan di `script.js` bagian `formData`:

```javascript
const formData = {
  // ... field lainnya
  fieldBaru: document.getElementById("fieldBaru").value,
};
```

3. Tambahkan di format pesan:

```javascript
const message = `
    // ... data lainnya
    🆕 *Field Baru:* ${data.fieldBaru}
`;
```

## ⚠️ Catatan Penting

- **Keamanan**: Jangan share Bot Token Anda ke orang lain!
- **HTTPS**: Kamera dan lokasi hanya bisa diakses via HTTPS atau localhost
- **Izin Browser**: Pastikan memberikan izin akses kamera dan lokasi
- **Browser**: Gunakan browser modern (Chrome, Firefox, Edge, Safari)
- **Internet**: Diperlukan koneksi internet untuk mengirim ke Telegram
- **Privacy**: Data lokasi dan foto hanya dikirim ke Telegram bot Anda

## 🐛 Troubleshooting

### "Konfigurasi Telegram belum diatur"

- Pastikan sudah mengisi `TELEGRAM_BOT_TOKEN` dan `TELEGRAM_CHAT_ID` di `script.js`

### Kamera tidak bisa diakses

- Pastikan memberikan izin akses kamera saat browser meminta
- Cek apakah browser mendukung getUserMedia API
- Pastikan tidak ada aplikasi lain yang sedang menggunakan kamera
- Gunakan HTTPS atau localhost (kamera tidak bisa diakses via HTTP biasa)

### Lokasi tidak terdeteksi

- Pastikan memberikan izin akses lokasi saat browser meminta
- Cek setting lokasi di browser dan sistem operasi
- Pastikan GPS aktif (untuk mobile device)
- Gunakan HTTPS atau localhost

### Data tidak terkirim

- Cek koneksi internet
- Pastikan Bot Token dan Chat ID benar
- Kirim pesan ke bot terlebih dahulu (klik Start)

### Form tidak responsive

- Clear cache browser
- Pastikan meta viewport ada di `<head>`

## 📄 Lisensi

Free to use - silakan modifikasi sesuai kebutuhan!

## 💡 Tips

- Untuk grup Telegram, gunakan Chat ID grup (awalan negatif, contoh: `-123456789`)
- Test di localhost dulu sebelum deploy ke server
- Untuk deployment online, pastikan menggunakan HTTPS (kamera & lokasi tidak berfungsi di HTTP)
- Foto akan dikirim dalam format JPEG dengan kualitas 80% (optimal untuk ukuran file)
- Koordinat lokasi bisa diklik untuk membuka Google Maps
- Bisa menambahkan foto profil bot lewat @BotFather
- Gunakan format Markdown di pesan Telegram: `*bold*`, `_italic_`, `` `code` ``
- Untuk testing, gunakan Chrome DevTools untuk simulate device dan lokasi

## 🌐 Deploy ke Server

Jika ingin deploy online, pastikan:

1. **Gunakan HTTPS** (wajib untuk kamera & geolocation)
2. Layanan hosting gratis dengan HTTPS:
   - GitHub Pages (perlu enable HTTPS)
   - Netlify
   - Vercel
   - Firebase Hosting

### Contoh Deploy ke Netlify:

1. Drag & drop folder project ke netlify.com
2. File otomatis online dengan HTTPS
3. Test langsung di URL yang diberikan

---

Dibuat dengan ❤️ untuk kemudahan absensi digital
