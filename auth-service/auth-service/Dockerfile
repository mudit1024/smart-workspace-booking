
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar auth-service-0.0.1-SNAPSHOT.jar


EXPOSE 8080

CMD ["java", "-jar", "auth-service-0.0.1-SNAPSHOT.jar"]