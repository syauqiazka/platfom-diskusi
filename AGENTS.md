# AGENTS.md: Platform Diskusi dan Forum Pembelajaran

Panduan untuk agent coding. Tampilan dan nuansa ada di `DESIGN.md`. Baca keduanya sebelum mengerjakan fitur apa pun.

## 1. Ringkasan Proyek

Platform diskusi untuk kelas. Setiap kelas punya ruang diskusi sendiri, dan ada **diskusi global** yang mempertemukan semua kelas. Pengajar dan murid bisa berdiskusi, berbagi materi belajar, berkomentar, dan dimoderasi.

**Fitur wajib (kerjakan lebih dulu):**
1. Ruang diskusi kelas: pengajar membuat kelas, murid bergabung lewat kode, ada thread, pengumuman, dan tab materi.
2. Diskusi global: ruang terbuka untuk semua pengguna yang login, lintas kelas.
3. Berbagi materi belajar: gambar, PDF, tautan, dan catatan teks, di ruang kelas maupun global.
4. Sistem komentar: balasan bertingkat, edit dan hapus milik sendiri, mention, lampiran gambar.
5. Moderasi konten: laporan, antrean, tindakan moderator, dan log yang tidak bisa diubah.

**Fitur tambahan (tidak kalah penting, kerjakan setelah yang wajib stabil):**
- Autentikasi lengkap (Google/GitHub, verifikasi email, reset password).
- Chat pribadi real-time dengan kirim foto.
- Profil kustom: avatar, banner, bingkai avatar, efek profil beranimasi.
- Notifikasi, pencarian, voting, dan jawaban terbaik.
- Gamifikasi dan buka-kunci bingkai atau efek lewat poin atau badge.
- Dashboard admin.

Autentikasi dasar (masuk dan daftar) tetap dibutuhkan sejak awal karena fitur wajib bergantung padanya.

---

## 2. Stack

| Lapisan | Teknologi | Catatan |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | Pakai versi stabil terbaru. Server Components secara default. |
| Styling | Tailwind CSS + shadcn/ui | Token dari `DESIGN.md`. |
| Animasi | GSAP | Gunakan `useGSAP` atau `gsap.context()` dan `gsap.matchMedia()`. |
| Database | PostgreSQL di Neon | Dua URL: pooled untuk aplikasi, direct untuk migrasi. |
| ORM | Prisma | Hanya diakses dari sisi server. |
| Autentikasi | Auth.js | Periksa dokumentasi versi terpasang untuk strategi sesi dan provider Credentials. |
| Real-time | Ably | Chat dan presence. Autentikasi lewat token buatan server. |
| Upload | Cloudinary | Upload bertanda tangan (signed upload) dari server. |
| Validasi | Zod | Skema yang sama dipakai di client dan server. |
| Rate limiting | Upstash Redis + Ratelimit | Penyimpanan bersama dibutuhkan karena deployment serverless. |
| Form | React Hook Form | Dipakai bersama Zod. |

Jangan menambah dependensi baru tanpa alasan yang jelas. Bila perlu, tulis alasannya di pesan commit.

---

## 3. Perintah

Tambahkan skrip ke `package.json` bila belum ada.

```bash
npm install
npm run dev                      # http://localhost:3000
npm run build
npm run lint
npm run type-check               # tsc --noEmit

npx prisma generate
npx prisma migrate dev --name <nama_migrasi>   # pengembangan
npx prisma migrate deploy                      # produksi
npx prisma studio

npm run test                     # Vitest
npm run test:e2e                 # Playwright
```

`prisma db push` hanya untuk prototipe cepat. Untuk perubahan skema yang dipertahankan, pakai migrasi.

---

## 4. Struktur Folder

Kelompokkan per fitur. Struktur ini adalah usulan, sesuaikan seperlunya dan catat bila berubah.

