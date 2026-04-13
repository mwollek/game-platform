FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl

FROM base AS deps
WORKDIR /app
ENV HUSKY=0
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm install

FROM base AS builder
WORKDIR /app
ENV HUSKY=0
ENV AUTH_SECRET=docker-build-placeholder-at-least-32-characters-long
ENV DATABASE_URL=postgresql://gameplatform:gameplatform@localhost:5432/gameplatform
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

CMD ["node", "server.js"]
