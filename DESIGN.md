# DESIGN.md: Platform Diskusi dan Forum Pembelajaran

Dokumen ini mengatur tampilan dan nuansa. Cara membangun proyek ada di `AGENTS.md`. Baca file ini sebelum membuat atau mengubah tampilan apa pun.

Anti-slop adalah filter yang membuang pola generik. Arah visual datang dari file ini. Kalau hasil terasa hambar, tambahkan keputusan desain di sini, jangan menambah dekorasi.

---

## 1. Arah Visual

**Gagasan:** ruang baca bersama yang tenang. Kertas hangat, tinta hijau tua, dan sentuhan pasir serta lumut. Terasa seperti perpustakaan dengan jendela ke taman, bukan dashboard teknologi.

**Warna berasal dari palet ini:** https://colorhunt.co/palette/d9d28bb2bd7e8e91626a795d

| Nama | Hex | Peran identitas |
|---|---|---|
| Pasir | `#D9D28B` | Sorotan, penanda ruang kelas, tombol utama di mode gelap |
| Lumut Muda | `#B2BD7E` | Penanda diskusi global, tautan di mode gelap |
| Zaitun | `#8E9162` | Garis input, ikon, elemen dekoratif tipis |
| Sage | `#6A795D` | Garis tegas, ikon, teks besar |

Warna lain di dokumen ini adalah turunan netral dari warna di atas (kertas, tinta, dan warna status). Turunan dibuat supaya teks lolos kontras, bukan untuk menambah identitas baru.

**Nuansa:**
- Kepadatan sedang. Daftar thread dan materi rapat, halaman thread dan materi lega.
- Datar. Pemisah memakai garis tipis, bukan bayangan.
- Satu momen yang hidup: kartu profil dengan bingkai dan efek beranimasi. Sisanya tenang.

**Dial anti-slop** (cocokkan skalanya dengan GUIDE.md anti-slop sebelum dipakai):
- ENERGY: rendah sampai sedang.
- RHYTHM: tenang dan teratur, satu ritme ruang yang konsisten di semua halaman.
- MOTION: hemat. Gerak hanya untuk menunjukkan perubahan keadaan, kecuali efek profil.

---

## 2. Warna

### 2.1 Token

Mode terang adalah mode utama. Mode gelap mengikuti `prefers-color-scheme` dan bisa diganti manual.

| Token | Terang | Gelap |
|---|---|---|
| `canvas` (latar halaman) | `#F5F3E3` | `#151912` |
| `surface` (kartu, panel) | `#FBFAF1` | `#1D221A` |
| `sunken` (input, blok kode, hover) | `#EAE7CE` | `#262C22` |
| `border-subtle` | `#DAD7BC` | `#333A2D` |
| `border-strong` (batas input, kontrol) | `#8E9162` (Zaitun) | `#6A795D` (Sage) |
| `text-primary` | `#232A1C` | `#EFEEDC` |
| `text-secondary` | `#56634A` | `#AEB394` |
| `action` (tombol utama) | `#56634A` | `#D9D28B` (Pasir) |
| `on-action` (teks di tombol utama) | `#FFFFFF` | `#1A1F14` |
| `link` | `#56634A` | `#B2BD7E` |
| `tag-class` (penanda ruang kelas) | `#D9D28B` | `#D9D28B` |
| `tag-global` (penanda diskusi global) | `#B2BD7E` | `#B2BD7E` |
| `on-tag` (teks di atas penanda) | `#232A1C` | `#1A1F14` |
| `focus-ring` | `#56634A` | `#D9D28B` |
| `danger` | `#A33B2C` | `#E8806F` |
| `warning` | `#8A5A00` | `#E0B455` |
| `success` | `#56634A` | `#B2BD7E` |

### 2.2 Kontras

Dihitung dengan rumus kontras WCAG. Hitung ulang dengan alat pemeriksa kontras saat implementasi.