```
app/
  (auth)/masuk, daftar
  (app)/
    layout.tsx                    # sidebar dan header
    page.tsx                      # beranda: kelas saya dan aktivitas
    kelas/[kelasId]/
      page.tsx                    # diskusi kelas
      materi/
      anggota/
      diskusi/[threadId]/
    global/
      page.tsx                    # diskusi global
      materi/
      [threadId]/
    chat/[username]/              # tahap lanjutan
    profil/[username]/
    moderasi/                     # antrean laporan dan log
    admin/                        # tahap lanjutan
  api/
    auth/[...nextauth]/
    ably/token/
    upload/sign/
    upload/webhook/
components/
  ui/                             # shadcn/ui
  thread/ komentar/ materi/ moderasi/ profil/ layout/
lib/
  db.ts                           # klien Prisma
  auth.ts
  permissions.ts                  # semua pemeriksaan hak akses di satu tempat
  validators/                     # skema Zod per fitur
  cloudinary.ts
  ably.ts
  ratelimit.ts
server/
  actions/                        # Server Actions per fitur
  queries/                        # fungsi baca data
prisma/
  schema.prisma
  seed.ts
tests/
  unit/ integration/ e2e/
DESIGN.md
AGENTS.md
```

---

## 5. Konvensi Kode

- `strict: true`. Tanpa `any`, tanpa `@ts-ignore` kecuali dengan komentar alasannya.
- Identifier dalam Bahasa Inggris (`camelCase` untuk variabel dan field, `PascalCase` untuk tipe dan komponen). Teks yang dilihat pengguna dan path URL dalam Bahasa Indonesia.
- Server Actions mengembalikan hasil bertipe: `{ ok: true, data } | { ok: false, error }`.
- Semua input divalidasi dengan Zod di server, apa pun yang sudah divalidasi di client.
- Server Actions untuk mutasi sederhana dari antarmuka. Route Handlers untuk webhook, token, dan upload.
- Jangan kirim objek Prisma mentah ke client. Pakai `select` dan ubah menjadi DTO. Jangan pernah mengirim `passwordHash`.
- Client Component (`'use client'`) hanya bila perlu interaktivitas.
- Komentar hanya menjelaskan *mengapa*, tidak mengulang apa yang kode lakukan.
- Tangani error dengan jelas. Catat detail di server, kirim pesan yang ramah ke pengguna.
- Kode status: 400 (validasi), 401 (belum masuk), 403 (tidak berhak), 404, 429 (terlalu banyak permintaan), 500.

---

## 6. Model Data

Skema di bawah adalah rancangan inti untuk fitur wajib. Skema lengkap ada di `prisma/schema.prisma`. Tabel untuk fitur tambahan (Message, Conversation, Notification, Vote, Badge) disusun saat fiturnya dikerjakan.

