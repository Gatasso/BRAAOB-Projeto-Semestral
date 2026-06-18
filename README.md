# arrumaÍF

> Sejam bem vindos ao arrumaÍF, o Sistema de reportes em reparos do IFSP - Bragança Paulista

## 📌 O que é o arrumaÍF

O arrumaíF é um sistema web e mobile desenvolvido para suprir a falta de 
um canal oficial no IFSP-BRA que dê autonomia para alunos, professores e 
servidores reportarem defeitos e problemas em equipamentos e mobiliários 
no cotidiano do campus. O sistema centraliza os reportes, agiliza a 
providência de reparos pela equipe de manutenção e estabelece um fluxo 
transparente de comunicação.

## 🚦 Status

<img src="https://img.shields.io/badge/version-1.0.0-blue" alt="version" /> <img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow" alt="status" />

## 🛣️ Roadmap

- [ ✅ ] Especifiação Funcional 
- [ ✅ ] Protótipos de Telas
- [ ✅ ] Schema Banco de Dados
- [ ✅ ] API Backend
- [ ⏳ ] Front-End
- [ ⏳ ] Aplicativo Mobile 


## 🎯 Objetivos

- Centralizar a criação e oficialização de reportes de manutenção em 
  uma única ferramenta.
- Agilizar a identificação, localização e solução de problemas por parte 
  da equipe de mantenedores.
- Garantir transparência permitindo que os autores dos reportes acompanhem em tempo real o status dos equipamentos afetados.
- Promover melhores interações entre atores da instituição, acolhimento de frustrações, e, consequentemente, melhorar a qualidade de ensino dos alunos.

## 🧩 Problemas que o arrumaÍF atende

Atualmente, a alta rotação de pessoas no campus gera desgastes e defeitos 
em equipamentos e salas de aula. A ausência de um canal oficial gera 
processos longos e burocráticos de reporte (exigindo intermediação de 
professores via e-mails sem respostas rápidas), causando estresse, 
atrasos crônicos na manutenção e falta de visibilidade sobre o andamento 
dos consertos.

## 💡 Solução Proposta

- Um sistema multiplataforma (Web e Mobile) baseado no modelo cliente-servidor. 
Ele permite que a comunidade acadêmica registre chamados de falhas de 
infraestrutura em poucos passos (selecionando bloco/sala, tipo de material 
e defeito), gerando um histórico público de auditoria imutável e permitindo 
contestações caso o problema persista.

## ✅ Funcionalidades
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Descrição</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>RF01</td>
            <td>Registro de Solicitação: Criação e edição de chamados especificando o Equipamento/Mobiliário, Tipo do Defeito e Descrição opcional.</td>
        </tr>
        <tr>
            <td>RF02</td>
            <td>Consulta de Solicitações: Visualização da listagem de chamados criados pelo usuário com status e histórico cronológico.</td>
        </tr>
        <tr>
            <td>RF03</td>
            <td>Gestão de Status: Alteração controlada do ciclo de vida do chamado pela equipe técnica.</td>
        </tr>
        <tr>
            <td>RF04</td>
            <td>Encerramento com Diagnóstico: Obrigatoriedade de preenchimento dos campos técnicos de Causa e Solução ao finalizar um chamado.</td>
        </tr>
        <tr>
            <td>RF05</td>
            <td>Contestação de Resolução: Permite reabrir a discussão caso o reparo não atinja o resultado esperado.</td>
        </tr>
        <tr>
            <td>RF06</td>
            <td>Log de Auditoria: Registro automatizado, sistêmico e imutável de cada transição de status.</td>
        </tr>
    </tbody>
</table>

<!-- ## 🖼️ Demonstração

- [Espaço para imagens, GIFs ou links de vídeo]
- [Exemplo de uso ou fluxo visual] -->

## 🧰 Tecnologias Utilizadas

<table>
    <thead>
        <tr>
            <th>Tecnologia</th>
            <th>Uso no Projeto</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><img src="https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white" alt="Figma" /> </td>
            <td>Ferramenta utilizada para prototipação e design das interfaces do sistema. Permite a criação de componentes reutilizáveis, definição de fluxos de navegação, validação de ideias e simulação da experiência do usuário antes da implementação.</td>
        </tr>
        <tr>
            <td><img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" alt="React" /></td>
            <td>Utilizado no desenvolvimento da interface web, adotando uma arquitetura baseada em componentes reutilizáveis. Proporciona maior organização do código, facilidade de manutenção e suporte à construção de interfaces responsivas e escaláveis.</td>
        </tr>
        <tr>
            <td><img src="https://img.shields.io/badge/Flutter-02569B?logo=flutter&logoColor=white" alt="Flutter" /></td>
            <td>Utilizado no desenvolvimento da aplicação mobile multiplataforma, permitindo a criação de uma única base de código para dispositivos Android e iOS. Sua arquitetura baseada em widgets facilita a reutilização de componentes e garante uma experiência consistente entre plataformas.</td>
        </tr>
        <tr>
            <td><img src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white" alt="Python" /></td>
            <td>Linguagem utilizada no desenvolvimento do backend devido à sua simplicidade, produtividade e ampla adoção pela comunidade. Com o auxílio do microframework <img src="https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white" alt="Flask" />, foi desenvolvida uma API REST responsável por intermediar a comunicação entre as aplicações cliente e o banco de dados, além de gerenciar regras de negócio e autenticação.</td>
        </tr>
        <tr>
            <td><img src="https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" /> </td>
            <td>Plataforma utilizada para hospedagem e gerenciamento do banco de dados PostgreSQL, fornecendo recursos de armazenamento, autenticação e integração com a aplicação. Sua infraestrutura gerenciada simplifica a configuração do ambiente e acelera o desenvolvimento do projeto.</td>
        </tr>
    </tbody>
