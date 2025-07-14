# Stage 1: compile the app
FROM gradle AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle bootjar --no-daemon

# Stage 2: prepare the container
FROM eclipse-temurin:21-jre-alpine

# Create directory
RUN mkdir /app

# Copy generated JAR
# Copiar el JAR generado desde la etapa de construcción a la imagen de producción
COPY --from=build /home/gradle/src/build/libs/*.jar /app/catalog-service.jar

ENTRYPOINT ["java", "-jar", "/app/catalog-service.jar"]