```prisma
enum PlatformRole { MEMBER MODERATOR ADMIN }
enum ClassRole    { TEACHER ASSISTANT STUDENT }
enum ContentStatus { VISIBLE HIDDEN REMOVED }          // status moderasi
enum ThreadState  { OPEN ANSWERED CLOSED }             // status diskusi, terpisah dari moderasi
enum MaterialType { SLIDE VIDEO ARTICLE EXERCISE DOCUMENT IMAGE LINK NOTE }
enum ReportStatus { OPEN DISMISSED ACTIONED }
enum ModerationAction { DISMISS HIDE REMOVE RESTORE WARN SUSPEND }

model User {
  id            String       @id @default(cuid())
  email         String       @unique
  username      String       @unique @db.VarChar(30)
  displayName   String       @db.VarChar(60)
  passwordHash  String?                              // kosong bila login lewat OAuth
  bio           String?      @db.VarChar(250)
  avatarUrl     String?
  bannerUrl     String?
  bannerColor   String?                              // cadangan bila belum ada banner
  avatarFrameId String?
  effectId      String?
  role          PlatformRole @default(MEMBER)
  suspendedUntil DateTime?
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  memberships ClassMember[]
  threads     Thread[]
  comments    Comment[]
  materials   Material[]
  reports     Report[]     @relation("Reporter")
  avatarFrame AvatarFrame?   @relation(fields: [avatarFrameId], references: [id])
  profileEffect ProfileEffect? @relation(fields: [effectId], references: [id])
}

model Class {
  id          String   @id @default(cuid())
  name        String   @db.VarChar(100)
  description String?  @db.VarChar(500)
  subject     String?  @db.VarChar(80)
  joinCode    String   @unique @db.VarChar(12)
  coverUrl    String?
  createdAt   DateTime @default(now())

  members   ClassMember[]
  threads   Thread[]
  materials Material[]
}

model ClassMember {
  id       String    @id @default(cuid())
  userId   String
  classId  String
  role     ClassRole @default(STUDENT)
  joinedAt DateTime  @default(now())

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  class Class @relation(fields: [classId], references: [id], onDelete: Cascade)

  @@unique([userId, classId])
  @@index([classId])
}

model Category {
  id      String   @id @default(cuid())
  name    String   @unique @db.VarChar(60)
  slug    String   @unique
  threads Thread[]
}

model Thread {
  id         String        @id @default(cuid())
  title      String        @db.VarChar(200)
  content    String        @db.Text
  authorId   String
  classId    String?                                  // kosong berarti diskusi global
  categoryId String?                                  // dipakai di diskusi global
  isPinned   Boolean       @default(false)
  state      ThreadState   @default(OPEN)
  status     ContentStatus @default(VISIBLE)
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt

  author   User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  class    Class?    @relation(fields: [classId], references: [id], onDelete: Cascade)
  category Category? @relation(fields: [categoryId], references: [id])
  comments Comment[]
  reports  Report[]

  @@index([classId, createdAt])
  @@index([createdAt])
}

model Comment {
  id        String        @id @default(cuid())
  content   String        @db.Text
  authorId  String
  threadId  String?
  materialId String?
  parentId  String?
  depth     Int           @default(0)                // 0 sampai 3
  status    ContentStatus @default(VISIBLE)
  editedAt  DateTime?
  createdAt DateTime      @default(now())

  author   User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  thread   Thread?   @relation(fields: [threadId], references: [id], onDelete: Cascade)
  material Material? @relation(fields: [materialId], references: [id], onDelete: Cascade)
  parent   Comment?  @relation("CommentTree", fields: [parentId], references: [id], onDelete: Cascade)
  children Comment[] @relation("CommentTree")
  reports  Report[]

  @@index([threadId, createdAt])
  @@index([materialId, createdAt])
}

model Material {
  id          String        @id @default(cuid())
  title       String        @db.VarChar(200)
  description String?       @db.VarChar(500)
  type        MaterialType
  fileUrl     String?                                 // URL Cloudinary
  publicId    String?
  mimeType    String?
  sizeBytes   Int?
  linkUrl     String?
  body        String?       @db.Text                  // untuk catatan teks
  isOfficial  Boolean       @default(false)           // ditandai pengajar
  authorId    String
  classId     String?                                 // kosong berarti global
  status      ContentStatus @default(VISIBLE)
  createdAt   DateTime      @default(now())

  author   User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  class    Class?    @relation(fields: [classId], references: [id], onDelete: Cascade)
  comments Comment[]
  reports  Report[]

  @@index([classId, createdAt])
}

model Report {
  id         String       @id @default(cuid())
  reporterId String
  threadId   String?
  commentId  String?
  materialId String?
  reason     String       @db.VarChar(40)             // spam, sara, tidak_pantas, lainnya
  note       String?      @db.VarChar(500)
  status     ReportStatus @default(OPEN)
  createdAt  DateTime     @default(now())

  reporter User      @relation("Reporter", fields: [reporterId], references: [id], onDelete: Cascade)
  thread   Thread?   @relation(fields: [threadId], references: [id], onDelete: Cascade)
  comment  Comment?  @relation(fields: [commentId], references: [id], onDelete: Cascade)
  material Material? @relation(fields: [materialId], references: [id], onDelete: Cascade)

  @@index([status, createdAt])
}

model ModerationLog {
  id         String           @id @default(cuid())
  actorId    String
  action     ModerationAction
  targetType String           @db.VarChar(20)         // THREAD, COMMENT, MATERIAL, USER
  targetId   String
  classId    String?                                  // kosong bila di tingkat platform
  reason     String           @db.VarChar(500)
  createdAt  DateTime         @default(now())

  @@index([targetType, targetId])
  @@index([classId, createdAt])
}

model AvatarFrame {
  id       String @id @default(cuid())
  name     String
  assetUrl String
  type     String                                     // static | svg | lottie
  users    User[]
}

model ProfileEffect {
  id        String @id @default(cuid())
  name      String
  configKey String                                    // kunci komponen animasi GSAP
  users     User[]
}
```

