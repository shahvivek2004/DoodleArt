FROM node:24-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./turbo.json ./turbo.json

COPY ./packages/typescript-config ./packages/typescript-config

COPY ./packages/db/package.json ./packages/db/package.json
COPY ./packages/db/tsconfig.json ./packages/db/tsconfig.json

COPY ./apps/ws-backend/package.json ./apps/ws-backend/package.json
COPY ./apps/ws-backend/tsconfig.json ./apps/ws-backend/tsconfig.json
COPY ./apps/ws-backend/turbo.json ./apps/ws-backend/turbo.json

RUN pnpm install --frozen-lockfile

COPY ./packages/db/prisma ./packages/db/prisma
COPY ./packages/db/src ./packages/db/src

COPY ./apps/ws-backend/src ./apps/ws-backend/src

RUN pnpm db:generate
RUN pnpm build


FROM node:24-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./turbo.json ./turbo.json

COPY ./packages/typescript-config ./packages/typescript-config

COPY ./packages/db/package.json ./packages/db/package.json

COPY ./apps/ws-backend/package.json ./apps/ws-backend/package.json
COPY ./apps/ws-backend/turbo.json ./apps/ws-backend/turbo.json

RUN pnpm install --prod --frozen-lockfile

COPY ./packages/db/prisma ./packages/db/prisma
COPY ./packages/db/src ./packages/db/src

COPY --from=builder /app/apps/ws-backend/dist ./apps/ws-backend/dist

COPY --from=builder /app/node_modules/.pnpm/@prisma+client@6.12.0_prisma@6.12.0_typescript@5.9.3__typescript@5.9.3/ ./node_modules/.pnpm/@prisma+client@6.12.0_prisma@6.12.0_typescript@5.9.3__typescript@5.9.3/

EXPOSE 8080

CMD ["pnpm","start:ws"]
