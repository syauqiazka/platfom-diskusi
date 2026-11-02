# Platform Diskusi dan Forum Pembelajaran — Design System

**Mood & Philosophy**
Ruang belajar bersama yang hangat, mudah diakses, dan penuh aktivitas. Desain mengedepankan keterbacaan untuk teks panjang, densitas informasi yang cerdas (inspirasi Linear), dan nuansa manusiawi editorial (inspirasi Claude). Tidak ada statistik palsu, avatar generik, atau dekorasi tanpa fungsi. Setiap elemen melayani percakapan dan pembelajaran.

---

## 1. Color Palette

**Mode Gelap (Primary)**
- `Surface Primary`: `#0f0f0f` — kanvas utama, near-black untuk fokus
- `Surface Secondary`: `#1a1a1a` — kartu, panel, elevasi ringan
- `Surface Tertiary`: `#252525` — hover state, border subtle
- `Text Primary`: `#f5f5f5` — body text, readability AA
- `Text Secondary`: `#a8a8a8` — label, metadata, secondary
- `Text Tertiary`: `#7a7a7a` — disabled, hint
- `Accent Primary`: `#d97706` — terracotta hangat (Claude), CTA utama
- `Accent Secondary`: `#6366f1` — indigo ringan, aksi sekunder, highlight thread
- `Success`: `#10b981` — moderasi approve, mark resolved
- `Warning`: `#f59e0b` — flag, pending action
- `Error`: `#ef4444` — reject, delete, conflict
- `Border`: `#3f3f3f` — divider, input outline

**Mode Terang (Variant)**
- `Surface Primary`: `#fafafa`
- `Surface Secondary`: `#ffffff`
- `Surface Tertiary`: `#f3f4f6`
- `Text Primary`: `#1f2937`
- `Text Secondary`: `#6b7280`
- `Text Tertiary`: `#9ca3af`
- `Accent Primary`: `#d97706` (same — terakota hangat)
- `Accent Secondary`: `#6366f1` (same)
- `Border`: `#e5e7eb`

**Contrast Ratios**: Semua kombinasi Text Primary + Surface memenuhi WCAG AA (≥ 4.5:1 untuk body). Accent Primary dengan Surface = 5:1+.

**Semantic Usage**
- `Accent Primary` (terracotta): tombol utama, tag kelas, nomor thread penting
- `Accent Secondary` (indigo): link internal, thread highlight di diskusi global, badge moderator
- `Success`: moderasi approve, komentar resolved
- `Warning`: notifikasi pending, upload queue
- `Error`: reject, delete thread, konten flagged

---

## 2. Typography

**Font Families**
- **Serif** (heading, display): `Charter`, fallback `Georgia, serif` — hangat, editorial, natural untuk Bahasa Indonesia
- **Sans** (body, UI): `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif` — terbaca, tight letter-spacing untuk efisiensi
- **Mono** (code, timestamp): `"JetBrains Mono", "Fira Code", monospace` — konsisten, grid-aligned

**Type Scale** (pixel size, weight, line-height)
| Use | Size | Weight | Line Height | Letter Spacing |
|-----|------|--------|-------------|---|
| Display | 32px | 600 | 1.2 | -0.01em |
| Headline 1 | 24px | 600 | 1.3 | 0 |
| Headline 2 | 20px | 600 | 1.35 | 0 |
| Headline 3 | 18px | 500 | 1.4 | 0 |
| Body Large | 16px | 400 | 1.6 | -0.005em |
| Body | 14px | 400 | 1.65 | -0.005em |
| Label | 13px | 500 | 1.5 | 0 |
| Caption | 12px | 400 | 1.5 | 0.01em |
| Mono | 13px | 400 | 1.6 | 0 |

**Rationale**
- Display & Headlines: serif (Charter) untuk editorial warmth, kohesi dengan Notion
- Body: sans 14–16px, line-height 1.6–1.65 untuk kenyamanan baca panjang (forum threads, materi)
- Tight letter-spacing di sans untuk kepadatan Linear-style tanpa kehilangan whitespace

---

## 3. Layout & Spacing

**Grid & Width**
- Konten max-width: `880px` — optimal untuk reading (~ 65 karakter per baris Bahasa Indonesia)
- Gutter (padding horizontal): `16px` desktop, `12px` tablet, `8px` mobile
- Grid base: `8px` — semua spasi kelipatan 8