| Pasangan | Rasio | Hasil |
|---|---|---|
| `text-primary` di `canvas` (terang) | sekitar 13:1 | Lolos AA dan AAA |
| `text-secondary` di `canvas` (terang) | sekitar 5,7:1 | Lolos AA |
| Putih di `action` (terang) | sekitar 6,4:1 | Lolos AA |
| Tinta di Pasir | sekitar 9,5:1 | Lolos AA dan AAA |
| Tinta di Lumut Muda | sekitar 7,4:1 | Lolos AA dan AAA |
| Zaitun `#8E9162` di `surface` (terang) | sekitar 3,1:1 | Lolos untuk batas kontrol (3:1), **gagal untuk teks** |
| `text-primary` di `canvas` (gelap) | sekitar 15:1 | Lolos AA dan AAA |
| `text-secondary` di `canvas` (gelap) | sekitar 8:1 | Lolos AA dan AAA |
| Teks gelap di Pasir (gelap) | sekitar 10,8:1 | Lolos AA dan AAA |
| Sage `#6A795D` di `surface` (gelap) | sekitar 3,5:1 | Lolos untuk batas kontrol, **gagal untuk teks kecil** |
| `danger` terang di `canvas` | sekitar 5,9:1 | Lolos AA |

**Aturan pakai:**
- Zaitun dan Sage mentah **tidak boleh** dipakai untuk teks kecil di mode terang. Pakai `text-secondary`.
- Status tidak boleh hanya dibedakan lewat warna. Selalu sertakan ikon dan teks.
- Tidak ada gradien warna, tidak ada teks bergradien.

### 2.3 CSS dan pemetaan shadcn/ui

Letakkan di `app/globals.css`. Sesuaikan sintaks dengan versi Tailwind yang terpasang (v4 memakai `@theme`, v3 memakai `tailwind.config`).

```css
:root {
  --canvas: #F5F3E3;
  --surface: #FBFAF1;
  --sunken: #EAE7CE;
  --border-subtle: #DAD7BC;
  --border-strong: #8E9162;
  --text-primary: #232A1C;
  --text-secondary: #56634A;
  --action: #56634A;
  --on-action: #FFFFFF;
  --link: #56634A;
  --tag-class: #D9D28B;
  --tag-global: #B2BD7E;
  --on-tag: #232A1C;
  --focus-ring: #56634A;
  --danger: #A33B2C;
  --warning: #8A5A00;
  --success: #56634A;
}

.dark {
  --canvas: #151912;
  --surface: #1D221A;
  --sunken: #262C22;
  --border-subtle: #333A2D;
  --border-strong: #6A795D;
  --text-primary: #EFEEDC;
  --text-secondary: #AEB394;
  --action: #D9D28B;
  --on-action: #1A1F14;
  --link: #B2BD7E;
  --tag-class: #D9D28B;
  --tag-global: #B2BD7E;
  --on-tag: #1A1F14;
  --focus-ring: #D9D28B;
  --danger: #E8806F;
  --warning: #E0B455;
  --success: #B2BD7E;
}
```

Pemetaan ke variabel shadcn/ui:

| shadcn | Token |
|---|---|
| `--background` | `canvas` |
| `--foreground` | `text-primary` |
| `--card`, `--popover` | `surface` |
| `--primary` / `--primary-foreground` | `action` / `on-action` |
| `--secondary`, `--muted`, `--accent` | `sunken` |
| `--muted-foreground` | `text-secondary` |
| `--border` | `border-subtle` |
| `--input` | `border-strong` |
| `--ring` | `focus-ring` |
| `--destructive` | `danger` |

---

## 3. Tipografi

Muat font lewat `next/font/google` supaya tampil sama di semua perangkat. Verifikasi nama font tersedia di `next/font/google`. Kalau tidak, pakai fallback.

| Peran | Font | Fallback |
|---|---|---|
| Judul besar (H1, H2, nama kelas) | Newsreader | `Georgia, serif` |
| Teks dan antarmuka | Figtree | `system-ui, sans-serif` |
| Kode dan waktu | JetBrains Mono | `ui-monospace, monospace` |

Semua pilihan mendukung huruf Latin yang dipakai Bahasa Indonesia.

| Pemakaian | Font | Ukuran / tinggi baris | Bobot |
|---|---|---|---|
| Display (header kelas, beranda) | Newsreader | 36px / 1,15 | 600 |
| H1 (judul thread dan materi) | Newsreader | 28px / 1,2 | 600 |
| H2 | Newsreader | 22px / 1,3 | 600 |
| H3 | Figtree | 18px / 1,4 | 600 |
| Isi thread, komentar, materi | Figtree | 16px / 1,65 | 400 |
| Label, tombol, navigasi | Figtree | 14px / 1,4 | 500 |
| Metadata, keterangan | Figtree | 13px / 1,5 | 400 |
| Kode, waktu absolut | JetBrains Mono | 13px / 1,6 | 400 |