**Aturan penting:**
- `classId` kosong pada `Thread` dan `Material` berarti **diskusi global**. Satu kode dipakai untuk kedua ruang.
- Peran ada dua tingkat: `PlatformRole` (MEMBER, MODERATOR, ADMIN) dan `ClassRole` (TEACHER, ASSISTANT, STUDENT) per kelas lewat `ClassMember`. Seorang pengguna bisa jadi murid di satu kelas dan asisten di kelas lain.
- `Report` menunjuk tepat **satu** target (thread, komentar, atau materi). Prisma tidak bisa menyatakan syarat ini, jadi pastikan di validasi Zod dan tambahkan `CHECK` lewat migrasi SQL.
- `Comment` menunjuk tepat satu dari `threadId` atau `materialId`. Pastikan dengan cara yang sama.
- **Kedalaman komentar:** `depth` 0 sampai 3 (komentar utama ditambah 3 tingkat balasan). Server menolak balasan bila `parent.depth >= 3`. Hitung `depth` di server, jangan percaya client.
- **Mengambil komentar:** ambil semua komentar satu thread dalam satu query, lalu susun pohonnya di memori. Hindari query berantai per tingkat.
- **Soft delete:** konten yang dihapus moderator berstatus `REMOVED` dan tetap ada untuk jejak audit. Konten yang `HIDDEN` atau `REMOVED` tidak pernah dikirim isinya ke pengguna biasa.
- `ThreadState` (terjawab atau ditutup) tidak sama dengan `ContentStatus` (moderasi). Jangan dicampur.
- `ModerationLog` hanya ditulis, tidak pernah diubah atau dihapus oleh aplikasi.

---

## 7. Hak Akses

Semua pemeriksaan hak akses ada di `lib/permissions.ts`. Jangan menulis ulang logikanya di tempat lain.

| Tindakan | Siapa |
|---|---|
| Melihat thread dan materi kelas | Anggota kelas tersebut, moderator platform, admin |
| Melihat diskusi global | Semua pengguna yang login |
| Membuat thread atau materi di kelas | Anggota kelas |
| Membuat thread atau materi global | Semua pengguna yang login |
| Menyematkan thread, menandai materi resmi | TEACHER dan ASSISTANT kelas tersebut |
| Memoderasi konten kelas | TEACHER dan ASSISTANT kelas tersebut, moderator platform, admin |
| Memoderasi konten global | Moderator platform dan admin |
| Edit atau hapus konten milik sendiri | Pemiliknya |
| Memblokir pengguna di tingkat platform | Admin |

Periksa hak akses di server pada **setiap** Server Action dan Route Handler. Menyembunyikan tombol di antarmuka bukan pemeriksaan hak akses.

---

## 8. Keamanan

**Autentikasi dan sesi**
- Cookie sesi `httpOnly`, `secure` di produksi, `sameSite=Lax`.
- Hash password dengan argon2 atau bcrypt. Jangan pernah menyimpan atau mencatat password mentah.
- Pengguna yang sedang diblokir (`suspendedUntil`) tidak bisa membuat konten baru.

**Input dan konten**
- Validasi semua input dengan Zod di server.
- Konten buatan pengguna adalah teks biasa atau Markdown terbatas. Saat ditampilkan, bersihkan dengan pustaka sanitasi (DOMPurify atau sanitize-html). Jangan pernah memakai `dangerouslySetInnerHTML` tanpa sanitasi.
- Prisma hanya dengan query berparameter. Jangan membangun SQL dengan string.
- Neon: koneksi SSL (`sslmode=require`).

**Rate limiting**
- Pakai Upstash Ratelimit, per pengguna bila sudah masuk dan per IP bila belum. Penyimpanan di memori tidak berfungsi di serverless.
- Batasi: membuat thread, komentar, laporan, unggahan, dan pesan chat.

