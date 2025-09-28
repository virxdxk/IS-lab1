# ====== build stage ======
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Если Vite: npm run build кладёт в /dist
# Если CRA: сборка в /build — nginx конфиг ниже уже учитывает /dist.
RUN npm run build

# ====== run stage ======
FROM nginx:1.27-alpine
# Конфиг nginx для SPA + прокси на бэкенд
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Копируем статические файлы (Vite -> dist)
COPY --from=builder /app/dist /usr/share/nginx/html
# Если у тебя CRA (react-scripts), то замени предыдущую строку на:
# COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
