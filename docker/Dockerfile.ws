FROM node:22-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /usr/src/app

# Copy package files
COPY ./packages ./packages
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./package.json ./package.json
COPY ./turbo.json ./turbo.json
COPY ./apps/ws-backend ./apps/ws-backend

# Install dependencies
RUN pnpm install

# Generate database (assuming this is a Prisma command or similar)
RUN pnpm run db:generate

EXPOSE 8080

# Start the backend
CMD ["pnpm", "start:ws"]