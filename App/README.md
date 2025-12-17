# Sistema de Controle de Estoque  
## Lar São Vicente de Paulo

Este repositório contém o código-fonte de um **Sistema de Controle de Estoque** desenvolvido como **Projeto Integrador da FATEC**, com foco nas necessidades reais do *Lar São Vicente de Paulo*.

O sistema foi projetado para resolver problemas complexos de logística interna, como:

- Controle rigoroso de **validade de alimentos**
- Distinção clara entre itens **comprados** e **doados**
- Rastreabilidade completa de **lotes físicos**


# Sistema de Controle de Estoque  
## Lar São Vicente de Paulo

Este repositório contém o código-fonte de um **Sistema de Controle de Estoque** desenvolvido como **Projeto Integrador da FATEC**, com foco nas necessidades reais do *Lar São Vicente de Paulo*.

O sistema foi projetado para resolver problemas complexos de logística interna, como:

- Controle rigoroso de **validade de alimentos**
- Distinção clara entre itens **comprados** e **doados**
- Rastreabilidade completa de **lotes físicos**
- Movimentação segura entre **Estoque Central** e **Cozinha**

---



##  Equipe de Desenvolvimento

Projeto acadêmico desenvolvido por:

- Gustavo Germano Lemos Pereira  - gustavo.germanolemos@gmail.com
- José Roberto Lisboa da Silva Filho - jlisboa600@gmail.com
- Kaique Alves Mesquita - kaiquealvesmesquita@gmail.com
- Lucas Feitosa Almeida Rocha - lucasfarocha44@gmail.com
- Luiz Filipe de Camargo - luizfilipedecamargo@gmail.com

 **Instituição:** FATEC  
 **Disciplina:** Projeto Integrador  

---

##  Tecnologias Utilizadas

O sistema adota uma arquitetura moderna, com **separação total entre Backend e Frontend**, facilitando manutenção, escalabilidade e evolução do projeto.

### Backend

- **Java** (JDK 17+)
- **Spring Boot** (Framework principal)
- **Spring Data JPA** (Persistência de dados)
- **Banco de Dados:** PostgreSQL 
- **Porta Padrão:** `8080`

### Frontend

- **Angular 19.2**
- **Standalone Components**
- **TypeScript**
- **Porta Padrão:** `4200`

---

##  Arquitetura do Sistema

O projeto segue princípios de:

- Arquitetura em **camadas**
- **Separação de responsabilidades**
- **Domínio rico**, com regras de negócio bem definidas
- Facilidade de integração com leitores de **código de barras (EAN)**

---

##  Lógica de Negócio e Estrutura de Dados

Um dos grandes diferenciais do sistema é a **modelagem de dados orientada à rastreabilidade física**, evitando redundâncias e inconsistências.

A estrutura é dividida em três níveis principais:

###  Categorias (Abstração)

Representam o conceito genérico do item.

**Exemplos:**
- Arroz Branco  
- Leite Integral  
- Feijão Carioca  

Responsabilidades:
- Definição de **estoque mínimo**
- Definição de **estoque máximo**
- Agrupamento lógico de produtos

---

###  Produtos (Definição)

São os itens cadastrados com especificações técnicas, sem validade associada.

**Atributos principais:**
- Código de barras (EAN)
- Marca
- Unidade de medida (Kg, L, Unidade)

**Exemplo:**  
> Arroz Tio João 5kg → Categoria: *Arroz Branco*

---

###  Unidades (Físico)

Representam o **lote físico real** que entra no estoque.

Aqui residem as informações críticas:
- Data de validade
- Lote
- Origem (**Doação** ou **Compra**)
- Quantidade disponível

O sistema permite múltiplas unidades do mesmo produto, cada uma com validade e lote próprios.

---

##  Funcionalidades Principais

###  Gestão de Estoque

- **Entrada Inteligente** via leitor de código de barras
- Detecção automática de produtos existentes
- Cadastro simplificado para novos lotes
- Controle de **origem** (Doação x Compra)
- Movimentação entre:
  - Estoque Central
  - Cozinha

---

###  Alertas e Monitoramento

- Controle de validade com priorização **PEPS (FIFO)**
- Alertas para itens próximos do vencimento
- Avisos automáticos de:
  - Estoque mínimo
  - Estoque acima do limite

---

###  Relatórios

- Relatórios de entradas e saídas
- Relatórios de perdas e vencimentos
- Inventário atualizado em tempo real
- Apoio à prestação de contas e auditoria

---

##  Como Executar o Projeto

### 🔹 Pré-requisitos

- Java JDK 17+
- Node.js (LTS) + NPM
- Banco de dados PostgreSQL ou MySQL

---

### 🔹 Backend

```bash
# Acesse a pasta do backend
cd backend/InventoryManagement

# Configure o banco em:
src/main/resources/application.properties

# Execute a aplicação
mvnw clean install

```

Backend disponível em:  
- http://localhost:8080

---

Swagger do backend disponível em:  
- http://localhost:8080/swagger-ui/index.html


---

### 🔹 Frontend

```bash

# Acesse a pasta do frontend
cd frontend/Estoque_WebApp

# Instale as dependências
npm install

# Execute a aplicação
ng serve
```

Frontend disponível em:  
 http://localhost:4200

---



## Licença

Projeto acadêmico sem licença específica.

Este repositório foi desenvolvido como atividade acadêmica na FATEC e, no momento, não possui uma licença de código aberto aplicada. Os autores não concederam autorização explícita para reutilização, modificação ou distribuição; portanto, considere que todos os direitos estão reservados aos autores até que uma licença seja adicionada.