**Aturan:**
- Lebar baca isi thread dan materi maksimal **680px** (sekitar 70 karakter per baris).
- Materi berbentuk artikel panjang boleh memakai Newsreader 18px / 1,7 sebagai mode baca.
- Tidak ada teks huruf kapital semua untuk badan teks. Label kecil boleh dengan jarak huruf 0,04em.

---

## 4. Layout dan Spasi

**Spasi:** skala kelipatan 4px, dengan 8px sebagai ritme utama.

| Token | Nilai |
|---|---|
| `1` | 4px |
| `2` | 8px |
| `3` | 12px |
| `4` | 16px |
| `6` | 24px |
| `8` | 32px |
| `12` | 48px |
| `16` | 64px |

**Radius:** 6px untuk tombol dan input, 10px untuk kartu dan panel, bulat penuh hanya untuk avatar dan bingkai avatar.

**Breakpoint:** `< 640px` HP, `640px sampai 1023px` tablet, `>= 1024px` desktop.

**Kerangka aplikasi:**
- **Desktop:** sidebar 264px (daftar kelas, Global, Chat, Materi), konten utama, panel kanan opsional 280px (anggota, aturan kelas).
- **Tablet:** sidebar bisa diciutkan menjadi ikon.
- **HP:** satu kolom, navigasi bawah, sheet dari bawah untuk menu dan aksi. Padding halaman 16px.

**Halaman ruang kelas** punya header dengan nama kelas (Newsreader), kode kelas, dan tab: Diskusi, Materi, Anggota. Warna dasar header memakai `sunken`, tanpa gradien dan tanpa foto stok.

---

## 5. Komponen

Setiap komponen interaktif harus punya state: default, hover, fokus, aktif, nonaktif, loading, dan error bila relevan. Hover dan fokus tidak memakai skala atau bayangan.

### 5.1 Tombol

- Tinggi 36px di desktop, 44px di HP. Padding horizontal 16px, radius 6px, Figtree 14px/500.
- **Utama:** latar `action`, teks `on-action`. Hover: gelapkan sedikit (terang) atau terangkan sedikit (gelap).
- **Sekunder:** latar transparan, garis `border-strong`, teks `text-primary`. Hover: latar `sunken`.
- **Teks:** tanpa garis, teks `link`. Hover: garis bawah.
- **Bahaya:** hanya untuk hapus dan blokir. Latar `danger`, teks putih atau gelap sesuai kontras.
- **Loading:** spinner 16px, label tetap terlihat, tombol tidak bisa diklik dua kali.
- Satu tombol utama per tampilan.

### 5.2 Input dan Textarea

- Latar `sunken` atau `surface`, garis 1px `border-strong`, radius 6px, padding 8px 12px.
- Fokus: cincin `focus-ring` 2px dengan jarak 2px.
- Error: garis `danger` dan **pesan teks** di bawah input beserta ikon. Warna saja tidak cukup.
- Label selalu terlihat di atas input. Placeholder bukan pengganti label.
- Textarea balasan: tinggi minimal 96px, tumbuh sampai 320px.

### 5.3 Penanda ruang (Kelas dan Global)

Ini pembeda utama platform dan harus terbaca sekilas.

| Ruang | Penanda |
|---|---|
| Ruang kelas | Pil latar `tag-class` (Pasir), ikon buku, teks nama kelas, misalnya "Kelas 10A" |
| Diskusi global | Pil latar `tag-global` (Lumut Muda), ikon globe, teks "Global" |

Pil: padding 4px 8px, radius 4px, Figtree 13px/500, teks `on-tag`. Di kartu thread, tambahkan garis vertikal 3px di tepi kiri kartu dengan warna yang sama. Ikon dan teks tetap ada supaya tidak bergantung pada warna.

### 5.4 Kartu Thread

- Latar `surface`, garis 1px `border-subtle`, radius 10px, padding 16px. Tanpa bayangan.
- Baris atas: penanda ruang, judul (H3), tanda sematan bila disematkan guru.
- Baris tengah: cuplikan isi maksimal 2 baris.
- Baris bawah: avatar kecil 24px (tanpa efek animasi), nama, waktu relatif, jumlah komentar, status "Terjawab" bila ada.
- Hover: garis berubah ke `border-strong`. Tidak ada gerakan.
- Hanya data nyata. Tidak ada jumlah dummy.