**Spacing Scale**
| Token | Value | Use |
|-------|-------|-----|
| `xs` | 4px | micro, icon spacing |
| `sm` | 8px | padding button, margin icon |
| `md` | 12px | component padding |
| `lg` | 16px | card padding, gap elemen |
| `xl` | 24px | section gap |
| `2xl` | 32px | major section break |
| `3xl` | 48px | page top margin |

**Breakpoints**
- Mobile: `< 640px`
- Tablet: `640px — 1024px`
- Desktop: `> 1024px`

**Responsive Behavior**
- **Mobile**: single column, collapsed nav, bottom sheet modals
- **Tablet**: two-column (sidebar 240px + content), tap target ≥ 44px
- **Desktop**: three-column (sidebar 240px, content 880px, right panel optional)

---

## 4. Components

### Button

**States: Default, Hover, Active, Focus, Disabled, Loading**

**Primary (Accent Primary terracotta)**
- Default: bg `#d97706`, text white, padding `8px 16px`, border-radius `6px`, font 14px/500
- Hover: bg `#b45309` (darken 20%), scale `1.02`
- Active: scale `0.98`, bg `#92400e`
- Focus: outline `2px solid #f97316` (orange-lighter), offset `2px`
- Disabled: bg `#6b7280`, text `#9ca3af`, cursor not-allowed, opacity `0.6`
- Loading: spinner SVG (2px stroke), 16px diameter, centered inside button

**Secondary (Accent Secondary indigo)**
- Default: bg transparent, border `1px solid #6366f1`, text `#6366f1`, padding `8px 16px`
- Hover: bg `rgba(99, 102, 241, 0.1)`
- Active: bg `rgba(99, 102, 241, 0.2)`
- Focus: outline as Primary
- Disabled: border `#9ca3af`, text `#9ca3af`

**Ghost (text-only)**
- Default: bg transparent, text `#d97706`, no border
- Hover: text `#f97316`, bg `rgba(217, 119, 6, 0.1)`
- Disabled: text `#9ca3af`

### Input & Textarea

- Border: `1px solid #3f3f3f` (dark mode)
- Padding: `8px 12px`
- Border-radius: `6px`
- Font: Body 14px
- Focus: outline `2px solid #d97706`, offset `2px`
- Placeholder: `#7a7a7a`
- Error state: border `2px solid #ef4444`, error message 12px/400, color Error below input

**Textarea** (thread reply, new material)
- Min-height: `100px`
- Max-height: `400px` with scrollbar
- Line-height: `1.6`
- Same border/focus as Input

### Card (Thread, Material, Comment)

- Background: `#1a1a1a`
- Border: `1px solid #3f3f3f`
- Border-radius: `8px`
- Padding: `12px 16px` (compact) or `16px 20px` (spacious di detail)
- Box-shadow: none (flat design)
- Hover: border color to `#6366f1`, transition `150ms`

**Thread Card** (diskusi global & kelas)
- Header: title (Headline 3), author + timestamp (Caption), class tag (Label, badge)
- Meta: reply count, last activity time (Text Tertiary)
- Preview: body text truncated 140 karakter, "..." jika lebih
- Pinned indicator: gold star icon top-right

**Material Card** (pembelajaran)
- Header: title (Headline 2), author + date
- Meta: kategori tag (secondary), ukuran file jika attachment
- Thumbnail: 40px icon atau 120px preview image jika tersedia
- CTA: "Lihat Detail" button sekunder

**Comment Card** (bertingkat)
- Nested padding-left: `+24px` per level (max 4 level)
- Border-left: `2px solid #6366f1` untuk visual hierarchy
- Author badge: avatar + nama + "Moderator" badge jika applicable
- Timestamp: Caption gray, hover show full date
- Actions: Reply, Like (jika feature), Report (icon button)

### Tag & Badge

- Padding: `4px 8px`
- Border-radius: `4px`
- Font: Label 13px
- Background: semantic color at 15% opacity
- Text: semantic color (full)

**Class Tag** (terracotta accent)
- bg `rgba(217, 119, 6, 0.15)`, text `#d97706`
- Contoh: "Kelas 10A", "Global"

**Status Badge** (di reply moderation)
- Success: green, "Disetujui"
- Warning: amber, "Pending"
- Error: red, "Ditolak"

### Notification / Alert

