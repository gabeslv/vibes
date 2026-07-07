# VIBES

VIBES é uma aplicação React/TypeScript para descobrir filmes e músicas a partir do humor, energia e ambiente do usuário.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Framer Motion
- Lucide React
- TMDB API (filmes)
- Last.fm API (músicas)
- localStorage (favoritos, histórico e tema)

## Rodando localmente

```bash
npm install
```

Copie `.env.example` para `.env` e preencha:

```env
VITE_TMDB_API_KEY=...
VITE_LASTFM_API_KEY=...
```

Depois:

```bash
npm run dev
```

## APIs

TMDB: crie uma conta em https://www.themoviedb.org/ e obtenha uma chave nas configurações da API.

Last.fm: crie uma API key em https://www.last.fm/api/account/create.

> As chaves usadas no frontend são adequadas para um projeto de portfólio/desenvolvimento. Para produção, não coloque credenciais privadas no cliente: prefira um backend/proxy próprio.

## Build

```bash
npm run build
npm run preview
```

## Funcionalidades

- Quiz de vibe em 4 etapas
- Recomendações reais via TMDB e Last.fm
- Busca global
- Detalhes de filmes
- Favoritos persistidos
- Histórico de vibes
- Perfil com estatísticas locais
- Dark / Light / Sistema
- Responsividade
- Loading, erro e estados vazios
- Animações com Framer Motion
