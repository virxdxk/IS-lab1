# ====== build stage ======
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app

# Кэшируем зависимости Gradle
COPY gradlew settings.gradle build.gradle ./
COPY gradle gradle
# Если мульти-модуль — добавь backend/build.gradle:
COPY backend/build.gradle backend/build.gradle

# Подтянуть зависимости (ускоряет последующие сборки)
RUN ./gradlew --no-daemon build -x test || true

# Теперь весь код
COPY . .

# Собираем только бэкенд-джар
RUN ./gradlew --no-daemon :backend:bootJar

# ====== run stage ======
FROM eclipse-temurin:17-jre
WORKDIR /app
# Безопасный пользователь
RUN useradd -ms /bin/bash spring
USER spring

# Копируем собранный jar
COPY --from=builder /app/backend/build/libs/*.jar app.jar

EXPOSE 8080
# Пробрасываем настройки БД через env
ENV JAVA_OPTS=""
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]
