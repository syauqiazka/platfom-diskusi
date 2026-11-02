# Platform Diskusi dan Forum Pembelajaran — Agent Guide

## Project Summary

**Platform Diskusi dan Forum Pembelajaran** adalah aplikasi diskusi multi-kelas dengan fitur diskusi global. Siswa dan guru dapat memberdiskusi per kelas, berbagi materi pembelajaran, dan berinteraksi dalam forum global yang menyatukan semua kelas.

**Fitur Wajib (MVP)**
1. Ruang diskusi per kelas — thread, balasan, komenter moderasi
2. Diskusi global — thread yang terlihat semua kelas, dengan identifier kelas di thread (atau kosong = global)
3. Berbagi materi belajar — upload file/link, kategori (slide, video, artikel, soal)
4. Sistem komentar bertingkat — balasan di thread hingga 4 level deep
5. Moderasi konten — flag, approve/reject, soft delete, resolve threads

**Fitur Tambahan (Roadmap)**
- Autentikasi (sign-up, sign-in, SSO optional)
- Chat pribadi real-time
- Profil kustom (avatar, banner, frame, animated border effects)
- Notifikasi (browser push, email)
- Gamifikasi (badge, leaderboard dengan real data)
- Admin dashboard (user manage, content moderation, analytics)

---

## Stack & Rationale

| Layer | Tech | Why |
|-------|------|-----|
| **Frontend** | Next.js 14 (App Router) + TypeScript | Server Components reduce JS, streaming, Type-safety |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first, accessible components, rapid dev, tokens in DESIGN.md |
| **Animation** | GSAP 3.12+ | Smooth tweens, IntersectionObserver helpers, `prefers-reduced-motion` baked in |
| **Backend** | Next.js Route Handlers + Server Actions | Type-safe, co-located, less boilerplate than separate API |
| **Database** | Prisma ORM + Neon (PostgreSQL) | Type-safe queries, migrations, connection pooling, free tier generous |
| **Auth** | Auth.js (NextAuth) v5 | Session-based + JWT token, supports OAuth + credentials, refresh token rotation |
| **Real-time** | Ably SDK | Chat, presence, pub/sub. Managed, scalable, free tier covers MVP |
| **Image Upload** | Cloudinary | CDN delivery, auto-crop, format negotiation, webhooks for sync |
| **Validation** | Zod + Server-side enforcement | Client hints, server validation mandatory (never trust client) |

---

## Commands

```bash
# Setup
npm install
npm run db:push          # Prisma migrate to Neon
npm run db:seed          # Optional: seed test data

# Development
npm run dev              # http://localhost:3000, auto-reload

# Build & Deploy
npm run build
npm start

# Database
npx prisma studio       # GUI DB browser
npx prisma migrate dev --name <migration_name>

# Linting & Type Check
npm run lint
npm run type-check

# Testing (setup with Vitest + Playwright)
npm run test            # Unit tests
npm run test:e2e        # Integration tests
```

---

## Folder Structure

