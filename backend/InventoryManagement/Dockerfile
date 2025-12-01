# --- Estágio 1: Build (Compilação) ---
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copia apenas o pom.xml primeiro para cachear as dependências
COPY pom.xml .
# Baixa as dependências (isso evita baixar tudo de novo se só o código mudar)
RUN mvn dependency:go-offline

# Copia o código fonte
COPY src ./src

# Compila o projeto e gera o .jar (pula os testes para agilizar o build de produção)
RUN mvn clean package -DskipTests

# --- Estágio 2: Runtime (Execução) ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copia o .jar gerado no estágio anterior
# O nome do jar pode variar, o wildcard *.jar pega qualquer um
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta padrão do Spring Boot
EXPOSE 8080

# Comando para iniciar a aplicação
# Passamos parâmetros para aceitar variáveis de ambiente da AWS
ENTRYPOINT ["java", "-jar", "app.jar"]