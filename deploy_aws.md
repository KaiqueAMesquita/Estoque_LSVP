# 🚀 Guia de Deploy AWS (EC2 + Docker) - Projeto Integrador

Este guia cobre o passo a passo completo para configurar o servidor na AWS e subir a aplicação `Estoque_LSVP` utilizando Docker.

---

## 1. Criação e Configuração da Instância (AWS Console)

### 1. Lançar Instância
1. Acesse o **EC2 Dashboard** na AWS e clique no botão laranja **Launch Instance**.
2. **Name:** Digite um nome para o servidor (ex: `Estoque_SEUNOME`).
3. **OS Images:** Selecione **Amazon Linux 2023**.
4. **Instance Type:** Selecione `t2.micro` (Elegível ao nível gratuito/Free tier).
5. **Key Pair:** Selecione a chave `vockey` (do ambiente do laboratório).

### 2. Configurar Firewall (Security Group)
1. Em "Network settings", certifique-se de que a opção "Create security group" está marcada.
2. Adicione as seguintes **Inbound Rules** (Regras de Entrada):
    * **SSH (22):** `0.0.0.0/0` (Para acessar o terminal)
    * **Custom TCP (8080):** `0.0.0.0/0` (Backend Spring Boot)
    * **Custom TCP (4200):** `0.0.0.0/0` (Porta Dev Angular - Opcional)
    * **HTTP (80):** `0.0.0.0/0` (Frontend Produção Nginx - **Obrigatório**)

### 3. Configurar IP Fixo (Elastic IP)
Isso é necessário para que o IP do seu site não mude se o servidor reiniciar.

1. No menu lateral esquerdo do EC2, vá em **Network & Security** -> **Elastic IPs**.
2. Clique no botão laranja **Allocate Elastic IP address** -> Clique em **Allocate**.
3. Selecione o IP que apareceu na lista, clique em **Actions** -> **Associate Elastic IP address**.
4. Em "Instance", escolha a instância que você acabou de criar e clique em **Associate**.
> ⚠️ **IMPORTANTE:** Anote este número de IP (Ex: `54.207.x.x`). Você precisará dele no Passo 3.

---

## 2. Configuração do Servidor (Terminal)

Conecte-se à sua instância (clique em "Connect" > aba "EC2 Instance Connect" > botão "Connect").

### Passo A: Instalação das Ferramentas
Copie todo o bloco de código abaixo e cole no terminal (`Ctrl + Shift + V`):

```bash
# 1. Atualizar sistema e instalar Git e Docker
sudo dnf update -y
sudo dnf install -y git docker
sudo systemctl start docker
sudo systemctl enable docker

# 2. Adicionar seu usuário ao grupo do docker
sudo usermod -aG docker ec2-user

# 3. Instalar Docker Compose (Versão v2.24.0)
sudo curl -L "[https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname](https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname) -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Verificar se instalou corretamente
docker --version
docker-compose --version
Passo B: Configurar Memória Swap (CRÍTICO)
Como a máquina t2.micro tem pouca memória RAM (1GB), precisamos criar uma memória virtual (Swap) para o deploy não travar. Rode os comandos abaixo:

Bash

sudo dd if=/dev/zero of=/swapfile bs=128M count=16
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
Dica: Após rodar isso, digite exit e conecte novamente no terminal para garantir que as permissões do Docker foram aplicadas.

3. Deploy do Projeto (Baixar e Configurar)
1. Clonar a Branch Develop
Vamos baixar a versão de desenvolvimento do projeto:

Bash

git clone -b develop [https://github.com/KaiqueAMesquita/Estoque_LSVP.git](https://github.com/KaiqueAMesquita/Estoque_LSVP.git)

# Entrar na pasta do projeto
cd Estoque_LSVP
2. Configurar o IP no Frontend (OBRIGATÓRIO)
O Frontend precisa saber qual é o IP do servidor para conectar no Backend.

a. Edite o arquivo de produção:

Bash

nano frontend/Estoque_WebApp/src/environments/environment.prod.ts
b. Altere a linha API_URL: Use as setas do teclado para navegar. Apague o IP antigo e coloque o seu Elastic IP. Mantenha o :8080/api no final.

TypeScript

export const environment = {
  production: true,
  // COLOQUE O SEU ELASTIC IP AQUI ABAIXO:
  API_URL: "http://SEU_NUMERO_DE_IP:8080/api", 
  TOKEN_KEY: "Centro_Paula_Souza_Token"
};
Para Salvar: Aperte Ctrl + O e depois Enter.

Para Sair: Aperte Ctrl + X.

c. Edite o arquivo de desenvolvimento também (Prevenção):

Bash

nano frontend/Estoque_WebApp/src/environments/environment.development.ts
(Faça a mesma alteração do IP neste arquivo).

3. Subir a Aplicação
Agora que o IP está configurado, inicie os containers:

Bash

sudo docker-compose up -d --build
Isso pode levar alguns minutos na primeira vez.

4. Manutenção e Atualizações (Como atualizar o site)
Sempre que alguém atualizar o código no GitHub e você precisar puxar para a AWS, siga este procedimento de "Limpeza Nuclear". Isso evita erros de cache e portas presas.

Copie e cole os comandos abaixo na ordem:

Bash

# 1. Baixar as novidades do Git
git pull

# 2. Derrubar e limpar containers antigos
sudo docker-compose down

# 3. Apagar imagens antigas (Obrigatório para o Angular atualizar o IP)
sudo docker rmi estoque_lsvp-frontend estoque_lsvp-backend

# 4. Construir e subir tudo do zero
sudo docker-compose build --no-cache
sudo docker-compose up -d
5. Links de Acesso
Após o deploy terminar, acesse:

Sistema Web: http://SEU_ELASTIC_IP

Documentação API (Swagger): http://SEU_ELASTIC_IP:8080/swagger-ui/index.html