```
platform-diskusi/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx           # Sidebar + header
│   │   ├── page.tsx             # Home / feed
│   │   ├── kelas/[id]/
│   │   │   ├── page.tsx         # Class discussion view
│   │   │   └── layout.tsx
│   │   ├── diskusi/[threadId]/  # Thread detail
│   │   │   └── page.tsx
│   │   ├── materi/              # Learning materials
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── chat/[userId]/       # DM (future)
│   │   ├── profil/[userId]/     # User profile
│   │   └── admin/               # Moderation (if role === 'MODERATOR'|'ADMIN')
│   │       ├── flags/page.tsx
│   │       ├── users/page.tsx
│   │       └── analytics/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts    # NextAuth API
│   │   ├── threads/
│   │   │   ├── route.ts                  # GET (list), POST (create)
│   │   │   ├── [id]/route.ts             # GET, PATCH, DELETE
│   │   │   ├── [id]/comments/route.ts    # POST comment
│   │   │   └── [id]/resolve/route.ts     # PATCH (resolve thread)
│   │   ├── materials/route.ts
│   │   ├── upload/
│   │   │   ├── route.ts                  # Presigned URL for Cloudinary
│   │   │   └── webhook.ts                # Cloudinary webhook
│   │   ├── ably/
│   │   │   └── token/route.ts            # Generate Ably token
│   │   └── admin/
│   │       ├── flags/[id]/route.ts       # Approve/reject
│   │       ├── users/[id]/route.ts
│   │       └── analytics/route.ts
│   └── layout.tsx                        # Root + providers
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Notification.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── thread/
│   │   ├── ThreadCard.tsx
│   │   ├── ThreadDetail.tsx
│   │   ├── CommentList.tsx
│   │   ├── CommentForm.tsx
│   │   └── ModeratorPanel.tsx
│   ├── material/
│   │   ├── MaterialCard.tsx
│   │   ├── MaterialUpload.tsx
│   │   └── MaterialList.tsx
│   ├── profile/
│   │   ├── ProfileHeader.tsx        # Avatar + banner + effects
│   │   ├── ProfileEditor.tsx
│   │   └── AvatarUpload.tsx
│   └── forms/
│       ├── ThreadForm.tsx
│       ├── CommentForm.tsx
│       └── MaterialForm.tsx
├── lib/
│   ├── db.ts                        # Prisma client
│   ├── auth.ts                      # Auth.js config
│   ├── ably.ts                      # Ably client
│   ├── cloudinary.ts                # Cloudinary helpers
│   ├── validators.ts                # Zod schemas
│   ├── auth-server.ts               # Server-side auth checks
│   └── utils.ts
├── styles/
│   ├── globals.css                  # Tailwind + custom vars
│   └── animations.css               # GSAP timeline helpers
├── prisma/
│   ├── schema.prisma                # Data model
│   └── seed.ts                      # Test data
├── public/
│   └── ...
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── DESIGN.md                        # Design system
├── AGENTS.md                        # This file
└── package.json
```

---

## Code Conventions

### TypeScript Strictness
- `strict: true` in `tsconfig.json` — no implicit any, no unsafe null
- All Server Actions return typed result: `{ success: boolean, data?: T, error?: string }`
- All API routes validate input with Zod before processing

### Validation
- **Client**: Zod schema for form hints, `react-hook-form` for DX
- **Server**: Always re-validate with identical Zod schema (client can be bypassed)
- Prisma schema enforces DB constraints (unique, required, length limits)

### Server Actions vs Route Handlers
- Use **Server Actions** for simple mutations (create thread, add comment) — shorter, no JSON serialization
- Use **Route Handlers** for public APIs, webhooks, file uploads
- Both validate with Zod before query execution

### Database Access
- Prisma queries **ONLY** from Server Components, Server Actions, or Route Handlers
- Never expose raw Prisma/SQL to browser — always transform to DTO
- Use `.select()` to limit fields returned (e.g., never return `password_hash`)

### Component Organization
- Functional components, hooks-based
- Client Component (`'use client'`) only when needed (form interactivity, event listeners, browser API)
- Server Component by default — stream HTML, reduce JS bundle

### Error Handling
- Try-catch all async operations, log to stderr or monitoring service
- Return user-friendly error message to client, detailed logs server-side
- 400 Bad Request (validation), 401 Unauthorized, 403 Forbidden, 404, 500 (log incident)

### Testing
- Unit test: utilities, validators, formatting functions
- Integration test: auth flow, thread CRUD, moderation actions
- E2E test: user journey (sign up → create thread → comment → resolve)
- Minimum coverage: 70% for critical paths (auth, moderation)

---

## Data Model Highlights

(Full schema in `prisma/schema.prisma`)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique @db.VarChar(50)
  passwordHash  String?   // nullable if OAuth
  name          String?
  bio           String?   @db.VarChar(250)
  avatar_url    String?   // Cloudinary URL
  banner_url    String?
  classId       String?   // FK to Class (students join classes)
  role          Role      @default(STUDENT)  // STUDENT, MODERATOR, ADMIN
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  threads       Thread[]
  comments      Comment[]
  materials     Material[]
}

model Class {
  id        String   @id @default(cuid())
  name      String   @db.VarChar(100)
  code      String   @unique @db.VarChar(20)
  users     User[]
  threads   Thread[]
  materials Material[]
}