- Border-left: `4px solid` semantic color
- Padding: `12px 16px`
- Icon + text
- Close button (X icon, ghost style)
- Animation: slide-in dari atas 200ms, ease-out

---

## 5. Profile & Personalisasi

**Avatar Stack** (banner, avatar, frame, effects)
- Banner: full-width, 200px height desktop, 120px mobile
- Avatar: 80px diameter, border-radius `50%`, border `3px solid #1a1a1a`
- Frame (optional): 96px square, rounded `12px`, contains avatar centered
- Effects (optional): animated border 2px moving gradient (Discord-style), visible on hover
- Positioning: avatar overlaps banner bottom, -40px offset vertical

**Avatar Upload**
- Square crop UI (1:1), preview 160×160px
- Max 10MB, JPG/PNG/WebP via Cloudinary
- Validation client + server (Zod)

**Profile Info**
- Username, bio (250 char max), class (jika siswa)
- Social: link ke Discord/Telegram (opsi)
- Join date, post count (real data only, no fake metrics)

---

## 6. Animation (GSAP)

**Energy Level**: `MEDIUM` (tidak bombastis, fokus legible)
**Rhythm**: `natural` (150ms — 300ms standard transitions)
**Motion**: `subtle` (transform + opacity only, no color flashes)

**Triggers & Durations**
| Action | Duration | Easing | What animates |
|--------|----------|--------|---|
| Button hover | 150ms | `ease-out` | scale 1.02, subtle shadow |
| Card entrance | 300ms | `ease-out` | opacity 0→1, transform translateY(8px) |
| Modal open | 250ms | `ease-out` | opacity 0→1, transform scale(0.95)→1 |
| Pagination | 200ms | `ease-in-out` | opacity fade between pages |
| Notification slide | 200ms | `ease-out` | translateY(-20px) → 0 |
| Thread resolve | 400ms | `ease-out` | opacity fade, label change |

**Respects**
- `prefers-reduced-motion: reduce` → all durations `0ms` (instant) or skip animation
- IntersectionObserver: skip animation untuk elemen off-screen

**Do Not Animate**
- Text color (use opacity fade instead)
- Layout shifts (use transform: translate)
- Rapid cascades (stagger max 50ms between items)

---

## 7. Accessibility

**Keyboard Navigation**
- Tab order: natural flow (top-left → bottom-right)
- Focus visible: `outline 2px solid #d97706` with 2px offset
- Skip link: visible on focus, jump to main content
- Dialogs: trap focus, ESC to close

**Color & Contrast**
- No info conveyed by color alone (use icon + text)
- Error messages always display as text, not just red border
- Links underlined or icon-indicated, never color-only

**Touch Targets**
- Minimum 44×44px (buttons, icon buttons)
- Spacing ≥ 8px between touch targets