**Upload**
- Gambar: JPG, PNG, WebP, maksimal 10 MB. Dokumen PDF: maksimal 10 MB (usulan, sesuaikan dengan batas paket Cloudinary).
- Server membuat tanda tangan upload dan membatasi format serta ukuran lewat parameter yang ditandatangani. Setelah upload, server memverifikasi hasilnya (tipe dan ukuran) sebelum menyimpan URL ke database. Validasi di client hanya untuk umpan balik cepat.
- Verifikasi tanda tangan notifikasi webhook Cloudinary sesuai dokumentasi resmi.
- Simpan hanya URL dan `publicId` di database, bukan file.

**Ably**
- Server membuat token lewat `/api/ably/token`. Batasi kemampuan (capability) token hanya ke channel milik pengguna. Jangan pernah menaruh `ABLY_API_KEY` di client.
- Nama channel chat pribadi: `dm:{idKecil}:{idBesar}` dengan ID diurutkan agar konsisten.

**Rahasia**
- `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `ABLY_API_KEY`, `CLOUDINARY_*`, `UPSTASH_*` hanya di environment variable. Sediakan `.env.example` tanpa nilai asli. Jangan commit `.env.local`.

**Moderasi otomatis awal**
- Tandai untuk ditinjau bila ada lebih dari 2 tautan luar atau lebih dari 10 mention dalam satu konten, atau cocok dengan daftar kata terlarang. Tandai, jangan langsung hapus.

---

## 9. Alur Upload Gambar

1. **Client:** pilih file, periksa tipe dan ukuran, tampilkan pratinjau. Untuk avatar (1:1) dan banner (sekitar 3:1), tampilkan editor potong sebelum unggah.
2. **Server (`/api/upload/sign`):** pastikan pengguna sudah masuk dan belum kena batas laju, lalu buat parameter upload bertanda tangan dengan folder, format yang diizinkan, dan batas ukuran.
3. **Client:** unggah langsung ke Cloudinary dengan parameter bertanda tangan itu, lalu terima `secure_url` dan `public_id`.
4. **Server (Server Action):** verifikasi hasil upload, lalu simpan URL ke `User.avatarUrl`, `User.bannerUrl`, `Material.fileUrl`, atau kolom gambar lain.
5. **Tampilan:** pakai `next/image` dengan transformasi Cloudinary (ukuran tetap dan format WebP).

---

## 10. Aturan Antarmuka

- Baca `DESIGN.md` sebelum membuat atau mengubah komponen. Pakai token dari dokumen itu, jangan menciptakan warna baru.
- Bangun dari shadcn/ui bila ada komponen yang cocok, lalu sesuaikan dengan token.
- Semua teks yang terlihat pengguna dalam Bahasa Indonesia yang natural, dengan sapaan "kamu".
- Tangani semua state: default, hover, fokus, nonaktif, loading, kosong, error.
- Desain mobile-first. Uji di lebar 375px, 768px, dan 1280px.
- Dilarang menaruh data buatan di antarmuka: statistik, jumlah pengguna, testimoni, rating, atau pengguna palsu. Gunakan data nyata atau keadaan kosong yang jujur.
- Animasi: ikuti tabel di `DESIGN.md`. Hanya `transform` dan `opacity`, dan selalu hormati `prefers-reduced-motion` lewat `gsap.matchMedia()`.

---

## 11. Anti-Slop

Proyek ini memakai https://github.com/miqdadbadjuber/anti-slop sebagai filter terhadap UI, tulisan, dan kode yang generik.

1. Pasang dengan `npx antislop-ai`. Pilih skill: antislop (inti), antislop-ui, antislop-copywriting, antislop-human, antislop-layoutmobile, antislop-code.
2. Gunakan mode **during** (aturan berlaku saat membangun). Agar tidak ditanya tiap sesi, simpan dengan `npx antislop-ai --mode during`.
3. Sebelum fitur dianggap selesai, jalankan **Delivery Gate**: laporan PASS/FAIL dalam empat blok yang dibuat agent sesuai instruksi skill. Ini bukan perintah CLI.
4. Anti-slop adalah filter, bukan panduan gaya. Arah visual ada di `DESIGN.md`. Hasil yang hambar berarti `DESIGN.md` perlu diperkaya, bukan filter yang gagal.
5. Perbarui dengan `npx antislop-ai --update`, lalu mulai sesi baru agar skill dimuat ulang.

Bila agent tidak bisa menjalankan `npx`, unduh `antislop.md` dari repo dan jadikan konteks sesi.

---

## 12. Alur Kerja

**Urutan pengerjaan yang disarankan:**
1. Fondasi: proyek, database, autentikasi dasar, layout, token desain.
2. Kelas: buat kelas, bergabung dengan kode, keanggotaan dan peran.
3. Thread dan komentar di ruang kelas.
4. Diskusi global (`classId` kosong, kategori).
5. Berbagi materi (gambar, PDF, tautan, catatan).
6. Moderasi: laporan, antrean, tindakan, log.
7. Fitur tambahan: profil kustom, chat pribadi, notifikasi, gamifikasi, admin.

**Per fitur:**
- [ ] Cakupan kecil dan jelas.
- [ ] Skema Prisma dan migrasi diperbarui.
- [ ] Skema Zod dan pemeriksaan hak akses (`lib/permissions.ts`).
- [ ] Server Action atau Route Handler selesai.
- [ ] Komponen selesai dengan semua state.
- [ ] Diuji di 375px, 768px, dan 1280px, juga dengan keyboard.
- [ ] Delivery Gate anti-slop lolos.
- [ ] Tes ditulis dan lolos.

**Git:** satu cabang per fitur, pull request kecil, pesan commit menjelaskan alasan.

**Bila ragu:** tulis asumsimu di deskripsi pull request atau bagian akhir file ini, jangan menebak diam-diam. Tanyakan bila keputusan berdampak pada model data atau hak akses.

---

## 13. Pengujian

- **Unit (Vitest):** validator Zod, fungsi di `lib/permissions.ts`, penyusun pohon komentar, pemeriksaan kedalaman.
- **Integrasi:** alur autentikasi, pembuatan thread dan komentar, aturan akses kelas vs global, tindakan moderasi.
- **E2E (Playwright):** daftar, buat atau gabung kelas, buat thread, komentar, laporkan, moderator menyembunyikan konten.
- Target cakupan: tinggi untuk jalur kritis (hak akses dan moderasi). Jangan mengejar angka cakupan untuk kode yang tidak penting.

---

## 14. Definisi Selesai

Sebuah fitur selesai bila:

1. Build dan lint bersih, TypeScript strict tanpa `any`.
2. Tes unit dan integrasi untuk jalur kritisnya lolos.
3. Delivery Gate anti-slop lolos, tanpa data buatan dan dengan teks yang natural.
4. Mengikuti `DESIGN.md`: token warna, tipografi, spasi, dan responsif di 375px, 768px, 1280px.
5. Aksesibilitas: fokus terlihat, bisa dipakai dengan keyboard, kontras memenuhi AA, HTML semantik.
6. Keamanan: tanpa rahasia di kode, input divalidasi di server, hak akses diperiksa di server, query berparameter.
7. Performa (target): LCP sekitar 2,5 detik atau lebih cepat dan CLS di bawah 0,1 pada halaman utama, gambar dioptimalkan.
8. Dokumentasi: komentar menjelaskan alasan, skema Prisma terdokumentasi.

---

## 15. Mulai Cepat

```bash
git clone <repo>
cd <folder-proyek>
npm install

cp .env.example .env.local
# isi: DATABASE_URL (pooled), DIRECT_URL, AUTH_SECRET, ABLY_API_KEY,
# CLOUDINARY_*, UPSTASH_*

npx prisma migrate dev
npm run dev
```

Lalu baca `DESIGN.md`, pasang anti-slop, dan mulai dari langkah 1 di bagian 12.

---

## 16. Asumsi dan Catatan

1. Batas 10 MB untuk PDF adalah usulan. Sesuaikan dengan batas paket Cloudinary yang dipakai.
2. Jenis materi (SLIDE, VIDEO, ARTICLE, EXERCISE, DOCUMENT, IMAGE, LINK, NOTE) adalah usulan. Video sebaiknya berupa tautan eksternal, bukan unggahan, untuk menghemat penyimpanan.
3. Aturan kedalaman komentar (maksimal 4 tingkat tampilan) mengikuti rancangan awal dan bisa diubah bila terasa sempit.
4. Struktur folder bersifat usulan. Catat perubahan di sini.

**Terakhir diperbarui:** 2026-11-03