</table>

## 🏗️ Arquitetura do Sistema

A aplicação adota o modelo Cliente-Servidor dividido logicamente em 
três camadas:
1. Camada de Apresentação (Client Side): Interfaces Web (React) e Mobile nativa (Flutter) que fazem requisições HTTP (REST/JSON).
2. Camada de Negócio / Serviços (Server Side): API Flask (Python) 
   centralizando o processamento, roteamento, validação e orquestração de regras.
3. Camada de Dados (Persistência): Ecossistema Supabase operando o 
   PostgreSQL (substituindo a intenção inicial do MySQL), além de 
   microsserviços nativos de Autenticação (Auth) e Armazenamento 
   de mídia (Storage).

<!-- ## 📊 Modelagem e Diagramas

- [Incluir modelo conceitual, diagramas de arquitetura, ERD, fluxos, etc.]

## 📚 Documentação da API

- [Link ou seção para endpoints disponíveis]
- [Formato de requisição e resposta]
- [Autenticação, headers e exemplos]

## 🤝 Como Contribuir

- [Instruções para abrir issues]
- [Guia para pull requests]
- [Padrões de revisão e comunicação] -->

##  Como rodar localmente o projeto
### Rodando a API localmente (arrumaIF_api)

- Requisitos básicos: Python 3.10+ (ou versão compatível), `git`, e um gerenciador de ambientes (`venv`/`virtualenv`).
- Passos resumidos:

```bash
# 1. Entre na pasta da API
cd arrumaIF_api

# 2. Crie e ative um ambiente virtual
python -m venv .venv
source .venv/bin/activate

# 3. Atualize pip e instale dependências
python -m pip install --upgrade pip
pip install -r requirements.txt

# 4. Configure variáveis de ambiente (ex.: copiar template .env)
# cp .env.example .env
# editar .env com as credenciais e URLs necessárias

# 5. Execute a aplicação (exemplo: executável principal)
python main.py
```

- Observações: se o projeto usar `poetry`/`pipenv` ajuste os comandos correspondentes; execute migrações caso existam (ex.: Alembic) antes de iniciar a API.

### Rodando o Frontend localmente (arrumaIF_web)

- Requisitos básicos: Node.js (versão compatível), `npm`/`yarn`/`pnpm` e `git`.
- Passos resumidos:

```bash
# 1. Entre na pasta do frontend
cd arrumaIF_web

# 2. Instale dependências (escolha o gerenciador presente no projeto)
npm install

# 3. Configure variáveis de ambiente se necessário (ex.: API_BASE_URL)
# cp .env.example .env
# editar .env para apontar para a API local (ex.: http://localhost:5000)

# 4. Inicie a aplicação em modo de desenvolvimento
npm start
```

- Observações: confirme a porta usada pela API e ajuste a configuração `API_BASE_URL` do frontend; para builds de produção, execute `npm run build` (ou equivalente) e siga a estratégia de deploy do projeto.



## 👥 Colaboradores

<table align="center" cellpadding="10" cellspacing="0">
    <tr>
        <td align="center">
            <a href="https://www.linkedin.com/in/gabriel-capodeferro/">
                <img src="https://github.com/gabrielcapodeferro.png" width="100px" alt="" /><br />
                <sub><b>Gabriel Capodeferro</b></sub>
            </a>
            <br />
            <sub><b>Documentation</b></sub>
        </td>
        <td align="center">
            <a href="https://www.linkedin.com/in/giovanni-alves-medici/">
                <img src="https://github.com/Giovanni-Alves-Medici.png" width="100px" alt="" /><br />
                <sub><b>Giovanni Alves Medici</b></sub>
            </a>
            <br />
            <sub><b>Product Owner & UX/UI</b></sub>
        </td>
        <td align="center">
            <a href="https://www.linkedin.com/in/jaiane-silva-6911ab292/">
                <img src="https://github.com/jaianesilva.png" width="100px" alt="" /><br />
                <sub><b>Jaiane Silva</b></sub>
            </a>
            <br />
            <sub><b>Front-End Dev</b></sub>
        </td>
        <td align="center">
            <a href="https://www.linkedin.com/in/jaine-vit%C3%B3ria-897b7a27b/">
                <img src="https://github.com/JaineVitoria.png" width="100px" alt="" /><br />
                <sub><b>Jaine Vitória Silva</b></sub>
            </a>
            <br />
            <sub><b>Front-End Dev</b></sub>
        </td>
        <td align="center">
            <a href="https://www.linkedin.com/in/galasso-matheus">
                <img src="https://github.com/Gatasso.png" width="100px" alt="" /><br />
                <sub><b>Matheus Galasso Romera</b></sub>
            </a>
            <br />
            <sub><b>Product Owner & Backend</b></sub>
        </td>
    </tr>
</table>

<!-- ## 📄 Licença

- [Tipo de licença open source]
- [Link para o arquivo de licença] -->