**Semantic HTML**
- Headings: proper hierarchy (h1 → h2 → h3)
- Lists: `<ul>`/`<ol>` for threads, not divs
- Labels: `<label>` for form inputs
- Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`

**Screen Reader**
- Alt text for user avatars: "Avatar [username]"
- Thread title is primary heading
- Nested comments announced with level: "Comment level 2"
- Live regions for notifications: `aria-live="polite"`, `aria-atomic="true"`

---

## 8. Copywriting (Bahasa Indonesia)

**Tone**
- Natural, rinkas, tidak corporate
- Gunakan "Anda" formal untuk instruksi
- Gunakan "kita" untuk komunitas
- Hindari jargon; jika perlu, jelaskan

**Examples**

| Situation | Text |
|-----------|------|
| CTA utama | Buat Diskusi (bukan "Mulai Topik Baru") |
| Empty state | Belum ada balasan. Jadilah yang pertama! |
| Error upload | File terlalu besar (max 10 MB). Coba compress atau format lain. |
| Comment deleted | Komentar dihapus oleh author. |
| Moderator action | Moderator menandai ini sebagai resolved. |
| Loading | Memuat diskusi... |
| Success | Diskusi dibuat! Orang lain bisa melihatnya sekarang. |

**Do's**
- ✓ "Lihat di kelas" (action-oriented)
- ✓ "Selesai" (concise button)
- ✓ "Mohon tunggu..." (polite, passive)

**Don'ts**
- ✗ "Click here" (generic, SEO slop)
- ✗ "Welcome to the most amazing learning platform ever!" (fake enthusiasm)
- ✗ "Congratulations! You've reached 1000 posts!" (invented metrics)

---

## 9. Moderasi & Governance

**Comment States**
- `approved` — default, visible
- `pending` — flagged by user or AI, mod review required
- `rejected` — mod decision, hidden, author notified
- `resolved` — thread marked by mod, collapses discussion

**Moderator Indicator**
- Badge "Moderator" di profile, badge color indigo
- Mod actions visible: "Moderator menandai ini resolved"
- Mod-only panel in thread: bulk actions, flag queue

**Content Rules** (enforce via backend, not UI)
- No spam links (>2 external URLs → pending)
- No @mention abuse (>10 mentions → pending)
- Explicit language flagged by ML model, preview-blur
- No real person's photo without consent (mod manual review)

---

## 10. Do's & Don'ts (Anti-Slop)

### UI Level
✓ Real data: actual usernames, real timestamps, real thread counts
✓ Empty states: "Belum ada balasan" with icon, not fake posts
✓ Authentic avatars: user uploads, not generated faces
✗ Fake metrics: "10,000+ students learning" (made up)
✗ Stock photos as avatars or banners
✗ Sparkles, animations on every hover
✗ Gradient text or overlapping translucent overlays everywhere
✗ "NEW NEXT-GEN AI POWERED" badge on features

### Copy Level
✓ Thread titles that make sense: "Gimana cara hitung integral?"
✓ User bios that are real: "Semester 3, jurusan Matematika"
✗ "We're disrupting education with AI-powered synergy"
✗ Testimonials: "This platform changed my life! ⭐⭐⭐⭐⭐" (fabricated)
✗ Call-to-action like "Join our community of 1M+ learners" (unverified)

### Component Level
✓ Buttons with clear intent: "Balas", "Tandai Resolved", "Laporkan"
✓ Error messages specific: "Username sudah terdaftar. Coba username lain."
✗ Vague: "Error" with no guidance
✗ Decorative icons that don't aid scannability
✗ Loading skeletons pretending to be real content

---

## 11. Reference Designs

| Source | Aspek yang Diambil | Alasan | Link |
|--------|-------------------|--------|------|
| Notion | Serif headings, warm minimalism, soft surfaces | Keterbacaan panjang, hangat untuk diskusi | https://www.notion.so |
| Linear | Ultra-minimal, data density, purple accent (swapped to terracotta) | Efisiensi visual, fokus pada konten, presisi spacing | https://linear.app |
| Claude | Warm terracotta accent, editorial layout, intellectual feel | Approachable namun smart, cocok untuk learning platform | https://claude.ai |
| Discord | Profile personalisasi (avatar frame, banner, effects) | Community bonding, self-expression, familiar untuk Gen Z | https://discord.com |
| GitHub | Contrast & accessibility, semantic color, clear states | Technical rigor, mature codebase, trusted by developers | https://github.com |

**Yang TIDAK diambil:**
- ✗ Discord's rainbow colors everywhere (use terracotta + indigo instead)
- ✗ Linear's grayscale-only (add warmth)
- ✗ Notion's heavy drop shadows (use minimal elevation)
- ✗ Generic startup landing aesthetics (fake metrics, stock photos)

---

## 12. Asumsi & Catatan

1. **Bahasa Indonesia Consistency**: Semua label, placeholder, dan message text Bahasa Indonesia natural. Font sans dipilih untuk tight letter-spacing karena efisiensi aksara Jawa modern.

2. **Real Data Only**: Platform tidak akan punya statistik palsu, rating/review tertipu, atau avatar AI-generated. Setiap pengguna profile adalah nyata atau placeholder jelas (e.g., "(Belum ada avatar)").

3. **Animasi Minimal**: GSAP dipakai untuk smooth transitions, bukan untuk hiasan. Setiap animasi punya tujuan (signaling state change, focus guidance).

4. **Accessibility First**: WCAG AA adalah baseline. Keyboard-first design; mouse/touch adalah enhancement.

5. **Performa**: Max 3 animasi concurrent, IntersectionObserver untuk lazy-animate offscreen content. CSS transforms preferred over reflow-causing properties.

6. **Upgrade Path**: Anti-slop adalah filter. Kalau hasil terasa hambar, lihat `AGENTS.md` untuk definisi selesai — mungkin contextual design decision (feature baru, use case khusus) yang perlu dokumentasi, bukan bug di system ini.
