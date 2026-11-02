# Marta Ferreira Extensions

Site estático de https://martaferreiraextensions.pt, hospedado no Cloudflare Pages.

- Textos e contactos: `build.mjs`
- Estilos, fontes, imagens e configuração do Cloudflare: `public/`

Gerar e ver localmente: `npm run preview`, depois abrir http://localhost:4173

Publicar: `node build.mjs && npx wrangler pages deploy dist --project-name martaferreiraextensions`