model Thread {
  id          String    @id @default(cuid())
  title       String    @db.VarChar(200)
  content     String    @db.Text
  authorId    String
  author      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  classId     String?   // Null = Global
  class       Class?    @relation(fields: [classId], references: [id])
  isPinned    Boolean   @default(false)
  status      ThreadStatus @default(OPEN)  // OPEN, RESOLVED, CLOSED
  flagCount   Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  comments    Comment[]
  flags       Flag[]
}

model Comment {
  id        String   @id @default(cuid())
  content   String   @db.Text
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  threadId  String
  thread    Thread   @relation(fields: [threadId], references: [id], onDelete: Cascade)
  parentId  String?  // Null = top-level; else reply to comment
  parent    Comment? @relation("CommentTree", fields: [parentId], references: [id], onDelete: Cascade)
  children  Comment[] @relation("CommentTree")
  status    CommentStatus @default(APPROVED)  // APPROVED, PENDING, REJECTED
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Material {
  id         String   @id @default(cuid())
  title      String   @db.VarChar(200)
  description String? @db.VarChar(500)
  category   String   // slide, video, artikel, soal
  fileUrl    String?  // Cloudinary
  link       String?  // External URL
  authorId   String
  author     User     @relation(fields: [authorId], references: [id])
  classId    String?  // Null = Global
  class      Class?   @relation(fields: [classId], references: [id])
  createdAt  DateTime @default(now())
}

model Flag {
  id        String  @id @default(cuid())
  reason    String  @db.VarChar(100)
  threadId  String
  thread    Thread  @relation(fields: [threadId], references: [id], onDelete: Cascade)
  userId    String
  user      User    @relation(fields: [userId], references: [id])
  status    FlagStatus @default(PENDING)  // PENDING, APPROVED, REJECTED
  createdAt DateTime @default(now())
  @@unique([threadId, userId])  // One flag per user per thread
}

enum Role { STUDENT MODERATOR ADMIN }
enum ThreadStatus { OPEN RESOLVED CLOSED }
enum CommentStatus { APPROVED PENDING REJECTED }
enum FlagStatus { PENDING APPROVED REJECTED }
```

**Key Rules**
- Thread & Material: `classId` **optional** (NULL = global, visible to all classes)
- Comment: **Max 4 levels deep** (enforced in validation before insert)
- User.classId: student's main class; can view materials from other classes but threads are class-scoped
- Status enum: enforced DB-side, no raw strings

---

## Security Rules

### Authentication & Authorization
- Auth via Auth.js: session cookie (secure, httpOnly, sameSite=Lax)
- Role-based access: STUDENT (read), MODERATOR (approve/reject), ADMIN (full)
- Check `session?.user?.role` server-side before modifying threads

### Input Validation & Database
- **Server**: Always re-validate with Zod schema (client can be bypassed)
- Content sanitization: strip HTML tags server-side; store plain text
- Rate-limit API routes: 10 req/min per IP for posting (prevent spam)
- Prisma parameterized queries only — never string interpolation
- Neon: enforce SSL connections (`sslmode=require`)
- Secrets: `DATABASE_URL`, `AUTH_SECRET`, `ABLY_API_KEY`, `CLOUDINARY_SECRET` in `.env.local` only

### File Upload
- Whitelist: JPG, PNG, WebP only (validate MIME type server-side)
- Size cap: 10 MB per file, enforced server-side
- Cloudinary config: private folder, transformation only
- Webhook: verify signature with shared secret (HMAC-SHA256)

### Content Moderation
- Flag system: user can flag thread (reason: spam, inappropriate, off-topic)
- Soft delete: content marked `status = REJECTED`, not hard-deleted (audit trail)
- Auto-flag triggers: >2 external links, >10 mentions, explicit keyword list

---

## Image Upload & Cloudinary Flow

**Client-side**
1. User selects file; validate size ≤ 10 MB, MIME in [image/jpeg, image/png, image/webp]
2. Show crop UI (1:1 aspect), preview 160×160px
3. Call `/api/upload` for presigned URL

**Server-side (/api/upload)**
1. Verify `session` is authenticated
2. Generate presigned Cloudinary URL (server-secret only)
3. Return URL + public_id to client

**Client Upload to Cloudinary**
1. POST file to presigned URL (direct)
2. Get `secure_url` from Cloudinary response
3. Call `/api/profile` Server Action to save avatar_url to User

**Cloudinary Webhook**
- Listen on `/api/upload/webhook`
- Verify HMAC signature
- Sync User.avatar_url if transform completes

---

## UI Building Rules

**Before Any Component**
1. Read `DESIGN.md` for palette, spacing, type scale, specs
2. Build in shadcn/ui when possible (Button, Input, Card, Dialog)
3. Extend Tailwind config with DESIGN.md tokens
4. Use CSS custom properties for theming

**Component States**
- Every interactive element: default, hover, active, focus, disabled, loading
- Focus: outline `2px solid terracotta` with 2px offset
- Loading: show spinner (Lucide `<Loader2 className="animate-spin" />`)
- Error: red border + error message below input

**Responsive Design**
- Mobile-first: base styles, `@media (min-width: 640px)` for tablet+
- Breakpoints: 640px (tablet), 1024px (desktop)
- Touch target: ≥ 44×44px minimum
- Tap-friendly spacing: ≥ 8px between interactive elements

**Animation & Accessibility**
- Use GSAP for complex tweens (thread entrance, modal open)
- Use Tailwind `animate-*` for simple transitions
- Respect `prefers-reduced-motion` via Tailwind `motion-safe:` prefix
- Keep animations ≤ 300ms
- Semantic HTML: `<button>`, `<label>`, `<h1–h6>`, landmarks
- ARIA: `aria-label` for icon buttons, `aria-live="polite"` for notifications
- Keyboard: Tab order natural, Enter/Space trigger buttons, ESC closes modals

---

## Workflow & Feature Development

### Anti-Slop During Development
1. Install: `npx antislop-ai` (pick skills: antislop, antislop-ui, antislop-copywriting, antislop-human, antislop-layoutmobile)
2. Mode: "during" — filter active as you build
3. At completion: run Delivery Gate (`antislop --check`) before ship

### Per-Feature Checklist
- [ ] Feature scoped (one small piece, e.g., "Thread create form")
- [ ] Data model updated in `schema.prisma`, migration created
- [ ] Server Action or Route Handler written + Zod validation
- [ ] Component built, states handled (loading, error, empty)
- [ ] Mobile-responsive tested at 375px, 768px, 1920px
- [ ] Keyboard navigation works (Tab, Enter, ESC)
- [ ] Anti-slop Delivery Gate passed
- [ ] Tests written (unit + integration)
- [ ] Merge to `main`, deploy to staging

### Testing Strategy
```bash
npm run test              # Vitest: lib/, validators, auth logic
npm run test:e2e          # Playwright: user flow (sign up → create thread)
```

---

## Definition of Done (DoD)

A feature is **done** when:

1. ✅ **Code** — Builds without error, lints cleanly, TypeScript strict, no `any` types
2. ✅ **Tests** — Unit tests, integration tests, coverage ≥ 70%
3. ✅ **Anti-Slop** — Ran Delivery Gate, passed all blocks (no slop, no fake data, natural copy)
4. ✅ **Design System** — Bahasa Indonesia text, colors from palette, spacing 8px grid, responsive (375/768/1920px)
5. ✅ **Accessibility** — Focus visible, keyboard nav, WCAG AA contrast, semantic HTML
6. ✅ **Security** — No secrets in code, input validated server-side, Prisma parameterized queries, auth checked
7. ✅ **Performance** — LCP ≤ 2.5s, CLS ≤ 0.1, Server Components, images optimized
8. ✅ **Documentation** — Code comments on "why", JSDoc for Server Actions, DB schema documented

---

## Quick Start

```bash
# Clone + install
git clone <repo>
cd platform-diskusi
npm install

# Setup environment
cp .env.example .env.local
# Fill: DATABASE_URL, AUTH_SECRET, ABLY_API_KEY, CLOUDINARY_* keys

# Migrate database
npm run db:push

# Run dev server
npm run dev

# Read DESIGN.md, AGENTS.md, then start first feature
```

---

**Last Updated**: 2026-11-02

