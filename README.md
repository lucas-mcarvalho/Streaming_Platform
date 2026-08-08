# Cineflix — Streaming Platform

Plataforma de streaming com backend Spring Boot e front-end React. A interface inclui catálogo responsivo, busca, detalhes dos títulos, player, lista pessoal, autenticação e envio de filmes.

## Executar com Docker

```bash
docker compose up --build
```

- Front-end: http://localhost:3000
- Backend: http://localhost:8080
- PgAdmin: http://localhost:5050

## Executar o front-end em desenvolvimento

Requer Node.js 20 ou superior.

```bash
cd Frontend
npm install
npm run dev
```

O Vite abre a aplicação em http://localhost:5173 e encaminha chamadas de `/api` para o backend em `http://localhost:8080`.

No Docker, usuários e catálogo são persistidos no PostgreSQL e os vídeos/capas no volume `media_data`. Uploads realizados antes da configuração desse volume precisam ser enviados novamente, pois as versões anteriores do backend salvavam apenas o caminho do arquivo.

Para usar outra URL de API, defina `VITE_API_URL`:

```bash
VITE_API_URL=https://sua-api.example.com npm run dev
```