### 5.5 Komentar bertingkat

- Maksimal 4 tingkat tampilan (komentar utama, ditambah 3 tingkat balasan).
- Indentasi 20px per tingkat di desktop, 12px di HP. Garis vertikal 1px `border-subtle` sebagai pemandu.
- Setelah tingkat 4, balasan baru tetap di tingkat 4 dengan keterangan "membalas @nama".
- Tiap komentar: avatar 32px, nama, label peran bila relevan (Pengajar, Asisten, Moderator), waktu, penanda "diedit".
- Aksi: Balas, Laporkan, dan untuk milik sendiri Edit dan Hapus. Aksi berupa tombol teks dengan label, bukan hanya ikon.
- Komentar yang disembunyikan moderator tampil sebagai baris singkat "Komentar disembunyikan oleh moderator" tanpa isi.
- Muat bertahap. Tombol "Tampilkan balasan lain" untuk percabangan panjang.

### 5.6 Materi belajar

- **Kartu materi:** ikon jenis (slide, video, artikel, soal, dokumen, gambar, tautan), judul, deskripsi 2 baris, nama pengunggah, tanggal, penanda ruang.
- **Dropzone unggah:** area garis putus-putus `border-strong`, teks petunjuk dan batas format jelas ("JPG, PNG, WebP atau PDF, maksimal 10 MB"). State: kosong, file dipilih, mengunggah (batang progres dengan persen nyata), berhasil, gagal (alasan spesifik).
- **Pratinjau:** gambar dengan `next/image`, PDF dalam panel yang bisa di-scroll, tombol Unduh.
- **Materi resmi:** label "Materi resmi" dari pengajar, dengan ikon dan teks.

### 5.7 Moderasi

- **Antrean laporan:** tabel di desktop, kartu bertumpuk di HP. Kolom: konten yang dilaporkan, alasan, pelapor, waktu, status.
- **Aksi:** Abaikan, Sembunyikan, Hapus, Beri peringatan, Blokir sementara. Aksi yang merusak butuh dialog konfirmasi dengan kolom alasan wajib.
- **Log tindakan:** daftar kronologis (siapa, apa, kapan, alasan). Hanya dibaca, tidak bisa diubah.
- **Pelaporan oleh pengguna:** dialog dengan pilihan alasan (spam, SARA, tidak pantas, pelanggaran lain) dan kolom keterangan opsional.

### 5.8 Chat pribadi

- Gelembung pesan: radius 10px, pesan sendiri latar `action` dengan teks `on-action`, pesan lawan latar `sunken`. Lebar maksimal 75%.
- Foto dalam pesan: lebar maksimal 320px, rasio asli, klik untuk memperbesar, muat tertunda.
- Indikator mengetik dan status online memakai teks, bukan hanya titik warna.
- Waktu dikelompokkan per hari.

### 5.9 Notifikasi

- Toast: panel `surface` dengan garis kiri 3px sesuai status dan ikon. Hilang otomatis setelah 5 detik, tetapi bisa ditutup dan tidak hilang saat difokuskan.
- Wilayah `aria-live="polite"`. Galat penting memakai `role="alert"`.

### 5.10 Keadaan kosong

Teks singkat, jujur, dan memberi langkah: "Belum ada diskusi di kelas ini. Mulai dengan satu pertanyaan." Boleh disertai ikon sederhana. Tidak ada kartu palsu dan tidak ada kerangka loading yang menyamar sebagai konten.

---

## 6. Profil dan Personalisasi

Berlapis dari belakang ke depan: **banner, efek profil, avatar, bingkai avatar, info profil.**

**Banner:** rasio sekitar 3:1, tinggi 160px di desktop dan 112px di HP. Bila belum ada banner, pakai warna dasar pilihan pengguna dari palet (Pasir, Lumut Muda, Zaitun, Sage), bukan gambar stok.

**Avatar:** bulat. 80px di kartu profil, 40px di daftar, 32px di komentar, 24px di kartu thread. Menimpa banner dengan offset sekitar -40px dan garis tepi 4px berwarna `surface`.

**Bingkai avatar:** lingkaran, lebih besar sekitar 16px dari avatar (avatar 80px, bingkai 96px). Berupa katalog dari sistem, pengguna hanya memilih. Jenis: statis (SVG atau PNG transparan), animasi ringan (SVG berputar), animasi kompleks (Lottie, tahap lanjutan).

