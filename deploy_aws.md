# 🚀 Guia de Deploy AWS (EC2 + Docker)

## Projeto Integrador – Estoque_LSVP

Este guia cobre o **passo a passo completo** para configurar o servidor na **AWS (EC2)** e subir a aplicação **Estoque_LSVP** utilizando **Docker**.

---

## 1️⃣ Criação e Configuração da Instância (AWS Console)

### 🔹 1. Lançar Instância

1. Acesse o **EC2 Dashboard** na AWS.
2. Clique em **Launch Instance**.
3. **Name:** `Estoque_SEUNOME`
4. **OS Images:** Amazon Linux 2023
5. **Instance Type:** `t2.micro` (Free Tier)
6. **Key Pair:** `vockey` (ambiente do laboratório)

---

### 🔹 2. Configurar Firewall (Security Group)

Em **Network settings**, marque **Create security group** e adicione as seguintes **Inbound Rules**:

| Tipo       | Porta | Origem    | Descrição              |
| ---------- | ----- | --------- | ---------------------- |
| SSH        | 22    | 0.0.0.0/0 | Acesso ao servidor     |
| Custom TCP | 8080  | 0.0.0.0/0 | Backend Spring Boot    |
| Custom TCP | 4200  | 0.0.0.0/0 | Angular Dev (opcional) |
| HTTP       | 80    | 0.0.0.0/0 | Frontend em Produção   |

---

### 🔹 3. Configurar IP Fixo (Elastic IP)

Necessário para evitar mudança de IP ao reiniciar a instância.

1. Menu lateral → **Network & Security** → **Elastic IPs**
2. Clique em **Allocate Elastic IP address** → **Allocate**
3. Selecione o IP → **Actions** → **Associate Elastic IP address**
4. Associe à instância criada

> ⚠️ **IMPORTANTE:** Anote o IP (ex: `54.207.x.x`). Ele será usado no Frontend.

---

## 2️⃣ Configuração do Servidor (Terminal)

Conecte-se à instância via **EC2 Instance Connect**.

---

### 🔹 Passo A – Instalação das Ferramentas

```bash
# Atualizar sistema e instalar Git e Docker
sudo dnf update -y
sudo dnf install -y git docker
sudo systemctl start docker
sudo systemctl enable docker

# Adicionar usuário ao grupo docker
sudo usermod -aG docker ec2-user

# Instalar Docker Compose (v2.24.0)
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalação
docker --version
docker-compose --version
```

---

### 🔹 Passo B – Configurar Memória Swap (**CRÍTICO**)

A instância `t2.micro` possui apenas **1GB de RAM**.

```bash
sudo dd if=/dev/zero of=/swapfile bs=128M count=16
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
```

> 💡 **Dica:** Após isso, digite `exit` e conecte novamente ao terminal.

---

## 3️⃣ Deploy do Projeto

### 🔹 1. Clonar a Branch `develop`

```bash
git clone -b develop https://github.com/KaiqueAMesquita/Estoque_LSVP.git
cd Estoque_LSVP
```

---

### 🔹 2. Configurar IP no Frontend (**OBRIGATÓRIO**)

#### a) Ambiente de Produção

```bash
nano frontend/Estoque_WebApp/src/environments/environment.prod.ts
```

```ts
export const environment = {
  production: true,
  API_URL: "http://SEU_ELASTIC_IP:8080/api",
  TOKEN_KEY: "Centro_Paula_Souza_Token"
};
```

Salvar: **Ctrl + O** → **Enter**
Sair: **Ctrl + X**

---

#### b) Ambiente de Desenvolvimento (Prevenção)

```bash
nano frontend/Estoque_WebApp/src/environments/environment.development.ts
```

> Altere o IP da mesma forma.

---

### 🔹 3. Subir a Aplicação

```bash
sudo docker-compose up -d --build
```

⏳ A primeira execução pode demorar alguns minutos.

---

## 4️⃣ Manutenção e Atualizações

Sempre que houver atualização no GitHub, utilize o procedimento abaixo:

```bash
# Atualizar código
git pull

# Parar containers
sudo docker-compose down

# Remover imagens antigas (IMPORTANTE para o Angular atualizar)
sudo docker rmi estoque_lsvp-frontend estoque_lsvp-backend

# Build limpo e novo deploy
sudo docker-compose build --no-cache
sudo docker-compose up -d
```

---

## 5️⃣ Links de Acesso

* 🌐 **Sistema Web:**
  `http://SEU_ELASTIC_IP`

* 📘 **Swagger (API):**
  `http://SEU_ELASTIC_IP:8080/swagger-ui/index.html`

---

✅ **Deploy finalizado com sucesso!**
