FROM node:lts-alpine AS builder
RUN apk update && apk upgrade && apk add --no-cache \
  make \
  g++ \
  python3
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM node:lts-alpine AS runner
WORKDIR /app
COPY --from=builder /app /app
CMD ["npm", "start"]