**Efek profil:** lapisan SVG di belakang kartu profil, dianimasikan dengan GSAP. Efek awal yang dirancang:

| Efek | Isi | Warna |
|---|---|---|
| Bulan dan Cincin | Bulan bercahaya yang berdenyut, cincin tipis yang berputar dengan kecepatan berbeda, garis cahaya halus | Bulan Pasir, cincin Lumut Muda dan Zaitun, di atas latar gelap |
| Polos | Tidak ada efek | Tidak ada |

Bingkai awal: "Polos Pasir" (cincin statis 3px Pasir), "Cincin Lumut" (cincin SVG berputar lambat).

**Aturan performa:**
- Animasi bingkai dan efek hanya berjalan di **kartu profil yang sedang terbuka** dan halaman profil. Di daftar, komentar, dan chat, tampilkan versi statis.
- Maksimal satu efek profil beranimasi aktif di layar pada satu waktu.
- Jeda animasi saat tidak terlihat (`IntersectionObserver`) dan saat tab tidak aktif.
- Hormati `prefers-reduced-motion`: tampilkan versi statis.
- Efek dan bingkai hanya dari katalog. Pengguna tidak mengunggah bingkai sendiri.
- Fase awal semua gratis. Sistem buka-kunci lewat poin atau badge masuk tahap lanjutan.

**Info profil:** nama tampilan, username, bio (maksimal 250 karakter), peran di kelas, forum bersama. Hanya data nyata. Tidak ada metrik atau tanggal bergabung buatan.

---

## 7. Animasi (GSAP)

**Prinsip:** gerak menjelaskan perubahan keadaan, bukan menghias.

| Aksi | Durasi | Easing | Yang dianimasikan |
|---|---|---|---|
| Dialog dan sheet terbuka | 200ms | `power2.out` | `opacity`, `translateY` 8px |
| Toast masuk | 200ms | `power2.out` | `opacity`, `translateY` |
| Daftar thread dimuat pertama kali | 240ms | `power2.out` | `opacity`, `translateY` 6px, hanya untuk 10 item pertama, jeda antar item maksimal 30ms, sekali saja |
| Komentar baru muncul | 200ms | `power2.out` | `opacity` |
| Transisi halaman | 150ms | `power1.inOut` | `opacity` |
| Efek profil (loop) | 6 sampai 20 detik per siklus | `none` | `rotation`, `scale`, `opacity` |

**Aturan:**
- Hanya animasikan `transform` dan `opacity`.
- Transisi antarmuka maksimal 250ms. Pengecualian: loop efek profil di kartu profil.
- Tidak ada skala saat hover, tidak ada kilau, dan tidak ada animasi pada setiap kartu di daftar panjang.
- Gunakan `gsap.matchMedia()` dengan kondisi `(prefers-reduced-motion: reduce)`. Pada kondisi itu lewati animasi dan tampilkan keadaan akhir langsung. GSAP tidak melakukan ini otomatis.
- Dalam React, bungkus dengan `useGSAP` atau `gsap.context()` agar dibersihkan saat komponen dilepas.
- Jangan menjalankan animasi untuk elemen di luar layar.

---

## 8. Aksesibilitas

- Target WCAG 2.2 AA.
- Seluruh fungsi bisa dipakai dengan keyboard. Urutan Tab natural, Enter dan Spasi mengaktifkan tombol, Esc menutup dialog.
- Fokus selalu terlihat: cincin `focus-ring` 2px dengan jarak 2px.
- Dialog menjebak fokus dan mengembalikannya ke pemicu saat ditutup.
- Tautan lompat "Langsung ke konten" muncul saat fokus.
- Target sentuh minimal 44x44px, jarak antar target minimal 8px.
- Hierarki judul teratur (h1, lalu h2, lalu h3). Daftar thread memakai `<ul>`.
- Setiap input punya `<label>`. Tombol ikon punya `aria-label`.
- Komentar bertingkat diumumkan dengan tingkatnya, misalnya "Balasan tingkat 2".
- Teks alternatif avatar: "Avatar [nama tampilan]". Gambar dekoratif memakai `alt=""`.
- Tidak ada informasi yang hanya disampaikan lewat warna.
- Hormati `prefers-reduced-motion` dan `prefers-color-scheme`.

