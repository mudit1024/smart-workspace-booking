FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar workspace-service-0.0.1-SNAPSHOT.jar

EXPOSE 8080

CMD ["java", "-jar", "workspace-service-0.0.1-SNAPSHOT.jar"]