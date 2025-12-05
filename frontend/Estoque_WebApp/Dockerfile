# --- Estágio 1: Build (Compilação do Angular) ---
FROM node:18-alpine AS build
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código fonte
COPY . .

# Gera o build de produção
RUN npm run build -- --configuration production

# --- Estágio 2: Servidor Web (Nginx) ---
FROM nginx:alpine

# Copia o arquivo de configuração customizado do Nginx (veja abaixo)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos gerados pelo Angular para a pasta do Nginx
# ATENÇÃO: Verifique se o caminho 'dist/nome-do-seu-projeto/browser' está correto.
# Em versões mais novas do Angular (17+), costuma ser dist/nome-do-projeto/browser.
# Em versões antigas, era apenas dist/nome-do-projeto.
COPY --from=build /app/dist/estoque-web-app/browser /usr/share/nginx/html

# Expõe a porta 80 (padrão web)
EXPOSE 4200

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]