# syntax=docker/dockerfile:1

########### build stage ###########
FROM node:20-alpine AS builder
WORKDIR /app

# Важно: в build-стадии не режем dev-зависимости
ENV NODE_ENV=development

# Сначала только манифесты — для кэша
COPY package*.json ./

# Ставим prod + dev зависимости (нужно для tailwind/postcss)
RUN npm ci --include=dev

# Теперь весь исходник
COPY . .

# Сборка Vite -> /app/dist
RUN npm run build


########### run stage ###########
FROM nginx:1.27-alpine AS runner

# Прод-окружение в рантайме
ENV NODE_ENV=production

# Твой конфиг nginx (SPA + прокси на бэкенд, если настроено в nginx.conf)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Готовые статики из билдера
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
