#!/bin/bash
set -e

echo "=== Init Next.js 14 (TypeScript strict) ==="
npm create next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-git \
  --no-src-dir \
  --import-alias "@/*" << EOF
Y
N
Y
EOF

echo "=== Install dependencies ==="
npm install \
  @hookform/resolvers \
  react-hook-form \
  zod \
  @prisma/client \
  prisma \
  next-auth@beta \
  bcryptjs \
  gsap \
  clsx \
  tailwind-merge

npm install -D \
  @types/bcryptjs \
  @testing-library/react \
  @testing-library/jest-dom \
  vitest \
  @vitest/ui \
  @playwright/test

echo "=== Setup Prisma ==="
npx prisma init --datasource-provider postgresql

echo "=== Install shadcn/ui ==="
npx shadcn-ui@latest init -y

echo "✅ Setup selesai. Edit .env.local dengan Neon URLs."