---

## 9. Bahasa dan Nada Tulisan

- Bahasa Indonesia natural, ringkas, dan hangat. Sapaan **"kamu"**, dan "kita" untuk komunitas. Tidak kaku dan tidak berlebihan.
- Label tombol berupa kata kerja yang jelas.
- Pesan galat menyebut apa yang terjadi dan apa langkah berikutnya.

| Situasi | Teks |
|---|---|
| Tombol utama | Buat diskusi |
| Keadaan kosong (komentar) | Belum ada balasan. Tulis yang pertama. |
| Keadaan kosong (kelas) | Belum ada diskusi di kelas ini. Mulai dengan satu pertanyaan. |
| Galat ukuran file | File lebih dari 10 MB. Perkecil ukurannya atau pilih file lain. |
| Galat format file | Format ini belum didukung. Pakai JPG, PNG, WebP, atau PDF. |
| Username dipakai | Username sudah dipakai. Coba yang lain. |
| Komentar dihapus pemilik | Komentar ini dihapus oleh penulisnya. |
| Konten disembunyikan | Konten ini disembunyikan oleh moderator. |
| Memuat | Memuat diskusi |
| Berhasil membuat | Diskusi terbit. |

**Hindari:** kalimat promosi berlebihan, tanda seru beruntun, emoji sebagai pengganti kata, dan frasa generik seperti "Selamat datang di platform terbaik".

---

## 10. Larangan Khusus Proyek

Selain aturan anti-slop yang berlaku untuk semua proyek:

- Tidak ada statistik, jumlah pengguna, testimoni, rating, atau nama pengguna palsu. Pakai data nyata atau keadaan kosong yang jujur.
- Tidak ada foto stok sebagai avatar atau banner.
- Tidak ada gradien ungu atau biru, tidak ada teks bergradien, dan tidak ada kaca buram (glassmorphism) di mana-mana.
- Tidak ada bayangan tebal. Pemisah memakai garis tipis.
- Tidak ada pil "baru", "AI-powered", atau sejenisnya.
- Tidak ada ikon dekoratif yang tidak membantu orang memindai halaman.
- Tidak ada animasi pada setiap hover atau setiap kartu.
- Tidak ada warna di luar token di dokumen ini tanpa alasan yang ditulis.

---

## 11. Referensi Gaya

Agent **harus membaca file DESIGN.md asli** dari sumber di bawah sebelum mengambil prinsipnya, lalu melengkapi tautan langsung ke file yang dibaca. Jangan menyalin warna, font, atau logo merek aslinya.

Sumber koleksi: https://github.com/VoltAgent/awesome-design-md dan https://getdesign.md

| Referensi | Prinsip yang diambil | Status baca |
|---|---|---|
| Discord | Kartu profil berlapis (banner, avatar, bingkai, efek), penanda komunitas | Belum dibaca |
| Notion | Keterbacaan teks panjang, ruang putih yang tenang | Belum dibaca |
| Linear | Kerapian dan kepadatan daftar | Belum dibaca |
| GitHub | Kejelasan state, aksesibilitas, tampilan diskusi bertingkat | Belum dibaca |

Ubah kolom "Status baca" menjadi tautan file setelah dibaca. Hapus baris yang akhirnya tidak dipakai.

---

## 12. Asumsi dan Catatan

1. Empat warna identitas diambil persis dari palet Color Hunt. Warna turunan (kertas, tinta, status) dibuat penulis dokumen dan perlu dicek ulang dengan alat kontras.
2. Pilihan font (Newsreader, Figtree, JetBrains Mono) adalah usulan. Ganti bila tampak tidak cocok, tetapi pertahankan prinsipnya: judul serif, teks sans yang terbaca, mono hanya untuk kode.
3. Skala dial ENERGY, RHYTHM, dan MOTION mengikuti GUIDE.md anti-slop. Dokumen ini hanya menyebut tingkatnya secara deskriptif.
4. Katalog bingkai dan efek di bagian 6 adalah daftar awal. Aset sebenarnya dibuat saat fitur profil dikerjakan.
5. Bila hasil terasa hambar, perkaya dokumen ini dengan keputusan yang spesifik (misalnya ilustrasi, tekstur, atau komposisi halaman beranda), bukan dengan menambah dekorasi.

**Terakhir diperbarui:** 2026-11-03
