# Stage 1: Build the app
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .

# 🔥 ADD THIS LINE
RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

# Stage 2: Run the app
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

ENV PORT=10000
EXPOSE $PORT

CMD ["java", "-jar", "app.jar"]